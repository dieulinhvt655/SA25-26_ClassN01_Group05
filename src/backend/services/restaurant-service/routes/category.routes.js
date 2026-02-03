const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/category.controller');

// Routes cho MenuCategory
// GET /restaurants/:restaurantId/categories - Lấy danh mục theo nhà hàng
router.get('/restaurants/:restaurantId/categories', categoryController.getCategoriesByRestaurantId);

// POST /restaurants/:restaurantId/categories - Tạo danh mục mới
router.post('/restaurants/:restaurantId/categories', categoryController.createCategory);

// PUT /categories/:id - Cập nhật danh mục
router.put('/categories/:id', categoryController.updateCategory);

// DELETE /categories/:id - Xóa danh mục
router.delete('/categories/:id', categoryController.deleteCategory);

module.exports = router;
