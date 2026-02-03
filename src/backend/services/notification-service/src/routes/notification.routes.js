/**
 * Notification Routes
 * 
 * Định nghĩa các HTTP endpoints cho notifications.
 * Các APIs này CHỈ dùng để query và quản lý notifications.
 * KHÔNG có API để gửi notification (việc gửi thông qua RabbitMQ events).
 */

const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notification.controller');

// GET /notifications?userId=&page=&limit=
// Lấy danh sách notifications của user
router.get('/', notificationController.getNotifications.bind(notificationController));

// GET /notifications/unread-count?userId=
// Lấy số lượng chưa đọc (phải đặt trước /:id để tránh conflict)
router.get('/unread-count', notificationController.getUnreadCount.bind(notificationController));

// PATCH /notifications/read-all?userId=
// Đánh dấu tất cả là đã đọc
router.patch('/read-all', notificationController.markAllAsRead.bind(notificationController));

// PATCH /notifications/:id/read
// Đánh dấu một notification là đã đọc
router.patch('/:id/read', notificationController.markAsRead.bind(notificationController));

module.exports = router;
