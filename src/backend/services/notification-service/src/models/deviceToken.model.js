/**
 * Model DeviceToken
 * 
 * Lưu trữ FCM (Firebase Cloud Messaging) hoặc APNs tokens của users.
 * Mỗi user có thể có nhiều device tokens (đăng nhập trên nhiều thiết bị).
 * 
 * Device types:
 * - ANDROID: Token từ Firebase Cloud Messaging
 * - IOS: Token từ Apple Push Notification service
 * - WEB: Token từ Web Push
 */

const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const DeviceToken = sequelize.define('DeviceToken', {
    id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
        comment: 'ID tự động tăng'
    },
    userId: {
        type: DataTypes.STRING(255),
        allowNull: false,
        field: 'user_id',
        comment: 'ID của user sở hữu device'
    },
    deviceType: {
        type: DataTypes.ENUM('ANDROID', 'IOS', 'WEB'),
        allowNull: false,
        field: 'device_type',
        comment: 'Loại thiết bị: ANDROID, IOS, WEB'
    },
    token: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
            notEmpty: { msg: 'Token không được để trống' }
        },
        comment: 'FCM/APNs token để gửi push notification'
    },
    isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        field: 'is_active',
        comment: 'Token còn hoạt động không (có thể bị revoke khi logout)'
    }
}, {
    tableName: 'device_tokens',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

module.exports = DeviceToken;
