/**
 * ===========================================
 * USER CONTROLLER - XỬ LÝ HTTP REQUESTS
 * ===========================================
 * 
 * Enhanced controller với đầy đủ chức năng:
 * - Auth: register, login, logout, OTP
 * - Profile: get, update
 * - Password: forgot, reset, change
 */

const authService = require('../services/auth.service');
const User = require('../models/user.model');
const Address = require('../models/address.model');

// ============================================
// AUTHENTICATION
// ============================================

/**
 * POST /api/auth/register
 */
exports.register = async (req, res) => {
    try {
        const { email, password, role, fullName, phone } = req.body;

        if (!email || !password || !fullName) {
            return res.status(400).json({
                error: 'Thiếu thông tin bắt buộc',
                details: 'Email, password và fullName là bắt buộc'
            });
        }

        const result = await authService.register(email, password, role, fullName, phone);
        res.status(201).json({
            message: 'Đăng ký thành công! Vui lòng kiểm tra email để lấy mã OTP.',
            user: result
        });
    } catch (error) {
        res.status(400).json({
            error: 'Đăng ký thất bại',
            details: error.message
        });
    }
};

/**
 * POST /api/auth/verify-otp
 */
exports.verifyOTP = async (req, res) => {
    try {
        const { email, code } = req.body;

        if (!email || !code) {
            return res.status(400).json({
                error: 'Thiếu thông tin',
                details: 'Email và mã OTP là bắt buộc'
            });
        }

        const result = await authService.verifyRegistration(email, code);
        res.status(200).json({
            message: 'Xác thực thành công!',
            ...result
        });
    } catch (error) {
        res.status(400).json({
            error: 'Xác thực thất bại',
            details: error.message
        });
    }
};

/**
 * POST /api/auth/login
 */
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                error: 'Thiếu thông tin đăng nhập',
                details: 'Email và password là bắt buộc'
            });
        }

        const result = await authService.login(email, password);
        res.status(200).json({
            message: 'Đăng nhập thành công!',
            ...result
        });
    } catch (error) {
        res.status(401).json({
            error: 'Đăng nhập thất bại',
            details: error.message
        });
    }
};

/**
 * POST /api/auth/logout
 */
exports.logout = async (req, res) => {
    try {
        const token = req.headers['authorization']?.split(' ')[1];
        if (!token) {
            return res.status(400).json({ error: 'Không có token' });
        }

        await authService.logout(token, req.user.userId);
        res.status(200).json({ message: 'Đăng xuất thành công' });
    } catch (error) {
        res.status(500).json({
            error: 'Đăng xuất thất bại',
            details: error.message
        });
    }
};

// ============================================
// PASSWORD MANAGEMENT
// ============================================

/**
 * POST /api/auth/forgot-password
 */
exports.forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ error: 'Vui lòng nhập email' });
        }

        const result = await authService.forgotPassword(email);
        res.status(200).json(result);
    } catch (error) {
        res.status(400).json({
            error: 'Thất bại',
            details: error.message
        });
    }
};

/**
 * POST /api/auth/reset-password
 */
exports.resetPassword = async (req, res) => {
    try {
        const { email, code, newPassword } = req.body;
        if (!email || !code || !newPassword) {
            return res.status(400).json({
                error: 'Thiếu thông tin',
                details: 'Cần email, mã OTP và mật khẩu mới'
            });
        }

        const result = await authService.resetPassword(email, code, newPassword);
        res.status(200).json(result);
    } catch (error) {
        res.status(400).json({
            error: 'Thất bại',
            details: error.message
        });
    }
};

/**
 * PUT /api/auth/change-password
 */
exports.changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        if (!currentPassword || !newPassword) {
            return res.status(400).json({
                error: 'Thiếu thông tin',
                details: 'Cần mật khẩu hiện tại và mật khẩu mới'
            });
        }

        const result = await authService.changePassword(req.user.userId, currentPassword, newPassword);
        res.status(200).json(result);
    } catch (error) {
        res.status(400).json({
            error: 'Thất bại',
            details: error.message
        });
    }
};

// ============================================
// PROFILE
// ============================================

/**
 * GET /api/auth/me
 */
exports.getProfile = async (req, res) => {
    try {
        const user = await User.findByPk(req.user.userId, {
            attributes: ['id', 'email', 'role', 'full_name', 'phone', 'avatar', 'date_of_birth', 'status', 'created_at']
        });

        if (!user) {
            return res.status(404).json({ error: 'User không tồn tại' });
        }

        res.status(200).json({
            user: {
                id: user.id,
                email: user.email,
                role: user.role,
                fullName: user.full_name,
                phone: user.phone,
                avatar: user.avatar,
                dateOfBirth: user.date_of_birth,
                status: user.status,
                createdAt: user.created_at
            }
        });
    } catch (error) {
        res.status(500).json({
            error: 'Lỗi server',
            details: error.message
        });
    }
};

