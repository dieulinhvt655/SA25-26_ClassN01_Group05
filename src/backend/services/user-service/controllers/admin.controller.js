/**
 * ===========================================
 * ADMIN CONTROLLER - QUẢN TRỊ NGƯỜI DÙNG
 * ===========================================
 * 
 * API dành cho Admin:
 * - Xem danh sách users
 * - Khóa/mở khóa tài khoản
 * - Dashboard stats
 */

const User = require('../models/user.model');
const { Op } = require('sequelize');

/**
 * GET /api/admin/users
 * Lấy danh sách tất cả users
 */
exports.getAllUsers = async (req, res) => {
    try {
        const { page = 1, limit = 20, role, status, search } = req.query;
        const offset = (page - 1) * limit;

        // Build where conditions
        const where = {};
        if (role) where.role = role;
        if (status) where.status = status;
        if (search) {
            where[Op.or] = [
                { email: { [Op.like]: `%${search}%` } },
                { full_name: { [Op.like]: `%${search}%` } }
            ];
        }

        const { count, rows: users } = await User.findAndCountAll({
            where,
            attributes: ['id', 'email', 'role', 'full_name', 'phone', 'status', 'created_at'],
            order: [['created_at', 'DESC']],
            limit: parseInt(limit),
            offset: parseInt(offset)
        });

        res.status(200).json({
            users,
            pagination: {
                total: count,
                page: parseInt(page),
                limit: parseInt(limit),
                totalPages: Math.ceil(count / limit)
            }
        });
    } catch (error) {
        res.status(500).json({ error: 'Lỗi server', details: error.message });
    }
};

/**
 * GET /api/admin/users/:id
 */
exports.getUserById = async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id, {
            attributes: { exclude: ['password_hash'] }
        });

        if (!user) {
            return res.status(404).json({ error: 'User không tồn tại' });
        }

        res.status(200).json({ user });
    } catch (error) {
        res.status(500).json({ error: 'Lỗi server', details: error.message });
    }
};

/**
 * PUT /api/admin/users/:id/lock
 * Khóa tài khoản
 */
exports.lockUser = async (req, res) => {
    try {
        const { reason } = req.body;
        const user = await User.findByPk(req.params.id);

        if (!user) {
            return res.status(404).json({ error: 'User không tồn tại' });
        }

        if (user.role === 'admin') {
            return res.status(403).json({ error: 'Không thể khóa tài khoản admin' });
        }

        await user.update({
            status: 'locked',
            locked_reason: reason || 'Vi phạm quy định',
            locked_at: new Date()
        });

        res.status(200).json({
            message: 'Đã khóa tài khoản',
            user: {
                id: user.id,
                email: user.email,
                status: user.status,
                lockedReason: user.locked_reason
            }
        });
    } catch (error) {
        res.status(500).json({ error: 'Thất bại', details: error.message });
    }
};

/**
 * PUT /api/admin/users/:id/unlock
 * Mở khóa tài khoản
 */
exports.unlockUser = async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id);

        if (!user) {
            return res.status(404).json({ error: 'User không tồn tại' });
        }

        await user.update({
            status: 'active',
            locked_reason: null,
            locked_at: null
        });

        res.status(200).json({
            message: 'Đã mở khóa tài khoản',
            user: {
                id: user.id,
                email: user.email,
                status: user.status
            }
        });
    } catch (error) {
        res.status(500).json({ error: 'Thất bại', details: error.message });
    }
};

/**
 * GET /api/admin/stats
 * Dashboard statistics
 */
exports.getDashboardStats = async (req, res) => {
    try {
        const [
            totalUsers,
            activeUsers,
            pendingUsers,
            lockedUsers,
            customerCount,
            restaurantOwnerCount,
            adminCount
        ] = await Promise.all([
            User.count(),
            User.count({ where: { status: 'active' } }),
            User.count({ where: { status: 'pending' } }),
            User.count({ where: { status: 'locked' } }),
            User.count({ where: { role: 'customer' } }),
            User.count({ where: { role: 'restaurant_owner' } }),
            User.count({ where: { role: 'admin' } })
        ]);

        res.status(200).json({
            stats: {
                totalUsers,
                byStatus: {
                    active: activeUsers,
                    pending: pendingUsers,
                    locked: lockedUsers
                },
                byRole: {
                    customer: customerCount,
                    restaurant_owner: restaurantOwnerCount,
                    admin: adminCount
                }
            }
        });
    } catch (error) {
        res.status(500).json({ error: 'Lỗi server', details: error.message });
    }
};
