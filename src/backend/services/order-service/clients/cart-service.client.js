/**
 * Client gọi Cart-service: validate giỏ, lấy giỏ theo user, checkout.
 */
const axios = require('axios');

const CART_SERVICE_URL = process.env.CART_SERVICE_URL || 'http://localhost:3002';
const baseURL = `${CART_SERVICE_URL.replace(/\/$/, '')}/api/carts`;

/**
 * Gọi POST /api/carts/validate với body { userId }.
 * @returns { Promise<{ valid: boolean, itemsToFix?: Array }> }
 */
async function validateCart(userId) {
    const { data } = await axios.post(`${baseURL}/validate`, { userId }, {
        timeout: 10000,
        validateStatus: () => true
    });
    if (data.error) {
        throw new Error(data.error.message || data.error);
    }
    return data;
}

/**
 * Gọi GET /api/carts/user/:userId để lấy giỏ hàng và items.
 * @returns { Promise<{ cartId, userId, status, totalAmount, totalItems, items: Array }> }
 */
async function getCartByUserId(userId) {
    const { data, status } = await axios.get(`${baseURL}/user/${encodeURIComponent(userId)}`, {
        timeout: 10000,
        validateStatus: () => true
    });
    if (status !== 200 || data.error) {
        throw new Error(data.error?.message || data.message || 'Cart not found');
    }
    return data;
}

/**
 * Gọi POST /api/carts/checkout với body { userId } (đóng giỏ sau khi tạo đơn).
 */
async function checkoutCart(userId) {
    const { data, status } = await axios.post(`${baseURL}/checkout`, { userId }, {
        timeout: 10000,
        validateStatus: () => true
    });
    if (status !== 200 || data.error) {
        throw new Error(data.error?.message || data.message || 'Checkout failed');
    }
    return data;
}

module.exports = {
    validateCart,
    getCartByUserId,
    checkoutCart
};
