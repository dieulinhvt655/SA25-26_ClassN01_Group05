/**
 * DeviceToken Routes
 * 
 * Định nghĩa các HTTP endpoints cho device tokens.
 * Mobile apps sử dụng các APIs này để đăng ký/xóa FCM tokens.
 */

const express = require('express');
const router = express.Router();
const deviceTokenController = require('../controllers/deviceToken.controller');

// POST /device-tokens
// Đăng ký device token mới
router.post('/', deviceTokenController.registerToken.bind(deviceTokenController));

// GET /device-tokens?userId=
// Lấy danh sách tokens của user (optional)
router.get('/', deviceTokenController.getTokensByUser.bind(deviceTokenController));

// DELETE /device-tokens/:token
// Xóa device token
router.delete('/:token', deviceTokenController.removeToken.bind(deviceTokenController));

module.exports = router;
