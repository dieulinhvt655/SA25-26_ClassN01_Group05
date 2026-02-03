const express = require('express');
const router = express.Router();
const itemController = require('../controllers/item.controller');

// Routes cho MenuItem
// GET /categories/:categoryId/items - Lấy món ăn theo danh mục
router.get('/categories/:categoryId/items', itemController.getItemsByCategoryId);

// POST /categories/:categoryId/items - Tạo món ăn mới
router.post('/categories/:categoryId/items', itemController.createItem);

// GET /items/:id - Lấy chi tiết món ăn (mặc định include options)
router.get('/items/:id', itemController.getItemById);

// PUT /items/:id - Cập nhật món ăn
router.put('/items/:id', itemController.updateItem);

// DELETE /items/:id - Xóa món ăn
router.delete('/items/:id', itemController.deleteItem);

module.exports = router;
