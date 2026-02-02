/**
 * Client gọi Delivery-service: tạo đơn giao hàng.
 */
const axios = require('axios');

const DELIVERY_SERVICE_URL = process.env.DELIVERY_SERVICE_URL || 'http://localhost:3005';
const baseURL = `${DELIVERY_SERVICE_URL.replace(/\/$/, '')}/api/deliveries`;

/**
 * Tạo đơn giao hàng cho order.
 * @param { number } orderId
 * @param { string } userId
 * @param { object } options - address, note, etc.
 * @returns { Promise<{ success: boolean, deliveryId?: number, message?: string }> }
 */
async function createDelivery(orderId, userId, options = {}) {
    const { data, status } = await axios.post(
        `${baseURL}`,
        { orderId, userId, ...options },
        { timeout: 10000, validateStatus: () => true }
    );
    if (status !== 200 && status !== 201) {
        throw new Error(data.message || data.error || 'Delivery creation failed');
    }
    if (data.error) {
        throw new Error(data.message || data.error);
    }
    return {
        success: true,
        deliveryId: data.deliveryId || data.id
    };
}

module.exports = {
    createDelivery
};