/**
 * PUT /api/auth/profile
 */
exports.updateProfile = async (req, res) => {
    try {
        const { fullName, phone, avatar, dateOfBirth } = req.body;
        const user = await User.findByPk(req.user.userId);

        if (!user) {
            return res.status(404).json({ error: 'User không tồn tại' });
        }

        await user.update({
            full_name: fullName || user.full_name,
            phone: phone !== undefined ? phone : user.phone,
            avatar: avatar !== undefined ? avatar : user.avatar,
            date_of_birth: dateOfBirth !== undefined ? dateOfBirth : user.date_of_birth
        });

        res.status(200).json({
            message: 'Cập nhật profile thành công',
            user: {
                id: user.id,
                email: user.email,
                fullName: user.full_name,
                phone: user.phone,
                avatar: user.avatar,
                dateOfBirth: user.date_of_birth
            }
        });
    } catch (error) {
        res.status(500).json({
            error: 'Cập nhật thất bại',
            details: error.message
        });
    }
};

// ============================================
// ADDRESSES
// ============================================

/**
 * GET /api/auth/addresses
 */
exports.getAddresses = async (req, res) => {
    try {
        const addresses = await Address.findAll({
            where: { user_id: req.user.userId },
            order: [['is_default', 'DESC'], ['created_at', 'DESC']]
        });
        res.status(200).json({ addresses });
    } catch (error) {
        res.status(500).json({ error: 'Lỗi server', details: error.message });
    }
};

/**
 * POST /api/auth/addresses
 */
exports.addAddress = async (req, res) => {
    try {
        const { label, recipientName, recipientPhone, addressLine, ward, district, city, latitude, longitude, isDefault } = req.body;

        if (!recipientName || !recipientPhone || !addressLine) {
            return res.status(400).json({
                error: 'Thiếu thông tin',
                details: 'Cần tên người nhận, SĐT và địa chỉ'
            });
        }

        // Nếu isDefault = true, bỏ default của các địa chỉ khác
        if (isDefault) {
            await Address.update(
                { is_default: false },
                { where: { user_id: req.user.userId } }
            );
        }

        const address = await Address.create({
            user_id: req.user.userId,
            label,
            recipient_name: recipientName,
            recipient_phone: recipientPhone,
            address_line: addressLine,
            ward,
            district,
            city,
            latitude,
            longitude,
            is_default: isDefault || false
        });

        res.status(201).json({
            message: 'Thêm địa chỉ thành công',
            address
        });
    } catch (error) {
        res.status(500).json({ error: 'Thất bại', details: error.message });
    }
};

/**
 * PUT /api/auth/addresses/:id
 */
exports.updateAddress = async (req, res) => {
    try {
        const { id } = req.params;
        const address = await Address.findOne({
            where: { id, user_id: req.user.userId }
        });

        if (!address) {
            return res.status(404).json({ error: 'Địa chỉ không tồn tại' });
        }

        const { label, recipientName, recipientPhone, addressLine, ward, district, city, latitude, longitude, isDefault } = req.body;

        // Nếu set default, bỏ default của các địa chỉ khác
        if (isDefault) {
            await Address.update(
                { is_default: false },
                { where: { user_id: req.user.userId } }
            );
        }

        await address.update({
            label: label !== undefined ? label : address.label,
            recipient_name: recipientName || address.recipient_name,
            recipient_phone: recipientPhone || address.recipient_phone,
            address_line: addressLine || address.address_line,
            ward: ward !== undefined ? ward : address.ward,
            district: district !== undefined ? district : address.district,
            city: city !== undefined ? city : address.city,
            latitude: latitude !== undefined ? latitude : address.latitude,
            longitude: longitude !== undefined ? longitude : address.longitude,
            is_default: isDefault !== undefined ? isDefault : address.is_default
        });

        res.status(200).json({
            message: 'Cập nhật địa chỉ thành công',
            address
        });
    } catch (error) {
        res.status(500).json({ error: 'Thất bại', details: error.message });
    }
};

/**
 * DELETE /api/auth/addresses/:id
 */
exports.deleteAddress = async (req, res) => {
    try {
        const { id } = req.params;
        const address = await Address.findOne({
            where: { id, user_id: req.user.userId }
        });

        if (!address) {
            return res.status(404).json({ error: 'Địa chỉ không tồn tại' });
        }

        await address.destroy();
        res.status(200).json({ message: 'Xóa địa chỉ thành công' });
    } catch (error) {
        res.status(500).json({ error: 'Thất bại', details: error.message });
    }
};
