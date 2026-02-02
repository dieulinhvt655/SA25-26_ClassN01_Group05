/**
 * ===========================================
 * VERIFY TOKEN MIDDLEWARE - CHIA SẺ CHO TEAM
 * ===========================================
 * 
 * Middleware này dùng để xác thực JWT Token.
 * CHIA SẺ CHO CÁC THÀNH VIÊN: Linh, Ngoc, Quynh
 * 
 * Cách sử dụng trong service khác:
 * 1. Copy file này vào thư mục middlewares của service
 * 2. Cấu hình JWT_SECRET trong file .env (phải giống User Service)
 * 3. Import và sử dụng:
 * 
 *    const verifyToken = require('./middlewares/verifyToken');
 *    
 *    // Bảo vệ một route cụ thể
 *    router.get('/protected', verifyToken, (req, res) => {
 *        // req.user chứa { userId, role }
 *        console.log('User ID:', req.user.userId);
 *        console.log('Role:', req.user.role);
 *    });
 * 
 * Quy trình xác thực:
 * 1. Lấy token từ header Authorization: Bearer <token>
 * 2. Verify token với JWT_SECRET
 * 3. Gắn thông tin user vào req.user
 * 4. Cho phép request tiếp tục (next())
 */

const jwt = require('jsonwebtoken');
require('dotenv').config();

/**
 * MIDDLEWARE XÁC THỰC JWT TOKEN
 * 
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object  
 * @param {Function} next - Hàm next() để chuyển sang middleware tiếp theo
 */
const verifyToken = (req, res, next) => {
    try {
        // Bước 1: Lấy Authorization header
        const authHeader = req.headers['authorization'];

        // Kiểm tra header có tồn tại không
        if (!authHeader) {
            return res.status(401).json({
                error: 'Không có token',
                details: 'Vui lòng đăng nhập để tiếp tục. Header Authorization bị thiếu.'
            });
        }

        // Bước 2: Tách token từ "Bearer <token>"
        // Format chuẩn: "Bearer eyJhbGciOiJIUzI1NiIs..."
        const parts = authHeader.split(' ');

        if (parts.length !== 2 || parts[0] !== 'Bearer') {
            return res.status(401).json({
                error: 'Token không hợp lệ',
                details: 'Format đúng: Authorization: Bearer <token>'
            });
        }

        const token = parts[1];

        // Bước 3: Verify token với secret key
        // jwt.verify() sẽ throw error nếu token không hợp lệ hoặc hết hạn
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Bước 4: Gắn thông tin user vào request
        // Các route handler có thể truy cập: req.user.userId, req.user.role
        req.user = {
            userId: decoded.userId,
            role: decoded.role
        };

        // Cho phép request tiếp tục đến route handler
        next();

    } catch (error) {
        // Xử lý các loại lỗi JWT
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                error: 'Token hết hạn',
                details: 'Vui lòng đăng nhập lại để lấy token mới.'
            });
        }

        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({
                error: 'Token không hợp lệ',
                details: 'Token đã bị sửa đổi hoặc không đúng định dạng.'
            });
        }

        // Lỗi khác
        return res.status(500).json({
            error: 'Lỗi xác thực',
            details: error.message
        });
    }
};

// Export middleware
module.exports = verifyToken;

/**
 * ===========================================
 * HƯỚNG DẪN SỬ DỤNG CHO TEAM
 * ===========================================
 * 
 * 1. COPY FILE NÀY vào service của bạn:
 *    your-service/middlewares/verifyToken.js
 * 
 * 2. CÀI ĐẶT DEPENDENCIES:
 *    npm install jsonwebtoken dotenv
 * 
 * 3. CẤU HÌNH .ENV (QUAN TRỌNG - phải giống User Service):
 *    JWT_SECRET=your_super_secret_key_change_this_in_production
 * 
 * 4. SỬ DỤNG TRONG ROUTES:
 * 
 *    const express = require('express');
 *    const router = express.Router();
 *    const verifyToken = require('../middlewares/verifyToken');
 * 
 *    // Route công khai - không cần token
 *    router.get('/public', (req, res) => {
 *        res.json({ message: 'Ai cũng truy cập được!' });
 *    });
 * 
 *    // Route bảo vệ - cần token
 *    router.get('/protected', verifyToken, (req, res) => {
 *        res.json({ 
 *            message: 'Chỉ user đã đăng nhập mới thấy!',
 *            userId: req.user.userId,
 *            role: req.user.role 
 *        });
 *    });
 * 
 *    // Kiểm tra role admin
 *    router.delete('/admin-only', verifyToken, (req, res) => {
 *        if (req.user.role !== 'admin') {
 *            return res.status(403).json({ error: 'Bạn không phải admin!' });
 *        }
 *        res.json({ message: 'Xin chào admin!' });
 *    });
 * 
 * 5. TEST VỚI POSTMAN/CURL:
 *    - Đăng nhập qua User Service để lấy token
 *    - Gửi request với header: Authorization: Bearer <token>
 */
