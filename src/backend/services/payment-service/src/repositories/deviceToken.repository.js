/**
 * Repository cho DeviceToken
 * 
 * Chịu trách nhiệm:
 * - Quản lý FCM/APNs tokens của users
 * - CRUD operations cho device tokens
 */

const { DeviceToken } = require('../models');

class DeviceTokenRepository {
    /**
     * Đăng ký device token mới
     * @param {Object} data - { userId, deviceType, token }
     * @returns {Promise<DeviceToken>}
     */
    async create(data) {
        return await DeviceToken.create(data);
    }

    /**
     * Lấy tất cả active tokens của user
     * @param {string} userId - ID của user
     * @returns {Promise<DeviceToken[]>}
     */
    async findActiveByUserId(userId) {
        return await DeviceToken.findAll({
            where: {
                userId,
                isActive: true
            }
        });
    }

    /**
     * Tìm token theo giá trị token
     * @param {string} token - Token string
     * @returns {Promise<DeviceToken|null>}
     */
    async findByToken(token) {
        return await DeviceToken.findOne({
            where: { token }
        });
    }

    /**
     * Xóa (deactivate) token
     * @param {string} token - Token string
     * @returns {Promise<boolean>}
     */
    async deactivateByToken(token) {
        const [affectedCount] = await DeviceToken.update(
            { isActive: false },
            { where: { token } }
        );
        return affectedCount > 0;
    }

    /**
     * Xóa vĩnh viễn token
     * @param {string} token - Token string
     * @returns {Promise<boolean>}
     */
    async deleteByToken(token) {
        const deletedCount = await DeviceToken.destroy({
            where: { token }
        });
        return deletedCount > 0;
    }

    /**
     * Deactivate tất cả tokens của user (khi logout all devices)
     * @param {string} userId - ID của user
     * @returns {Promise<number>}
     */
    async deactivateAllByUserId(userId) {
        const [affectedCount] = await DeviceToken.update(
            { isActive: false },
            { where: { userId } }
        );
        return affectedCount;
    }
}

module.exports = new DeviceTokenRepository();
