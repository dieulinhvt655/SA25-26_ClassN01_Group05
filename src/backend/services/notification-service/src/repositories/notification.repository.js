/**
 * Repository cho Notification
 * 
 * Chịu trách nhiệm:
 * - Truy vấn database cho notifications
 * - CRUD operations
 * - Không chứa business logic
 */

const { Notification } = require('../models');
const { Op } = require('sequelize');

class NotificationRepository {
    /**
     * Tạo notification mới
     * @param {Object} data - Dữ liệu notification
     * @returns {Promise<Notification>}
     */
    async create(data) {
        return await Notification.create(data);
    }

    /**
     * Lấy notifications của user với phân trang
     * @param {string} userId - ID của user
     * @param {Object} options - { page, limit }
     * @returns {Promise<{data, pagination}>}
     */
    async findByUserId(userId, options = {}) {
        const { page = 1, limit = 20 } = options;
        const offset = (page - 1) * limit;

        const { count, rows } = await Notification.findAndCountAll({
            where: { userId },
            limit: parseInt(limit),
            offset: parseInt(offset),
            order: [['created_at', 'DESC']]  // Mới nhất lên trước
        });

        return {
            data: rows,
            pagination: {
                total: count,
                page: parseInt(page),
                limit: parseInt(limit),
                totalPages: Math.ceil(count / limit)
            }
        };
    }

    /**
     * Tìm notification theo ID
     * @param {number} id - ID notification
     * @returns {Promise<Notification|null>}
     */
    async findById(id) {
        return await Notification.findByPk(id);
    }

    /**
     * Cập nhật notification
     * @param {number} id - ID notification
     * @param {Object} data - Dữ liệu cập nhật
     * @returns {Promise<Notification|null>}
     */
    async update(id, data) {
        const notification = await Notification.findByPk(id);
        if (!notification) return null;

        await notification.update(data);
        return notification;
    }

    /**
     * Đánh dấu tất cả notifications của user là đã đọc
     * @param {string} userId - ID của user
     * @returns {Promise<number>} - Số lượng records đã cập nhật
     */
    async markAllAsRead(userId) {
        const [affectedCount] = await Notification.update(
            { isRead: true },
            { where: { userId, isRead: false } }
        );
        return affectedCount;
    }

    /**
     * Đếm số notifications chưa đọc của user
     * @param {string} userId - ID của user
     * @returns {Promise<number>}
     */
    async countUnread(userId) {
        return await Notification.count({
            where: { userId, isRead: false }
        });
    }

    /**
     * Cập nhật status sau khi gửi
     * @param {number} id - ID notification
     * @param {string} status - 'SENT' hoặc 'FAILED'
     * @returns {Promise<Notification|null>}
     */
    async updateStatus(id, status) {
        const notification = await Notification.findByPk(id);
        if (!notification) return null;

        const updateData = { status };
        if (status === 'SENT') {
            updateData.sentAt = new Date();
        }

        await notification.update(updateData);
        return notification;
    }
}

module.exports = new NotificationRepository();
