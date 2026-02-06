/**
 * ===========================================
 * VERIFY TOKEN MIDDLEWARE - ENHANCED
 * ===========================================
 * 
 * Middleware xác thực JWT Token với hỗ trợ Token Blacklist.
 */

const jwt = require('jsonwebtoken');
require('dotenv').config();

// Import model TokenBlacklist (nếu có)
let TokenBlacklist = null;
try {
    TokenBlacklist = require('../models/token-blacklist.model');
} catch (e) {
    console.log('TokenBlacklist model not found, running without blacklist check');
}

/**
 * MIDDLEWARE XÁC THỰC JWT TOKEN
 */
const verifyToken = async (req, res, next) => {
    try {
        // Bước 1: Lấy Authorization header
        const authHeader = req.headers['authorization'];

        if (!authHeader) {
            return res.status(401).json({
                error: 'Không có token',
                details: 'Vui lòng đăng nhập để tiếp tục.'
            });
        }

        // Bước 2: Tách token từ "Bearer <token>"
        const parts = authHeader.split(' ');
        if (parts.length !== 2 || parts[0] !== 'Bearer') {
            return res.status(401).json({
                error: 'Token không hợp lệ',
                details: 'Format đúng: Authorization: Bearer <token>'
            });
        }

        const token = parts[1];

        // Bước 3: Kiểm tra blacklist (nếu model tồn tại)
        if (TokenBlacklist) {
            const blacklisted = await TokenBlacklist.findOne({ where: { token } });
            if (blacklisted) {
                return res.status(401).json({
                    error: 'Token đã bị thu hồi',
                    details: 'Vui lòng đăng nhập lại.'
                });
            }
        }

        // Bước 4: Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Bước 5: Gắn thông tin user vào request
        req.user = {
            userId: decoded.userId,
            role: decoded.role
        };

        next();

    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                error: 'Token hết hạn',
                details: 'Vui lòng đăng nhập lại.'
            });
        }

        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({
                error: 'Token không hợp lệ',
                details: 'Token đã bị sửa đổi hoặc không đúng định dạng.'
            });
        }

        return res.status(500).json({
            error: 'Lỗi xác thực',
            details: error.message
        });
    }
};

module.exports = verifyToken;
