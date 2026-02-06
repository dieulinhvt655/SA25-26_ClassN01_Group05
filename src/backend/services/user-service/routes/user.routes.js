/**
 * ===========================================
 * USER ROUTES - FULL API ENDPOINTS
 * ===========================================
 */

const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const adminController = require('../controllers/admin.controller');
const verifyToken = require('../middlewares/verifyToken');
const checkRole = require('../middlewares/checkRole');

// ============================================
// PUBLIC ROUTES (không cần token)
// ============================================

// Đăng ký & xác thực
router.post('/register', userController.register);
router.post('/verify-otp', userController.verifyOTP);
router.post('/login', userController.login);

// Quên mật khẩu
router.post('/forgot-password', userController.forgotPassword);
router.post('/reset-password', userController.resetPassword);

// ============================================
// PROTECTED ROUTES (cần token)
// ============================================

// Đăng xuất
router.post('/logout', verifyToken, userController.logout);

// Profile
router.get('/me', verifyToken, userController.getProfile);
router.put('/profile', verifyToken, userController.updateProfile);
router.put('/change-password', verifyToken, userController.changePassword);

// Địa chỉ giao hàng
router.get('/addresses', verifyToken, userController.getAddresses);
router.post('/addresses', verifyToken, userController.addAddress);
router.put('/addresses/:id', verifyToken, userController.updateAddress);
router.delete('/addresses/:id', verifyToken, userController.deleteAddress);

// ============================================
// ADMIN ROUTES (cần token + role admin)
// ============================================

router.get('/admin/users', verifyToken, checkRole('admin'), adminController.getAllUsers);
router.get('/admin/users/:id', verifyToken, checkRole('admin'), adminController.getUserById);
router.put('/admin/users/:id/lock', verifyToken, checkRole('admin'), adminController.lockUser);
router.put('/admin/users/:id/unlock', verifyToken, checkRole('admin'), adminController.unlockUser);
router.get('/admin/stats', verifyToken, checkRole('admin'), adminController.getDashboardStats);

module.exports = router;
