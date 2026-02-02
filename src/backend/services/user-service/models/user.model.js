/**
 * ===========================================
 * USER MODEL - SEQUELIZE
 * ===========================================
 * 
 * Model này định nghĩa cấu trúc bảng User trong database.
 * Sequelize sẽ tự động tạo bảng dựa trên định nghĩa này.
 * 
 * Các trường (columns):
 * - id: Khóa chính, tự động tăng
 * - email: Email đăng nhập (unique - không trùng)
 * - password_hash: Mật khẩu đã được mã hóa bằng bcrypt
 * - role: Vai trò người dùng (customer/admin/restaurant_owner)
 * - full_name: Họ tên đầy đủ
 */

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

// Định nghĩa model User
const User = sequelize.define('User', {
    // ID - Khóa chính, tự động tăng
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        comment: 'Khóa chính - ID người dùng'
    },

    // Email - Dùng để đăng nhập, phải unique
    email: {
        type: DataTypes.STRING(255),
        allowNull: false,      // Bắt buộc phải có
        unique: true,          // Không được trùng
        validate: {
            isEmail: true      // Kiểm tra định dạng email hợp lệ
        },
        comment: 'Email đăng nhập - không được trùng'
    },

    // Password Hash - Mật khẩu đã mã hóa
    // QUAN TRỌNG: Không bao giờ lưu mật khẩu gốc!
    password_hash: {
        type: DataTypes.STRING(255),
        allowNull: false,
        comment: 'Mật khẩu đã được mã hóa bằng bcrypt'
    },

    // Role - Vai trò của người dùng trong hệ thống
    role: {
        type: DataTypes.ENUM('customer', 'admin', 'restaurant_owner'),
        defaultValue: 'customer',  // Mặc định là khách hàng
        allowNull: false,
        comment: 'Vai trò: customer (khách), admin (quản trị), restaurant_owner (chủ nhà hàng)'
    },

    // Full Name - Họ tên đầy đủ
    full_name: {
        type: DataTypes.STRING(255),
        allowNull: false,
        comment: 'Họ và tên đầy đủ của người dùng'
    }
}, {
    // Cấu hình bảng
    tableName: 'users',        // Tên bảng trong database
    timestamps: true,          // Tự động thêm createdAt, updatedAt
    underscored: true,         // Dùng snake_case cho tên cột (created_at thay vì createdAt)

    // Index để tối ưu tìm kiếm theo email
    indexes: [
        {
            unique: true,
            fields: ['email']
        }
    ]
});

// Export model để sử dụng ở các file khác
module.exports = User;
