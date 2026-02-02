/**
 * ===========================================
 * SEARCH CONTROLLER - XỬ LÝ HTTP REQUESTS
 * ===========================================
 * 
 * Controller này nhận HTTP requests tìm kiếm từ client.
 * 
 * Endpoint: GET /search
 * Query params: keyword, category, minPrice, maxPrice
 * 
 * Ví dụ: GET /search?keyword=pizza&minPrice=50000
 */

const searchService = require('../services/search.service');

/**
 * TÌM KIẾM FOOD
 * 
 * Endpoint: GET /search
 * 
 * Query Parameters:
 * - keyword: Từ khóa tìm kiếm (tìm trong tên food)
 * - category: Danh mục (pizza, burger, vietnamese, ...)
 * - minPrice: Giá tối thiểu
 * - maxPrice: Giá tối đa
 * 
 * Ví dụ requests:
 * - GET /search?keyword=pizza
 * - GET /search?minPrice=30000&maxPrice=100000
 * - GET /search?keyword=pho&category=vietnamese
 */
exports.search = async (req, res) => {
    try {
        // Lấy các query parameters từ URL
        const { keyword, category, minPrice, maxPrice } = req.query;

        console.log('🔍 Nhận request tìm kiếm:', {
            keyword,
            category,
            minPrice,
            maxPrice
        });

        // Gọi service để tìm kiếm
        const results = await searchService.searchFoods({
            keyword,
            category,
            minPrice,
            maxPrice
        });

        // Trả về kết quả
        res.status(200).json({
            message: 'Tìm kiếm thành công',
            count: results.length,
            filters: {
                keyword: keyword || null,
                category: category || null,
                minPrice: minPrice ? parseFloat(minPrice) : null,
                maxPrice: maxPrice ? parseFloat(maxPrice) : null
            },
            data: results
        });

    } catch (error) {
        console.error('❌ Lỗi tìm kiếm:', error.message);

        // Trả về lỗi với status 503 (Service Unavailable) 
        // nếu không kết nối được Food Service
        res.status(503).json({
            error: 'Lỗi tìm kiếm',
            details: error.message
        });
    }
};
