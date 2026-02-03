/**
 * Notification Service
 * 
 * Chịu trách nhiệm:
 * - Business logic cho notifications
 * - Xử lý events từ RabbitMQ và tạo notifications
 * - Gửi push/email notifications
 * - Không chứa logic truy vấn database (delegate cho repository)
 * 
 * LUỒNG XỬ LÝ EVENT:
 * 1. Consumer nhận event từ RabbitMQ
 * 2. Consumer gọi NotificationService.processEvent()
 * 3. Service tạo notification content dựa trên event type
 * 4. Service lưu notification vào database
 * 5. Service gửi push/email (async)
 * 6. Service cập nhật status
 */

const notificationRepository = require('../repositories/notification.repository');
const deviceTokenRepository = require('../repositories/deviceToken.repository');
const pushService = require('./push.service');
const emailService = require('./email.service');

class NotificationService {
    /**
     * Xử lý event từ RabbitMQ và tạo notification
     * @param {string} eventType - Loại event (order.confirmed, payment.success, etc.)
     * @param {Object} eventData - Dữ liệu event
     * @returns {Promise<Notification>}
     */
    async processEvent(eventType, eventData) {
        console.log(`\n📨 Processing event: ${eventType}`);
        console.log(`   Data: ${JSON.stringify(eventData)}`);

        // Map event type sang notification content
        const notificationContent = this._mapEventToNotification(eventType, eventData);

        if (!notificationContent) {
            console.log(`⚠️ Unknown event type: ${eventType}`);
            return null;
        }

        // Tạo notification trong database
        const notification = await notificationRepository.create({
            userId: eventData.userId,
            title: notificationContent.title,
            content: notificationContent.content,
            type: 'PUSH',  // Mặc định gửi push
            status: 'PENDING',
            metadata: {
                eventType,
                ...eventData
            }
        });

        console.log(`✅ Created notification ID: ${notification.id}`);

        // Gửi push notification (non-blocking)
        this._sendPushNotification(notification).catch(err => {
            console.error('❌ Error sending push:', err.message);
        });

        return notification;
    }

    /**
     * Map event type sang nội dung notification
     * @private
     */
    _mapEventToNotification(eventType, eventData) {
        const templates = {
            'order.confirmed': {
                title: '🎉 Đơn hàng đã được xác nhận!',
                content: `Đơn hàng #${eventData.orderId} từ ${eventData.restaurantName || 'nhà hàng'} đã được xác nhận. Tổng: ${this._formatCurrency(eventData.totalAmount)}`
            },
            'order.delivered': {
                title: '✅ Đơn hàng đã giao thành công!',
                content: `Đơn hàng #${eventData.orderId} đã được giao. Cảm ơn bạn đã sử dụng dịch vụ!`
            },
            'payment.success': {
                title: '💰 Thanh toán thành công!',
                content: `Bạn đã thanh toán ${this._formatCurrency(eventData.amount)} qua ${eventData.paymentMethod || 'ví điện tử'}. Mã đơn: #${eventData.orderId}`
            },
            'user.registered': {
                title: '👋 Chào mừng bạn đến với Yummy!',
                content: `Xin chào ${eventData.name || 'bạn'}! Hãy khám phá các nhà hàng và đặt món ngon nhé!`
            }
        };

        return templates[eventType] || null;
    }

    /**
     * Format tiền tệ VND
     * @private
     */
    _formatCurrency(amount) {
        if (!amount) return '0đ';
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(amount);
    }

    /**
     * Gửi push notification qua Firebase
     * @private
     */
    async _sendPushNotification(notification) {
        // Lấy device tokens của user
        const tokens = await deviceTokenRepository.findActiveByUserId(notification.userId);

        if (tokens.length === 0) {
            console.log(`⚠️ User ${notification.userId} không có device tokens`);
            // Vẫn đánh dấu SENT vì notification đã được lưu
            await notificationRepository.updateStatus(notification.id, 'SENT');
            return;
        }

        // Gửi push đến tất cả devices của user
        const tokenStrings = tokens.map(t => t.token);
        const result = await pushService.sendToMultipleDevices(tokenStrings, {
            title: notification.title,
            content: notification.content,
            data: notification.metadata
        });

        // Cập nhật status
        const status = result.successCount > 0 ? 'SENT' : 'FAILED';
        await notificationRepository.updateStatus(notification.id, status);
    }

    /**
     * Lấy notifications của user
     * @param {string} userId - ID của user
     * @param {Object} options - { page, limit }
     * @returns {Promise<{data, pagination}>}
     */
    async getNotificationsByUserId(userId, options = {}) {
        return await notificationRepository.findByUserId(userId, options);
    }

    /**
     * Đánh dấu notification đã đọc
     * @param {number} id - ID notification
     * @returns {Promise<Notification>}
     */
    async markAsRead(id) {
        const notification = await notificationRepository.update(id, { isRead: true });
        if (!notification) {
            throw new Error('Không tìm thấy notification');
        }
        return notification;
    }

    /**
     * Đánh dấu tất cả notifications của user đã đọc
     * @param {string} userId - ID của user
     * @returns {Promise<number>} - Số lượng đã cập nhật
     */
    async markAllAsRead(userId) {
        return await notificationRepository.markAllAsRead(userId);
    }

    /**
     * Đếm số notifications chưa đọc
     * @param {string} userId - ID của user
     * @returns {Promise<number>}
     */
    async countUnread(userId) {
        return await notificationRepository.countUnread(userId);
    }
}

module.exports = new NotificationService();
