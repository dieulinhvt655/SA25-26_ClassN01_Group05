const cartRepository = require('../repositories/cart.repository');
const cartItemRepository = require('../repositories/cart-item.repository');
const foodServiceClient = require('../clients/food-service.client');
const { calculateItemSubtotal } = require('../utils/cart.utils');
const CartItem = require('../models/cart-item.model');

const CART_STATUS = {
    ACTIVE: 'active',
    CHECKED_OUT: 'checked_out'
};

/**
 * Nghiệp vụ 4.1: Tạo giỏ hàng.
 * - Kiểm tra giỏ ACTIVE theo userId.
 * - Nếu chưa tồn tại: tạo Cart mới, status = ACTIVE, trả về thông tin giỏ hàng.
 * - Nếu đã có: trả về thông tin giỏ hàng hiện có.
 */
async function createCart(userId) {
    if (!userId) {
        throw new Error('UserId is required');
    }

    const existingCart = await cartRepository.findActiveCartByUserId(userId);
    if (existingCart) {
        const items = await cartItemRepository.findByCartId(existingCart.cartId);
        return { ...existingCart.toJSON(), items: items.map(item => item.toJSON()) };
    }

    const cart = await cartRepository.create(userId, CART_STATUS.ACTIVE);
    const items = await cartItemRepository.findByCartId(cart.cartId);
    return { ...cart.toJSON(), items: items.map(item => item.toJSON()) };
}

/**
 * Nghiệp vụ 4.2: Thêm món vào giỏ.
 * - Gọi Food-service: kiểm tra món tồn tại, lấy thông tin (tên, giá, trạng thái bán).
 * - Nếu món không hợp lệ → trả lỗi.
 * - Nếu món hợp lệ: nếu đã có trong giỏ → tăng số lượng; chưa có → tạo CartItem mới.
 * - Cập nhật tổng tiền giỏ hàng. Trả về giỏ hàng mới nhất.
 */
async function addItemToCart(userId, foodId, quantity = 1) {
    if (!userId) {
        throw new Error('UserId is required');
    }
    if (!foodId) {
        throw new Error('FoodId is required');
    }
    if (quantity == null || quantity < 1) {
        throw new Error('Quantity must be at least 1');
    }

    const food = await foodServiceClient.getFoodById(foodId);
    if (!food.foodName || food.unitPrice < 0) {
        throw new Error('Food data invalid');
    }

    let cart = await cartRepository.findActiveCartByUserId(userId);
    if (!cart) {
        cart = await cartRepository.create(userId, CART_STATUS.ACTIVE);
    }

    const existingItem = await cartItemRepository.findByCartIdAndFoodId(cart.cartId, foodId);
    if (existingItem) {
        const newQuantity = existingItem.quantity + quantity;
        const newTotalPrice = calculateItemSubtotal(existingItem.unitPrice, newQuantity);
        await cartItemRepository.updateQuantityAndTotalPrice(existingItem.cartItemId, newQuantity, newTotalPrice);
    } else {
        const totalPrice = calculateItemSubtotal(food.unitPrice, quantity);
        const newItem = new CartItem({
            cartId: cart.cartId,
            foodId: food.foodId,
            foodName: food.foodName,
            foodImage: food.foodImage,
            unitPrice: food.unitPrice,
            quantity,
            totalPrice,
            note: null,
            isAvailable: food.isAvailable
        });
        await cartItemRepository.create(newItem);
    }

    await recalculateCartTotals(cart.cartId);
    return getCartByUserId(userId);
}

/**
 * Nghiệp vụ 4.3: Cập nhật số lượng món.
 * - Kiểm tra CartItem tồn tại.
 * - Nếu quantity = 0 → xoá CartItem.
 * - Nếu quantity > 0: cập nhật quantity, totalPrice của CartItem, cập nhật totalAmount/totalItems của Cart.
 * - Trả về giỏ hàng đã cập nhật.
 */
async function updateItemQuantity(userId, foodId, quantity) {
    if (quantity < 0) {
        throw new Error('Quantity cannot be negative');
    }

    const cart = await cartRepository.findActiveCartByUserId(userId);
    if (!cart) {
        throw new Error('Cart not found for this user');
    }

    const cartItem = await cartItemRepository.findByCartIdAndFoodId(cart.cartId, foodId);
    if (!cartItem) {
        throw new Error('CartItem not found');
    }

    if (quantity === 0) {
        await cartItemRepository.deleteByCartIdAndFoodId(cart.cartId, foodId);
    } else {
        const totalPrice = calculateItemSubtotal(cartItem.unitPrice, quantity);
        await cartItemRepository.updateQuantityAndTotalPrice(cartItem.cartItemId, quantity, totalPrice);
    }

    await recalculateCartTotals(cart.cartId);
    return getCartByUserId(userId);
}

