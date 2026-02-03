-- ==========================================
-- SQL Migration: Tạo các bảng cho Notification Service
-- Database: MySQL
-- ==========================================

-- Tạo database nếu chưa có
CREATE DATABASE IF NOT EXISTS notification_service_db
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

USE notification_service_db;

-- ==========================================
-- Bảng 1: notifications
-- Lưu trữ tất cả notifications đã tạo
-- ==========================================
CREATE TABLE IF NOT EXISTS notifications (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL COMMENT 'ID của user nhận notification',
    title VARCHAR(255) NOT NULL COMMENT 'Tiêu đề notification',
    content TEXT COMMENT 'Nội dung chi tiết',
    type ENUM('PUSH', 'EMAIL') NOT NULL DEFAULT 'PUSH' COMMENT 'Loại notification',
    status ENUM('PENDING', 'SENT', 'FAILED') NOT NULL DEFAULT 'PENDING' COMMENT 'Trạng thái gửi',
    is_read BOOLEAN NOT NULL DEFAULT FALSE COMMENT 'Đã đọc chưa',
    metadata JSON COMMENT 'Dữ liệu bổ sung (order_id, payment_id, etc.)',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Thời gian tạo',
    sent_at TIMESTAMP NULL COMMENT 'Thời gian gửi thành công',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_user_id (user_id),
    INDEX idx_status (status),
    INDEX idx_is_read (is_read),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==========================================
-- Bảng 2: device_tokens
-- Lưu FCM/APNs tokens của users để gửi push notification
-- ==========================================
CREATE TABLE IF NOT EXISTS device_tokens (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL COMMENT 'ID của user sở hữu device',
    device_type ENUM('ANDROID', 'IOS', 'WEB') NOT NULL COMMENT 'Loại thiết bị',
    token TEXT NOT NULL COMMENT 'FCM/APNs token',
    is_active BOOLEAN NOT NULL DEFAULT TRUE COMMENT 'Token còn hoạt động không',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_user_id (user_id),
    INDEX idx_is_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==========================================
-- Sample Event Payloads (để test)
-- ==========================================
-- Event: order.confirmed
-- {
--     "eventType": "order.confirmed",
--     "userId": "user-123",
--     "orderId": "order-456",
--     "restaurantName": "Nhà hàng ABC",
--     "totalAmount": 150000,
--     "timestamp": "2026-02-03T10:00:00Z"
-- }

-- Event: payment.success
-- {
--     "eventType": "payment.success",
--     "userId": "user-123",
--     "orderId": "order-456",
--     "amount": 150000,
--     "paymentMethod": "MOMO",
--     "timestamp": "2026-02-03T10:05:00Z"
-- }

-- Event: user.registered
-- {
--     "eventType": "user.registered",
--     "userId": "user-789",
--     "email": "newuser@example.com",
--     "name": "Nguyễn Văn A",
--     "timestamp": "2026-02-03T09:00:00Z"
-- }
