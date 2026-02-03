/**
 * Notification Controller
 * 
 * Chịu trách nhiệm:
 * - Xử lý HTTP requests cho notifications
 * - Validate request params
 * - Trả response với format nhất quán
 * - KHÔNG chứa business logic
 */

const notificationService = require('../services/notification.service');

class NotificationController {
    /**
     * GET /notifications?userId=
     * Lấy danh sách notifications của user
     */
    async getNotifications(req, res) {
        try {
            const { userId, page, limit } = req.query;

            if (!userId) {
                return res.status(400).json({
                    success: false,
                    message: 'userId là bắt buộc'
                });
            }

            const result = await notificationService.getNotificationsByUserId(userId, { page, limit });

            res.status(200).json({
                success: true,
                ...result
            });
        } catch (error) {
            console.error('❌ Error getting notifications:', error.message);
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    /**
     * PATCH /notifications/:id/read
     * Đánh dấu một notification là đã đọc
     */
    async markAsRead(req, res) {
        try {
            const { id } = req.params;

            const notification = await notificationService.markAsRead(id);

            res.status(200).json({
                success: true,
                message: 'Đã đánh dấu là đã đọc',
                data: notification
            });
        } catch (error) {
            console.error('❌ Error marking as read:', error.message);
            res.status(404).json({
                success: false,
                message: error.message
            });
        }
    }

    /**
     * PATCH /notifications/read-all?userId=
     * Đánh dấu tất cả notifications của user là đã đọc
     */
    async markAllAsRead(req, res) {
        try {
            const { userId } = req.query;

            if (!userId) {
                return res.status(400).json({
                    success: false,
                    message: 'userId là bắt buộc'
                });
            }

            const count = await notificationService.markAllAsRead(userId);

            res.status(200).json({
                success: true,
                message: `Đã đánh dấu ${count} notifications là đã đọc`
            });
        } catch (error) {
            console.error('❌ Error marking all as read:', error.message);
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    /**
     * GET /notifications/unread-count?userId=
     * Lấy số lượng notifications chưa đọc
     */
    async getUnreadCount(req, res) {
        try {
            const { userId } = req.query;

            if (!userId) {
                return res.status(400).json({
                    success: false,
                    message: 'userId là bắt buộc'
                });
            }

            const count = await notificationService.countUnread(userId);

            res.status(200).json({
                success: true,
                data: { unreadCount: count }
            });
        } catch (error) {
            console.error('❌ Error getting unread count:', error.message);
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }
}

module.exports = new NotificationController();
