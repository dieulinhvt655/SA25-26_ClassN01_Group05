/**
 * ===========================================
 * USER MODEL - SEQUELIZE (ENHANCED)
 * ===========================================
 * 
 * Model này định nghĩa cấu trúc bảng User trong database.
 * 
 * Các trường:
 * - id, email, password_hash: Thông tin cơ bản
 * - role: customer/admin/restaurant_owner
 * - status: pending/active/locked/deleted
 * - full_name, phone, avatar, date_of_birth: Hồ sơ
 */

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define('User', {
    // ID - Khóa chính
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        comment: 'Khóa chính - ID người dùng'
    },

    // Email - Dùng để đăng nhập
    email: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true,
        validate: { isEmail: true },
        comment: 'Email đăng nhập - unique'
    },

    // Password Hash
    password_hash: {
        type: DataTypes.STRING(255),
        allowNull: false,
        comment: 'Mật khẩu đã được mã hóa bcrypt'
    },

    // Role - Vai trò
    role: {
        type: DataTypes.ENUM('customer', 'admin', 'restaurant_owner'),
        defaultValue: 'customer',
        allowNull: false,
        comment: 'Vai trò: customer, admin, restaurant_owner'
    },

    // ============ TRẠNG THÁI TÀI KHOẢN ============
    status: {
        type: DataTypes.ENUM('pending', 'active', 'locked', 'deleted'),
        defaultValue: 'pending',
        allowNull: false,
        comment: 'Trạng thái: pending (chờ xác thực), active, locked, deleted'
    },

    locked_reason: {
        type: DataTypes.STRING(255),
        allowNull: true,
        comment: 'Lý do khóa tài khoản'
    },

    locked_at: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Thời điểm khóa tài khoản'
    },

    // ============ HỒ SƠ NGƯỜI DÙNG ============
    full_name: {
        type: DataTypes.STRING(255),
        allowNull: false,
        comment: 'Họ và tên đầy đủ'
    },

    phone: {
        type: DataTypes.STRING(20),
        allowNull: true,
        comment: 'Số điện thoại liên hệ'
    },

    avatar: {
        type: DataTypes.STRING(500),
        allowNull: true,
        comment: 'URL ảnh đại diện'
    },

    date_of_birth: {
        type: DataTypes.DATEONLY,
        allowNull: true,
        comment: 'Ngày sinh'
    }
}, {
    tableName: 'users',
    timestamps: true,
    underscored: true,
    indexes: [
        { unique: true, fields: ['email'] },
        { fields: ['status'] },
        { fields: ['role'] }
    ]
});

module.exports = User;
