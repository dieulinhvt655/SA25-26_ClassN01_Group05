/**
 * Order Service - Business Logic
 */
const db = require('../config/database');
const orderRepository = require('../repositories/order.repository');
const orderItemRepository = require('../repositories/order-item.repository');
const statusHistoryRepository = require('../repositories/order-status-history.repository');
const cartClient = require('../clients/cart-service.client');

/**
 * Tạo đơn hàng từ giỏ hàng hiện tại của user
 * @param {string} userId 
 * @param {object} shippingInfo { deliveryAddress, paymentMethod }
 */

async function createOrder(userId, shippingInfo = {}) {
    if (!userId) {
        throw new Error('UserId is required');
    }

    // 1. Lấy thông tin giỏ hàng từ Cart Service
    const cart = await cartClient.getCartByUserId(userId);

    if (!cart || !cart.items || cart.items.length === 0) {
        throw new Error('Cart is empty or not found');
    }

    // Giả định cart data từ Cart Service trả về:
    // { 
    //   items: [{ foodId, foodName, foodImage, unitPrice, quantity, restaurantId, ... }],
    //   totalAmount,
    //   ... 
    // }

    // Lấy restaurantId từ item đầu tiên (quy ước 1 đơn hàng chỉ gồm 1 nhà hàng)
    const restaurantId = cart.items[0].restaurantId || 'UNKNOWN';

    // Bắt đầu transaction
    const connection = await db.beginTransaction();

    try {
        // 2. Tạo đơn hàng chính
        const orderData = {
            userId: userId,
            restaurantId: restaurantId,
            status: 'CREATED',
            totalPrice: cart.totalAmount || 0,
            discountAmount: 0, // Sẽ nâng cấp thêm logic khuyến mãi sau
            finalPrice: cart.totalAmount || 0,
            deliveryFee: shippingInfo.deliveryFee || 0,
            deliveryAddress: shippingInfo.deliveryAddress || 'Default Address',
            paymentMethod: shippingInfo.paymentMethod || 'COD',
            paymentStatus: 'PENDING'
        };

        const order = await orderRepository.create(orderData, connection);

        // 3. Tạo các items cho đơn hàng
        const orderItems = [];
        for (const item of cart.items) {
            const orderItemData = {
                orderId: order.id,
                foodId: item.foodId,
                foodName: item.foodName,
                foodImage: item.foodImage,
                unitPrice: item.unitPrice,
                quantity: item.quantity,
                totalPrice: item.unitPrice * item.quantity
            };
            const createdItem = await orderItemRepository.create(orderItemData, connection);
            orderItems.push(createdItem);
        }

        // 4. Lưu lịch sử trạng thái đầu tiên
        await statusHistoryRepository.create({
            orderId: order.id,
            status: 'CREATED',
            note: 'Order created from cart'
        }, connection);

        // 5. Gọi Cart Service để checkout/clear giỏ hàng
        try {
            await cartClient.checkoutCart(userId);
        } catch (cartError) {
            console.error('Warning: Failed to checkout cart after order creation:', cartError.message);
            // Không rollback đơn hàng nếu chỉ lỗi xóa giỏ, nhưng có thể log lại để xử lý sau
        }

        // Commit transaction
        await db.commit(connection);

        // Trả về order đầy đủ thông tin
        return {
            ...order.toJSON(),
            items: orderItems.map(item => item.toJSON())
        };

    } catch (error) {
        // Rollback nếu có lỗi
        await db.rollback(connection);
        console.error('Error in createOrder service:', error);
        throw error;
    }
}

// lấy thông tin chi tiết của 1 đơn hàng
async function getOrderById(orderId) {
    const order = await orderRepository.findById(orderId);
    if (!order) {
        throw new Error('Order not found');
    }

    // Lấy kèm items
    const items = await orderItemRepository.findByOrderId(orderId);

    return {
        ...order.toJSON(),
        items: items.map(item => item.toJSON())
    };
}

// lấy danh sách các đơn hàng
async function getOrders(userId = null, status = null, limit = 50) {
    const orders = await orderRepository.findByUserId(userId, limit, status);
    return orders.map(o => o.toJSON());
}

// lấy danh sách các đơn hàng của user
async function getOrdersByUserId(userId, limit) {
    return getOrders(userId, null, limit);
}
//
// async function payOrder(orderId) {
//     throw new Error('payOrder not implemented yet');
// }
//
// async function confirmOrder(orderId) {
//     throw new Error('confirmOrder not implemented yet');
// }
//
// async function updateOrderStatus(orderId, newStatus) {
//     throw new Error('updateOrderStatus not implemented yet');
// }
//
// async function cancelOrder(orderId) {
//     throw new Error('cancelOrder not implemented yet');
// }

module.exports = {
    createOrder,
    getOrderById,
    getOrders,
    getOrdersByUserId,
    payOrder,
    confirmOrder,
    updateOrderStatus,
    cancelOrder
};
