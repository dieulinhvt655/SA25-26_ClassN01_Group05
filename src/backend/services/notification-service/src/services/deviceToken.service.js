/**
 * DeviceToken Service
 * 
 * Chịu trách nhiệm:
 * - Business logic cho device tokens
 * - Validate và xử lý đăng ký token
 * - Không chứa logic truy vấn database
 */

const deviceTokenRepository = require('../repositories/deviceToken.repository');

class DeviceTokenService {
    /**
     * Đăng ký device token mới
     * @param {Object} data - { userId, deviceType, token }
     * @returns {Promise<DeviceToken>}
     */
    async registerToken(data) {
        const { userId, deviceType, token } = data;

        // Validate input
        if (!userId) {
            throw new Error('userId là bắt buộc');
        }
        if (!deviceType || !['ANDROID', 'IOS', 'WEB'].includes(deviceType)) {
            throw new Error('deviceType phải là ANDROID, IOS hoặc WEB');
        }
        if (!token) {
            throw new Error('token là bắt buộc');
        }

        // Kiểm tra token đã tồn tại chưa
        const existingToken = await deviceTokenRepository.findByToken(token);
        if (existingToken) {
            // Nếu token đã có nhưng inactive, reactivate nó
            if (!existingToken.isActive) {
                await existingToken.update({ isActive: true, userId });
                console.log(`🔄 Reactivated token for user ${userId}`);
                return existingToken;
            }
            // Token đã active, không cần làm gì thêm
            console.log(`ℹ️ Token already registered for user ${existingToken.userId}`);
            return existingToken;
        }

        // Tạo token mới
        const newToken = await deviceTokenRepository.create({
            userId,
            deviceType,
            token,
            isActive: true
        });

        console.log(`✅ Registered new ${deviceType} token for user ${userId}`);
        return newToken;
    }

    /**
     * Xóa (deactivate) device token
     * @param {string} token - Token string
     * @returns {Promise<boolean>}
     */
    async removeToken(token) {
        if (!token) {
            throw new Error('token là bắt buộc');
        }

        const deleted = await deviceTokenRepository.deleteByToken(token);
        if (!deleted) {
            throw new Error('Không tìm thấy token');
        }

        console.log(`🗑️ Removed device token`);
        return true;
    }

    /**
     * Lấy tất cả tokens của user
     * @param {string} userId - ID của user
     * @returns {Promise<DeviceToken[]>}
     */
    async getTokensByUserId(userId) {
        return await deviceTokenRepository.findActiveByUserId(userId);
    }

    /**
     * Deactivate tất cả tokens của user (khi logout all)
     * @param {string} userId - ID của user
     * @returns {Promise<number>}
     */
    async removeAllTokensByUserId(userId) {
        const count = await deviceTokenRepository.deactivateAllByUserId(userId);
        console.log(`🗑️ Deactivated ${count} tokens for user ${userId}`);
        return count;
    }
}

module.exports = new DeviceTokenService();
