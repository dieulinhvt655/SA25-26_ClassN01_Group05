/**
 * ===========================================
 * SEARCH SERVICE - LOGIC TÌM KIẾM
 * ===========================================
 * 
 * Service này xử lý logic tìm kiếm food/restaurants.
 * 
 * GIAO TIẾP GIỮA CÁC MICROSERVICES:
 * - Discovery Service KHÔNG có database riêng cho Food
 * - Dữ liệu Food nằm ở Restaurant Service (Food Service - port 3001)
 * - Ta dùng HTTP (axios) để gọi sang Food Service lấy dữ liệu
 * 
 * Đây là ví dụ về Inter-Service Communication trong Microservices!
 */

const axios = require('axios');
require('dotenv').config();

// URL của Food Service từ .env
const FOOD_SERVICE_URL = process.env.FOOD_SERVICE_URL || 'http://localhost:3001/api/foods';

/**
 * TÌM KIẾM FOOD THEO CÁC TIÊU CHÍ
 * 
 * Quy trình:
 * 1. Gọi HTTP GET đến Food Service để lấy tất cả foods
 * 2. Filter kết quả theo các tiêu chí (keyword, category, minPrice)
 * 3. Trả về danh sách food phù hợp
 * 
 * @param {Object} searchParams - Tham số tìm kiếm
 * @param {string} searchParams.keyword - Từ khóa tìm trong tên food
 * @param {string} searchParams.category - Danh mục food
 * @param {number} searchParams.minPrice - Giá tối thiểu
 * @param {number} searchParams.maxPrice - Giá tối đa
 * @returns {Array} Danh sách food phù hợp
 */
async function searchFoods(searchParams) {
    const { keyword, category, minPrice, maxPrice } = searchParams;

    try {
        // Bước 1: Gọi HTTP đến Food Service
        // Đây là Inter-Service Communication - một service gọi service khác
        console.log(`📡 Đang gọi Food Service: ${FOOD_SERVICE_URL}`);

        const response = await axios.get(FOOD_SERVICE_URL);
        let foods = response.data;

        console.log(`📦 Nhận được ${foods.length} items từ Food Service`);

        // Bước 2: Filter theo keyword (tìm trong tên food)
        if (keyword) {
            const keywordLower = keyword.toLowerCase();
            foods = foods.filter(food =>
                food.name && food.name.toLowerCase().includes(keywordLower)
            );
            console.log(`🔍 Sau khi lọc keyword "${keyword}": ${foods.length} items`);
        }

        // Bước 3: Filter theo category (nếu Food có trường category)
        if (category) {
            const categoryLower = category.toLowerCase();
            foods = foods.filter(food =>
                food.category && food.category.toLowerCase() === categoryLower
            );
            console.log(`📂 Sau khi lọc category "${category}": ${foods.length} items`);
        }

        // Bước 4: Filter theo giá tối thiểu
        if (minPrice) {
            const min = parseFloat(minPrice);
            foods = foods.filter(food =>
                food.price && food.price >= min
            );
            console.log(`💰 Sau khi lọc minPrice ${minPrice}: ${foods.length} items`);
        }

        // Bước 5: Filter theo giá tối đa
        if (maxPrice) {
            const max = parseFloat(maxPrice);
            foods = foods.filter(food =>
                food.price && food.price <= max
            );
            console.log(`💰 Sau khi lọc maxPrice ${maxPrice}: ${foods.length} items`);
        }

        return foods;

    } catch (error) {
        // Xử lý lỗi khi không thể kết nối Food Service
        console.error('❌ Lỗi khi gọi Food Service:', error.message);

        // Trong microservices, khi một service down, ta có thể:
        // 1. Trả về cache data (nếu có)
        // 2. Trả về error message rõ ràng
        // 3. Sử dụng Circuit Breaker pattern
        throw new Error(`Không thể kết nối Food Service: ${error.message}`);
    }
}

// Export function
module.exports = {
    searchFoods
};
