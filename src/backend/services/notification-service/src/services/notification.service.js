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
        // Nếu là EMAIL type, vẫn lưu vào DB để user có thể xem lại trong app (optional)
        // Hoặc có thể chỉ lưu PUSH. Ở đây mình lưu cả 2 nhưng với type tương ứng.
        const notification = await notificationRepository.create({
            userId: eventData.userId,
            title: notificationContent.title,
            content: notificationContent.content,
            type: notificationContent.type || 'PUSH',
            status: 'PENDING',
            metadata: {
                eventType,
                ...eventData
            }
        });

        console.log(`✅ Created notification ID: ${notification.id} [${notification.type}]`);

        // Xử lý gửi theo type
        if (notification.type === 'EMAIL') {
            // Gửi Email Logic
            const emailAddress = eventData.email;
            if (emailAddress) {
                this._sendEmailNotification(emailAddress, notificationContent, notification).catch(err => {
                    console.error('❌ Error sending email:', err.message);
                });
            } else {
                console.error('⚠️ Missing email address for EMAIL notification');
            }
        } else {
            // Gửi Push Logic (Mặc định)
            this._sendPushNotification(notification).catch(err => {
                console.error('❌ Error sending push:', err.message);
            });
        }

        return notification;
    }

    /**
     * Gửi Email notification
     * @private
     */
    async _sendEmailNotification(email, content, notification) {
        const result = await emailService.send(email, {
            subject: content.emailSubject || content.title,
            content: content.content,
            html: `<p>${content.content}</p>` // Simple HTML template
        });

        // Cập nhật status
        const status = result.success ? 'SENT' : 'FAILED';
        await notificationRepository.updateStatus(notification.id, status);
    }

    /**
     * Map event type sang nội dung notification
     * @private
     */
    _mapEventToNotification(eventType, eventData) {
        const templates = {
            'order.confirmed': {
                title: '🎉 Đơn hàng đã được xác nhận!',
                content: `Đơn hàng #${eventData.orderId} từ ${eventData.restaurantName || 'nhà hàng'} đã được xác nhận. Tổng: ${this._formatCurrency(eventData.totalAmount)}`,
                type: 'PUSH'
            },
            'order.cancelled': {
                title: '❌ Đơn hàng đã bị hủy',
                content: `Đơn hàng #${eventData.orderId} đã bị hủy. Lý do: ${eventData.reason || 'Không xác định'}.`,
                type: 'PUSH'
            },
            'order.driver_assigned': {
                title: '🛵 Tài xế đã nhận đơn!',
                content: `Tài xế ${eventData.driverName} đang đến nhà hàng. Biển số: ${eventData.driverPlate}.`,
                type: 'PUSH'
            },
            'order.picked_up': {
                title: '🍱 Tài xế đã lấy món!',
                content: `Tài xế đang giao đến bạn. Vui lòng để ý điện thoại nhé!`,
                type: 'PUSH'
            },
            'order.arrived': {
                title: '📍 Tài xế đã đến nơi!',
                content: `Tài xế đang đợi bạn tại điểm giao hàng. Ra nhận món ngay nhé!`,
                type: 'PUSH'
            },
            'order.delivered': {
                title: '✅ Đơn hàng đã giao thành công!',
                content: `Đơn hàng #${eventData.orderId} đã được giao. Cảm ơn bạn đã sử dụng dịch vụ!`,
                type: 'PUSH'
            },
            'payment.success': {
                title: '💰 Thanh toán thành công!',
                content: `Bạn đã thanh toán ${this._formatCurrency(eventData.amount)} qua ${eventData.paymentMethod || 'ví điện tử'}. Mã đơn: #${eventData.orderId}`,
                type: 'PUSH'
            },
            'user.registered': {
                title: '👋 Chào mừng bạn đến với Yummy!',
                content: `Xin chào ${eventData.name || 'bạn'}! Hãy khám phá các nhà hàng và đặt món ngon nhé!`,
                emailSubject: 'Chào mừng bạn đến với Yummy App! 🍕',
                type: 'EMAIL' // Ưu tiên gửi email, nhưng vẫn có thể lưu notification
            },
            'promotion.new': {
                title: '🎁 Khuyến mãi mới!',
                content: `${eventData.title}: ${eventData.description}. Nhập mã: ${eventData.code}`,
                type: 'PUSH'
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
