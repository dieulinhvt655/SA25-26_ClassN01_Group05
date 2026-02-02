/**
 * Client gọi Payment-service: thanh toán đơn hàng.
 */
const axios = require('axios');

const PAYMENT_SERVICE_URL = process.env.PAYMENT_SERVICE_URL || 'http://localhost:3004';
const baseURL = `${PAYMENT_SERVICE_URL.replace(/\/$/, '')}/api/payments`;

/**
 * Gửi yêu cầu thanh toán cho đơn hàng.
 * @param { number } orderId
 * @param { number } amount
 * @param { string } userId
 * @returns { Promise<{ success: boolean, message?: string }> }
 */
async function payOrder(orderId, amount, userId) {
    const { data, status } = await axios.post(
        `${baseURL}/pay`,
        { orderId, amount, userId },
        { timeout: 15000, validateStatus: () => true }
    );
    if (status !== 200) {
        return { success: false, message: data.message || data.error || 'Payment request failed' };
    }
    return {
        success: data.success === true,
        message: data.message
    };
}

module.exports = {
    payOrder
};
