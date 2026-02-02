/**
 * ===========================================
 * USER ROUTES - ĐỊNH NGHĨA CÁC ENDPOINT
 * ===========================================
 * 
 * File này định nghĩa các API endpoints cho User Service.
 * 
 * Endpoints công khai (không cần token):
 * - POST /api/auth/register - Đăng ký tài khoản
 * - POST /api/auth/login - Đăng nhập
 * 
 * Endpoints bảo vệ (cần token):
 * - GET /api/auth/me - Lấy thông tin profile
 */

const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const verifyToken = require('../middlewares/verifyToken');

// ============================================
// ENDPOINTS CÔNG KHAI (Public Routes)
// ============================================

/**
 * POST /api/auth/register
 * Đăng ký tài khoản mới
 * 
 * Body: {
 *   email: "user@example.com",
 *   password: "123456",
 *   role: "customer",       // Optional, mặc định: customer
 *   fullName: "Nguyen Van A"
 * }
 */
router.post('/register', userController.register);

/**
 * POST /api/auth/login
 * Đăng nhập và nhận JWT token
 * 
 * Body: {
 *   email: "user@example.com",
 *   password: "123456"
 * }
 * 
 * Response: {
 *   token: "eyJhbGciOiJIUzI1NiIs...",
 *   user: { id, email, role, fullName }
 * }
 */
router.post('/login', userController.login);

// ============================================
// ENDPOINTS BẢO VỆ (Protected Routes)
// ============================================

/**
 * GET /api/auth/me
 * Lấy thông tin user hiện tại
 * 
 * Header: Authorization: Bearer <token>
 * 
 * Response: {
 *   user: { id, email, role, fullName, createdAt }
 * }
 */
router.get('/me', verifyToken, userController.getProfile);

// Export router
module.exports = router;
