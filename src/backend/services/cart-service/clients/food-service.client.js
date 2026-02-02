/**
 * Client gọi Food-service. Chỉ thực hiện HTTP request, không chứa nghiệp vụ.
 * Trả về thông tin món (tên, giá, trạng thái bán) hoặc throw nếu món không tồn tại/không hợp lệ.
 */
require('dotenv').config();

const FOOD_SERVICE_URL = process.env.FOOD_SERVICE_URL || 'http://localhost:3001';

/**
 * Gọi Food-service lấy thông tin món theo foodId.
 * @param {number} foodId - Id món ăn
 * @returns {Promise<{ foodId, foodName, unitPrice, foodImage, isAvailable }>}
 * @throws {Error} Nếu món không tồn tại hoặc Food-service lỗi
 */
async function getFoodById(foodId) {
    const url = `${FOOD_SERVICE_URL}/api/foods/${foodId}`;
    let res;
    try {
        res = await fetch(url);
    } catch (err) {
        throw new Error(`Food-service unavailable: ${err.message}`);
    }

    if (!res.ok) {
        if (res.status === 404) {
            throw new Error('Food not found');
        }
        throw new Error(`Food-service error: ${res.status}`);
    }

    const data = await res.json();
    return {
        foodId: data.id ?? data.foodId ?? foodId,
        foodName: data.name ?? data.foodName ?? '',
        unitPrice: parseFloat(data.price ?? data.unitPrice ?? 0),
        foodImage: data.image ?? data.foodImage ?? null,
        isAvailable: data.isAvailable ?? data.available ?? true
    };
}

module.exports = {
    getFoodById
};
