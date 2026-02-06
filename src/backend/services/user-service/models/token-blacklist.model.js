/**
 * ===========================================
 * TOKEN BLACKLIST MODEL - TOKEN BỊ THU HỒI
 * ===========================================
 * 
 * Model lưu trữ các token đã bị thu hồi (logout, đổi mật khẩu, etc.)
 */

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const TokenBlacklist = sequelize.define('TokenBlacklist', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },

    token: {
        type: DataTypes.TEXT,
        allowNull: false,
        comment: 'JWT token bị thu hồi'
    },

    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'ID của user sở hữu token'
    },

    expires_at: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: 'Thời điểm token hết hạn (để cleanup)'
    },

    reason: {
        type: DataTypes.STRING(100),
        allowNull: true,
        comment: 'Lý do: logout, password_changed, security'
    }
}, {
    tableName: 'token_blacklist',
    timestamps: true,
    underscored: true,
    indexes: [
        { fields: ['user_id'] },
        { fields: ['expires_at'] }
    ]
});

module.exports = TokenBlacklist;
