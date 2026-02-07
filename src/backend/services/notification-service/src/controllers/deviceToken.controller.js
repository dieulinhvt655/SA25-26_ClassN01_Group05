/**
 * DeviceToken Controller
 * 
 * Chịu trách nhiệm:
 * - Xử lý HTTP requests cho device tokens
 * - Đăng ký và xóa FCM/APNs tokens
 */

const deviceTokenService = require('../services/deviceToken.service');

class DeviceTokenController {
    /**
     * POST /device-tokens
     * Đăng ký device token mới
     * Body: { userId, deviceType, token }
     */
    async registerToken(req, res) {
        try {
            const { userId, deviceType, token } = req.body;

            const deviceToken = await deviceTokenService.registerToken({
                userId,
                deviceType,
                token
            });

            res.status(201).json({
                success: true,
                message: 'Đăng ký device token thành công',
                data: deviceToken
            });
        } catch (error) {
            console.error('Error registering token:', error.message);
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    /**
     * DELETE /device-tokens/:token
     * Xóa device token
     */
    async removeToken(req, res) {
        try {
            const { token } = req.params;

            await deviceTokenService.removeToken(token);

            res.status(200).json({
                success: true,
                message: 'Đã xóa device token'
            });
        } catch (error) {
            console.error('Error removing token:', error.message);
            res.status(404).json({
                success: false,
                message: error.message
            });
        }
    }

    /**
     * GET /device-tokens?userId=
     * Lấy danh sách tokens của user (optional endpoint)
     */
    async getTokensByUser(req, res) {
        try {
            const { userId } = req.query;

            if (!userId) {
                return res.status(400).json({
                    success: false,
                    message: 'userId là bắt buộc'
                });
            }

            const tokens = await deviceTokenService.getTokensByUserId(userId);

            res.status(200).json({
                success: true,
                data: tokens
            });
        } catch (error) {
            console.error('Error getting tokens:', error.message);
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }
}

module.exports = new DeviceTokenController();
