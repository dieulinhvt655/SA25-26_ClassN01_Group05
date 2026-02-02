/**
 * ===========================================
 * AUTH SERVICE - XỬ LÝ LOGIC XÁC THỰC
 * ===========================================
 * 
 * Service này chứa toàn bộ business logic cho việc xác thực:
 * - register(): Đăng ký tài khoản mới
 * - login(): Đăng nhập và tạo JWT token
 * 
 * QUAN TRỌNG: 
 * - Mật khẩu được mã hóa bằng bcrypt trước khi lưu
 * - JWT Token chứa {userId, role} để các service khác biết user là ai
 */

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

// Số rounds để hash password (càng cao càng an toàn nhưng chậm hơn)
const SALT_ROUNDS = 10;

/**
 * ĐĂNG KÝ TÀI KHOẢN MỚI
 * 
 * Quy trình:
 * 1. Kiểm tra email đã tồn tại chưa
 * 2. Mã hóa mật khẩu bằng bcrypt
 * 3. Tạo user mới trong database
 * 4. Trả về thông tin user (không bao gồm password)
 * 
 * @param {string} email - Email đăng ký
 * @param {string} password - Mật khẩu gốc (sẽ được hash)
 * @param {string} role - Vai trò: customer/admin/restaurant_owner
 * @param {string} fullName - Họ tên đầy đủ
 * @returns {Object} Thông tin user đã tạo
 */
async function register(email, password, role, fullName) {
    // Bước 1: Kiểm tra email đã được sử dụng chưa
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
        throw new Error('Email đã được sử dụng. Vui lòng chọn email khác.');
    }

    // Bước 2: Mã hóa mật khẩu bằng bcrypt
    // bcrypt.hash() tạo ra một chuỗi hash an toàn từ mật khẩu gốc
    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

    // Bước 3: Tạo user mới trong database
    const newUser = await User.create({
        email: email,
        password_hash: passwordHash,
        role: role || 'customer',  // Mặc định là customer nếu không chỉ định
        full_name: fullName
    });

    // Bước 4: Trả về thông tin user (ẩn password_hash)
    return {
        id: newUser.id,
        email: newUser.email,
        role: newUser.role,
        fullName: newUser.full_name,
        createdAt: newUser.createdAt
    };
}

/**
 * ĐĂNG NHẬP VÀ TẠO JWT TOKEN
 * 
 * Quy trình:
 * 1. Tìm user theo email
 * 2. So sánh mật khẩu với hash trong database
 * 3. Tạo JWT Token chứa {userId, role}
 * 4. Trả về token cho client
 * 
 * @param {string} email - Email đăng nhập
 * @param {string} password - Mật khẩu
 * @returns {Object} { token, user } - JWT token và thông tin user
 */
async function login(email, password) {
    // Bước 1: Tìm user theo email
    const user = await User.findOne({ where: { email } });
    if (!user) {
        throw new Error('Email không tồn tại trong hệ thống.');
    }

    // Bước 2: So sánh mật khẩu với hash trong database
    // bcrypt.compare() so sánh mật khẩu gốc với hash đã lưu
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
        throw new Error('Mật khẩu không chính xác.');
    }

    // Bước 3: Tạo JWT Token
    // Payload chứa userId và role để các service khác xác định user
    const tokenPayload = {
        userId: user.id,
        role: user.role
    };

    // Ký token với secret key và thời gian hết hạn từ .env
    const token = jwt.sign(
        tokenPayload,
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
    );

    // Bước 4: Trả về token và thông tin user
    return {
        token: token,
        user: {
            id: user.id,
            email: user.email,
            role: user.role,
            fullName: user.full_name
        }
    };
}

// Export các function để controller sử dụng
module.exports = {
    register,
    login
};
