/**
 * ===========================================
 * AUTH SERVICE - XỬ LÝ LOGIC XÁC THỰC
 * ===========================================
 * 
 * Enhanced version với:
 * - Kiểm tra trạng thái tài khoản (status)
 * - Hỗ trợ OTP verification
 * - Token blacklist
 */

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const TokenBlacklist = require('../models/token-blacklist.model');
const otpService = require('./otp.service');

const SALT_ROUNDS = 10;

/**
 * ĐĂNG KÝ TÀI KHOẢN MỚI
 */
async function register(email, password, role, fullName, phone = null) {
    // Kiểm tra email đã tồn tại
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
        throw new Error('Email đã được sử dụng. Vui lòng chọn email khác.');
    }

    // Mã hóa password
    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

    // Tạo user mới với status = 'pending' (chờ xác thực OTP)
    const newUser = await User.create({
        email,
        password_hash: passwordHash,
        role: role || 'customer',
        full_name: fullName,
        phone,
        status: 'pending'
    });

    // Gửi OTP để xác thực email
    await otpService.generateOTP(email, 'register');

    return {
        id: newUser.id,
        email: newUser.email,
        role: newUser.role,
        fullName: newUser.full_name,
        status: newUser.status,
        message: 'Vui lòng kiểm tra email để lấy mã OTP xác thực.'
    };
}

/**
 * XÁC THỰC OTP SAU ĐĂNG KÝ
 */
async function verifyRegistration(email, otpCode) {
    // Verify OTP
    await otpService.verifyOTP(email, otpCode, 'register');

    // Cập nhật status thành active
    const user = await User.findOne({ where: { email } });
    if (!user) throw new Error('User không tồn tại');

    await user.update({ status: 'active' });

    // Tạo token
    const token = jwt.sign(
        { userId: user.id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
    );

    return {
        token,
        user: {
            id: user.id,
            email: user.email,
            role: user.role,
            fullName: user.full_name,
            status: user.status
        }
    };
}

/**
 * ĐĂNG NHẬP
 */
async function login(email, password) {
    const user = await User.findOne({ where: { email } });
    if (!user) {
        throw new Error('Email không tồn tại trong hệ thống.');
    }

    // ============ KIỂM TRA TRẠNG THÁI TÀI KHOẢN ============
    if (user.status === 'pending') {
        // Gửi lại OTP
        await otpService.generateOTP(email, 'register');
        throw new Error('Tài khoản chưa được xác thực. Mã OTP mới đã được gửi đến email của bạn.');
    }
    if (user.status === 'locked') {
        throw new Error(`Tài khoản bị khóa. Lý do: ${user.locked_reason || 'Vi phạm quy định'}`);
    }
    if (user.status === 'deleted') {
        throw new Error('Tài khoản không tồn tại.');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
        throw new Error('Mật khẩu không chính xác.');
    }

    // Tạo JWT Token
    const token = jwt.sign(
        { userId: user.id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
    );

    return {
        token,
        user: {
            id: user.id,
            email: user.email,
            role: user.role,
            fullName: user.full_name,
            phone: user.phone,
            avatar: user.avatar,
            status: user.status
        }
    };
}

/**
 * ĐĂNG XUẤT - Thêm token vào blacklist
 */
async function logout(token, userId) {
    const decoded = jwt.decode(token);
    if (!decoded) throw new Error('Token không hợp lệ');

    await TokenBlacklist.create({
        token,
        user_id: userId,
        expires_at: new Date(decoded.exp * 1000),
        reason: 'logout'
    });

    return { message: 'Đăng xuất thành công' };
}

/**
 * KIỂM TRA TOKEN CÓ TRONG BLACKLIST
 */
async function isTokenBlacklisted(token) {
    const blacklisted = await TokenBlacklist.findOne({ where: { token } });
    return !!blacklisted;
}

/**
 * QUÊN MẬT KHẨU - Gửi OTP
 */
async function forgotPassword(email) {
    const user = await User.findOne({ where: { email } });
    if (!user) {
        throw new Error('Email không tồn tại trong hệ thống.');
    }

    await otpService.generateOTP(email, 'forgot_password');
    return { message: 'Mã OTP đã được gửi đến email của bạn.' };
}

/**
 * ĐẶT LẠI MẬT KHẨU
 */
async function resetPassword(email, otpCode, newPassword) {
    // Verify OTP
    await otpService.verifyOTP(email, otpCode, 'forgot_password');

    // Hash password mới
    const passwordHash = await bcrypt.hash(newPassword, SALT_ROUNDS);

    // Cập nhật password
    const user = await User.findOne({ where: { email } });
    await user.update({ password_hash: passwordHash });

    // Blacklist tất cả token cũ của user
    // (Trong production nên dùng cách khác hiệu quả hơn)

    return { message: 'Đặt lại mật khẩu thành công. Vui lòng đăng nhập lại.' };
}

/**
 * ĐỔI MẬT KHẨU (khi đã đăng nhập)
 */
async function changePassword(userId, currentPassword, newPassword) {
    const user = await User.findByPk(userId);
    if (!user) throw new Error('User không tồn tại');

    // Verify current password
    const isValid = await bcrypt.compare(currentPassword, user.password_hash);
    if (!isValid) {
        throw new Error('Mật khẩu hiện tại không đúng.');
    }

    // Hash và update
    const passwordHash = await bcrypt.hash(newPassword, SALT_ROUNDS);
    await user.update({ password_hash: passwordHash });

    return { message: 'Đổi mật khẩu thành công.' };
}

module.exports = {
    register,
    verifyRegistration,
    login,
    logout,
    isTokenBlacklisted,
    forgotPassword,
    resetPassword,
    changePassword
};
