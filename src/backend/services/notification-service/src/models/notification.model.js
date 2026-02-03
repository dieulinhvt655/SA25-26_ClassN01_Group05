/**
 * Model Notification
 * 
 * Đại diện cho một thông báo trong hệ thống.
 * Notifications được tạo khi có events từ RabbitMQ (order, payment, user events).
 * 
 * Các trạng thái notification:
 * - PENDING: Đang chờ gửi
 * - SENT: Đã gửi thành công
 * - FAILED: Gửi thất bại
 */

const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Notification = sequelize.define('Notification', {
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
        comment: 'ID của user nhận notification'
    },
    title: {
        type: DataTypes.STRING(255),
        allowNull: false,
        validate: {
            notEmpty: { msg: 'Tiêu đề không được để trống' }
        },
        comment: 'Tiêu đề notification'
    },
    content: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: 'Nội dung chi tiết của notification'
    },
    type: {
        type: DataTypes.ENUM('PUSH', 'EMAIL'),
        defaultValue: 'PUSH',
        comment: 'Loại notification: PUSH (app) hoặc EMAIL'
    },
    status: {
        type: DataTypes.ENUM('PENDING', 'SENT', 'FAILED'),
        defaultValue: 'PENDING',
        comment: 'Trạng thái: PENDING (chờ gửi), SENT (đã gửi), FAILED (thất bại)'
    },
    isRead: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        field: 'is_read',
        comment: 'User đã đọc notification chưa'
    },
    metadata: {
        type: DataTypes.JSON,
        allowNull: true,
        comment: 'Dữ liệu bổ sung (order_id, payment_id, deep link, etc.)'
    },
    sentAt: {
        type: DataTypes.DATE,
        allowNull: true,
        field: 'sent_at',
        comment: 'Thời gian gửi thành công'
    }
}, {
    tableName: 'notifications',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

module.exports = Notification;