/**
 * Nghiệp vụ 4.4: Xoá món khỏi giỏ.
 * - Xoá CartItem tương ứng.
 * - Cập nhật tổng tiền và tổng số món của Cart.
 * - Trả về giỏ hàng mới nhất.
 */
async function removeItemFromCart(userId, foodId) {
    const cart = await cartRepository.findActiveCartByUserId(userId);
    if (!cart) {
        throw new Error('Cart not found for this user');
    }

    const deleted = await cartItemRepository.deleteByCartIdAndFoodId(cart.cartId, foodId);
    if (!deleted) {
        throw new Error('CartItem not found');
    }

    await recalculateCartTotals(cart.cartId);
    return getCartByUserId(userId);
}

/**
 * Nghiệp vụ 4.5: Xem giỏ hàng.
 * - Lấy Cart và danh sách CartItem.
 * - Trả về: danh sách món, tổng tiền, trạng thái món (isAvailable).
 */
async function getCartByUserId(userId) {
    const cart = await cartRepository.findActiveCartByUserId(userId);
    if (!cart) {
        throw new Error('Cart not found for this user');
    }

    const items = await cartItemRepository.findByCartId(cart.cartId);
    return {
        ...cart.toJSON(),
        items: items.map(item => item.toJSON())
    };
}

/**
 * Cập nhật totalAmount và totalItems của Cart (dùng nội bộ sau khi đổi items).
 */
async function recalculateCartTotals(cartId) {
    const totalAmount = await cartItemRepository.sumTotalPriceByCartId(cartId);
    const totalItems = await cartItemRepository.countByCartId(cartId);
    const cart = await cartRepository.findById(cartId);
    if (cart) {
        cart.totalAmount = totalAmount;
        cart.totalItems = totalItems;
        await cartRepository.update(cart);
    }
}

/**
 * Nghiệp vụ 4.6: Kiểm tra giỏ trước khi đặt hàng (Validate Cart).
 * - Kiểm tra từng CartItem: trạng thái bán, giá hiện tại (gọi Food-service).
 * - Nếu có món không hợp lệ: đánh dấu lỗi, trả danh sách món cần chỉnh sửa.
 * - Nếu hợp lệ: trả kết quả giỏ hợp lệ.
 * @returns { valid: boolean, itemsToFix?: Array<{ cartItemId, foodId, foodName, reason, currentPrice?, currentAvailable? }> }
 */
async function validateCart(userId) {
    if (!userId) {
        throw new Error('UserId is required');
    }

    const cart = await cartRepository.findActiveCartByUserId(userId);
    if (!cart) {
        throw new Error('Cart not found for this user');
    }

    const items = await cartItemRepository.findByCartId(cart.cartId);
    const itemsToFix = [];

    for (const item of items) {
        let food;
        try {
            food = await foodServiceClient.getFoodById(item.foodId);
        } catch (err) {
            itemsToFix.push({
                cartItemId: item.cartItemId,
                foodId: item.foodId,
                foodName: item.foodName,
                reason: 'not_found',
                message: err.message || 'Food not found or unavailable'
            });
            continue;
        }

        if (!food.isAvailable) {
            itemsToFix.push({
                cartItemId: item.cartItemId,
                foodId: item.foodId,
                foodName: item.foodName,
                reason: 'not_available',
                currentAvailable: false,
                message: 'Món hiện không còn bán'
            });
        }

        const currentPrice = food.unitPrice;
        if (currentPrice !== item.unitPrice) {
            itemsToFix.push({
                cartItemId: item.cartItemId,
                foodId: item.foodId,
                foodName: item.foodName,
                reason: 'price_changed',
                cartPrice: item.unitPrice,
                currentPrice,
                message: `Giá đã thay đổi từ ${item.unitPrice} thành ${currentPrice}`
            });
        }
    }

    return {
        valid: itemsToFix.length === 0,
        ...(itemsToFix.length > 0 && { itemsToFix })
    };
}

/**
 * Nghiệp vụ 4.7: Đóng giỏ sau khi checkout.
 * - Order-service thông báo checkout thành công.
 * - Cart-service cập nhật trạng thái Cart = CHECKED_OUT.
 * - Không cho phép chỉnh sửa giỏ hàng nữa (các API thêm/sửa/xóa món chỉ tác động giỏ ACTIVE).
 */
async function checkoutCart(userId) {
    if (!userId) {
        throw new Error('UserId is required');
    }

    const cart = await cartRepository.findActiveCartByUserId(userId);
    if (!cart) {
        throw new Error('Cart not found for this user');
    }

    await cartRepository.updateStatus(cart.cartId, CART_STATUS.CHECKED_OUT);
    const updatedCart = await cartRepository.findById(cart.cartId);
    return updatedCart.toJSON();
}

module.exports = {
    createCart,
    addItemToCart,
    updateItemQuantity,
    removeItemFromCart,
    getCartByUserId,
    validateCart,
    checkoutCart
};

