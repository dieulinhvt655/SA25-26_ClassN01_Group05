/**
 * ===========================================
 * CHECK ROLE MIDDLEWARE - PHÂN QUYỀN
 * ===========================================
 * 
 * Middleware kiểm tra role của user có đủ quyền truy cập không.
 * Phải sử dụng sau verifyToken middleware.
 * 
 * Cách dùng:
 *   router.get('/admin/users', verifyToken, checkRole('admin'), controller.method);
 *   router.get('/manage', verifyToken, checkRole('admin', 'restaurant_owner'), ...);
 */

/**
 * Tạo middleware kiểm tra role
 * @param {...string} allowedRoles - Các role được phép truy cập
 * @returns {Function} Express middleware
 */
const checkRole = (...allowedRoles) => {
    return (req, res, next) => {
        // Kiểm tra đã xác thực chưa (verifyToken đã chạy)
        if (!req.user) {
            return res.status(401).json({
                error: 'Chưa xác thực',
                details: 'Vui lòng đăng nhập để tiếp tục.'
            });
        }

        // Kiểm tra role có trong danh sách cho phép không
        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({
                error: 'Không có quyền truy cập',
                details: `API này yêu cầu role: ${allowedRoles.join(' hoặc ')}. Role của bạn: ${req.user.role}`
            });
        }

        // Role hợp lệ, cho phép tiếp tục
        next();
    };
};

module.exports = checkRole;

/**
 * VÍ DỤ SỬ DỤNG:
 * 
 * const verifyToken = require('./verifyToken');
 * const checkRole = require('./checkRole');
 * 
 * // Chỉ admin mới truy cập được
 * router.get('/admin/dashboard', verifyToken, checkRole('admin'), adminController.dashboard);
 * 
 * // Admin HOẶC restaurant_owner
 * router.get('/manage/orders', verifyToken, checkRole('admin', 'restaurant_owner'), ...);
 * 
 * // Tất cả user đã đăng nhập (không cần checkRole)
 * router.get('/profile', verifyToken, userController.getProfile);
 */
