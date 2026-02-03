/**
 * Client gọi Restaurant-service (MenuItem). Chỉ thực hiện HTTP request, không chứa nghiệp vụ.
 * Trả về thông tin món (tên, giá, trạng thái bán) dạng giống food-service để cart.service dùng.
 * Restaurant-service: GET /items/:id → MenuItem (id UUID, name, basePrice, imageUrl, isAvailable).
 */
require('dotenv').config();

const RESTAURANT_SERVICE_URL = process.env.RESTAURANT_SERVICE_URL || 'http://localhost:3004';
const baseURL = `${RESTAURANT_SERVICE_URL.replace(/\/$/, '')}/items`;

/**
 * Gọi Restaurant-service lấy thông tin món (MenuItem) theo id.
 * @param {string} itemId - Id món ăn (UUID từ restaurant-service)
 * @returns {Promise<{ foodId, foodName, unitPrice, foodImage, isAvailable }>}
 * @throws {Error} Nếu món không tồn tại hoặc Restaurant-service lỗi
 */
async function getFoodById(itemId) {
    const url = `${baseURL}/${encodeURIComponent(itemId)}`;
    let res;
    try {
        res = await fetch(url);
    } catch (err) {
        throw new Error(`Restaurant-service unavailable: ${err.message}`);
    }

    if (!res.ok) {
        if (res.status === 404) {
            throw new Error('Food not found');
        }
        throw new Error(`Restaurant-service error: ${res.status}`);
    }

    const json = await res.json();
    const data = json.data || json;
    const price = data.basePrice ?? data.base_price ?? 0;
    return {
        foodId: data.id ?? itemId,
        foodName: data.name ?? '',
        unitPrice: parseFloat(price),
        foodImage: data.imageUrl ?? data.image_url ?? null,
        isAvailable: data.isAvailable !== undefined ? data.isAvailable : (data.is_available !== undefined ? data.is_available : true)
    };
}

module.exports = {
    getFoodById
};
