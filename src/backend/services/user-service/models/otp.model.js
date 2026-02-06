/**
 * ===========================================
 * OTP MODEL - MÃ XÁC THỰC
 * ===========================================
 * 
 * Model lưu trữ mã OTP cho xác thực email/phone.
 */

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const OTP = sequelize.define('OTP', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },

    email: {
        type: DataTypes.STRING(255),
        allowNull: false,
        comment: 'Email nhận OTP'
    },

    code: {
        type: DataTypes.STRING(6),
        allowNull: false,
        comment: 'Mã OTP 6 số'
    },

    purpose: {
        type: DataTypes.ENUM('register', 'login', 'forgot_password', 'verify_email'),
        allowNull: false,
        comment: 'Mục đích: register, login, forgot_password, verify_email'
    },

    expires_at: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: 'Thời điểm hết hạn'
    },

    verified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        comment: 'Đã xác thực chưa'
    },

    attempts: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        comment: 'Số lần thử nhập sai'
    }
}, {
    tableName: 'otps',
    timestamps: true,
    underscored: true,
    indexes: [
        { fields: ['email', 'purpose'] },
        { fields: ['expires_at'] }
    ]
});

module.exports = OTP;
