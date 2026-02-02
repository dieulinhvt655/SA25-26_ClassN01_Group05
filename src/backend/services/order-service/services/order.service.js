const orderRepository = require('../repositories/order.repository');
const orderItemRepository = require('../repositories/order-item.repository');
const db = require('../config/database');
const cartServiceClient = require('../clients/cart-service.client');
const paymentServiceClient = require('../clients/payment-service.client');
const deliveryServiceClient = require('../clients/delivery-service.client');

const STATUS = {
    PENDING_PAYMENT: 'pending_payment',
    PAYMENT_FAILED: 'payment_failed',
    PAID: 'paid',
    CONFIRMED: 'confirmed',
    DELIVERING: 'delivering',
    COMPLETED: 'completed',
    CANCELLED: 'cancelled'
};

const ALLOWED_STATUS_TRANSITIONS = {
    [STATUS.CONFIRMED]: [STATUS.DELIVERING],
    [STATUS.DELIVERING]: [STATUS.COMPLETED]
};

const CANCELLABLE_STATUSES = [STATUS.PENDING_PAYMENT, STATUS.PAYMENT_FAILED, STATUS.PAID, STATUS.CONFIRMED];

/**
 * Nghiệp vụ 4.1: Tạo đơn hàng từ giỏ hàng hợp lệ.
 */
async function createOrder(userId) {
    if (!userId) {
        throw new Error('UserId is required');
    }

    const validateResult = await cartServiceClient.validateCart(userId);
    if (!validateResult.valid) {
        const err = new Error('Cart is not valid for checkout');
        err.code = 'CART_INVALID';
        err.itemsToFix = validateResult.itemsToFix || [];
        throw err;
    }

    const cart = await cartServiceClient.getCartByUserId(userId);
    if (!cart.items || cart.items.length === 0) {
        throw new Error('Cart is empty');
    }

    let conn;
    try {
        conn = await db.beginTransaction();

        const order = await orderRepository.create(
            userId,
            cart.cartId,
            STATUS.PENDING_PAYMENT,
            Number(cart.totalAmount) || 0,
            Number(cart.totalItems) || 0,
            conn
        );

        for (const item of cart.items) {
            await orderItemRepository.create(
                {
                    orderId: order.orderId,
                    foodId: item.foodId,
                    foodName: item.foodName,
                    foodImage: item.foodImage,
                    unitPrice: item.unitPrice,
                    quantity: item.quantity,
                    totalPrice: item.totalPrice,
                    note: item.note
                },
                conn
            );
        }

        await db.commit(conn);
    } catch (e) {
        if (conn) await db.rollback(conn);
        throw e;
    }

    await cartServiceClient.checkoutCart(userId);

    const savedOrder = await orderRepository.findById(order.orderId);
    const items = await orderItemRepository.findByOrderId(order.orderId);
    return {
        ...savedOrder.toJSON(),
        items: items.map(i => i.toJSON())
    };
}

/**
 * 2.1 Xem chi tiết đơn hàng: thông tin đơn + danh sách OrderItem + trạng thái.
 */
async function getOrderById(orderId) {
    const order = await orderRepository.findById(orderId);
    if (!order) {
        throw new Error('Order not found');
    }
    const items = await orderItemRepository.findByOrderId(orderId);
    return { ...order.toJSON(), items: items.map(item => item.toJSON()) };
}

/**
 * 2.2 Xem danh sách đơn hàng: lọc theo userId, có thể lọc theo trạng thái.
 */
async function getOrders(userId, status = null, limit = 50) {
    if (!userId) {
        throw new Error('UserId is required');
    }
    const orders = await orderRepository.findByUserId(userId, limit, status);
    return orders.map(o => o.toJSON());
}

/** Giữ tương thích: getOrdersByUserId = getOrders với status null */
async function getOrdersByUserId(userId, limit = 50) {
    return getOrders(userId, null, limit);
}

/**
 * 3. Thanh toán đơn hàng: gửi yêu cầu sang payment-service, cập nhật PAID hoặc PAYMENT_FAILED.
 */
async function payOrder(orderId) {
    const order = await orderRepository.findById(orderId);
    if (!order) {
        throw new Error('Order not found');
    }
    if (order.status !== STATUS.PENDING_PAYMENT) {
        throw new Error(`Order cannot be paid in status: ${order.status}`);
    }

    let result;
    try {
        result = await paymentServiceClient.payOrder(
            orderId,
            Number(order.totalAmount) || 0,
            order.userId
        );
    } catch (e) {
        await orderRepository.updateStatus(orderId, STATUS.PAYMENT_FAILED);
        const err = new Error(e.message || 'Payment service unavailable');
        err.code = 'PAYMENT_FAILED';
        throw err;
    }

    if (result.success) {
        await orderRepository.updateStatus(orderId, STATUS.PAID);
    } else {
        await orderRepository.updateStatus(orderId, STATUS.PAYMENT_FAILED);
        const err = new Error(result.message || 'Payment failed');
        err.code = 'PAYMENT_FAILED';
        throw err;
    }

    return getOrderById(orderId);
}

/**
 * 4. Xác nhận đơn hàng: điều kiện PAID → CONFIRMED, gọi cart checkout, gọi delivery-service tạo đơn giao.
 */
async function confirmOrder(orderId) {
    const order = await orderRepository.findById(orderId);
    if (!order) {
        throw new Error('Order not found');
    }
    if (order.status !== STATUS.PAID) {
        throw new Error(`Order can only be confirmed when status is paid. Current: ${order.status}`);
    }

    await orderRepository.updateStatus(orderId, STATUS.CONFIRMED);
    try {
        await cartServiceClient.checkoutCart(order.userId);
    } catch (e) {
        // Cart có thể đã checkout khi tạo đơn; bỏ qua nếu lỗi "already checked out"
    }
    try {
        await deliveryServiceClient.createDelivery(orderId, order.userId);
    } catch (e) {
        // Giữ order CONFIRMED; delivery có thể tạo sau hoặc retry
        console.warn('Delivery creation failed for order', orderId, e.message);
    }

    return getOrderById(orderId);
}

/**
 * 5. Cập nhật trạng thái: chỉ cho phép CONFIRMED→DELIVERING, DELIVERING→COMPLETED.
 */
async function updateOrderStatus(orderId, newStatus) {
    const order = await orderRepository.findById(orderId);
    if (!order) {
        throw new Error('Order not found');
    }

    const allowed = ALLOWED_STATUS_TRANSITIONS[order.status];
    if (!allowed || !allowed.includes(newStatus)) {
        throw new Error(`Invalid status transition: ${order.status} → ${newStatus}`);
    }

    await orderRepository.updateStatus(orderId, newStatus);
    return getOrderById(orderId);
}

/**
 * 6. Huỷ đơn hàng: chỉ khi chưa ở trạng thái DELIVERING (và COMPLETED).
 */
async function cancelOrder(orderId) {
    const order = await orderRepository.findById(orderId);
    if (!order) {
        throw new Error('Order not found');
    }
    if (!CANCELLABLE_STATUSES.includes(order.status)) {
        throw new Error(`Order cannot be cancelled in status: ${order.status}`);
    }

    await orderRepository.updateStatus(orderId, STATUS.CANCELLED);
    return getOrderById(orderId);
}

module.exports = {
    createOrder,
    getOrderById,
    getOrders,
    getOrdersByUserId,
    payOrder,
    confirmOrder,
    updateOrderStatus,
    cancelOrder,
    STATUS
};
