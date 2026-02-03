const express = require('express');
const router = express.Router();
const restaurantController = require('../controllers/restaurant.controller');

// Routes cho Restaurant
// GET /restaurants - Lấy danh sách nhà hàng
router.get('/', restaurantController.getAllRestaurants);

// GET /restaurants/:id - Lấy chi tiết nhà hàng (có thể thêm ?includeMenu=true)
router.get('/:id', restaurantController.getRestaurantById);

// POST /restaurants - Tạo nhà hàng mới
router.post('/', restaurantController.createRestaurant);

// PUT /restaurants/:id - Cập nhật nhà hàng
router.put('/:id', restaurantController.updateRestaurant);

// DELETE /restaurants/:id - Xóa nhà hàng
router.delete('/:id', restaurantController.deleteRestaurant);

module.exports = router;
