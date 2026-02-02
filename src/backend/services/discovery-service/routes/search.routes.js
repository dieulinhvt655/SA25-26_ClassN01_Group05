/**
 * ===========================================
 * SEARCH ROUTES - ĐỊNH NGHĨA ENDPOINTS
 * ===========================================
 * 
 * File này định nghĩa các API endpoints cho tìm kiếm.
 * 
 * Endpoints:
 * - GET /search - Tìm kiếm food với các filter
 */

const express = require('express');
const router = express.Router();
const searchController = require('../controllers/search.controller');

/**
 * GET /search
 * Tìm kiếm food theo các tiêu chí
 * 
 * Query Parameters:
 * - keyword: Từ khóa (tìm trong tên)
 * - category: Danh mục
 * - minPrice: Giá tối thiểu
 * - maxPrice: Giá tối đa
 * 
 * Ví dụ:
 * GET /search?keyword=pizza
 * GET /search?minPrice=30000&maxPrice=100000
 */
router.get('/search', searchController.search);

// Export router
module.exports = router;
