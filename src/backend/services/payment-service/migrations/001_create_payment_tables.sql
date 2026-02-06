-- ==========================================
-- SQL Migration: Tạo các bảng cho Payment Service
-- Database: MySQL
-- ==========================================

-- Tạo database nếu chưa có
CREATE DATABASE IF NOT EXISTS payment_service_db
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

USE payment_service_db;

-- ==========================================
-- Bảng 1: payments
-- Lưu trữ thông tin thanh toán cho mỗi đơn hàng
-- ==========================================
CREATE TABLE IF NOT EXISTS payments (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    order_id VARCHAR(255) NOT NULL COMMENT 'ID đơn hàng (Unique)',
    user_id VARCHAR(255) NOT NULL COMMENT 'ID người dùng',
    amount DECIMAL(15, 2) NOT NULL COMMENT 'Số tiền thanh toán',
    currency VARCHAR(10) DEFAULT 'VND' COMMENT 'Đơn vị tiền tệ',
    method ENUM('COD', 'MOMO', 'ZALOPAY', 'BANKING') NOT NULL COMMENT 'Phương thức thanh toán',
    status ENUM('PENDING', 'SUCCESS', 'FAILED', 'CANCELLED', 'EXPIRED') DEFAULT 'PENDING' COMMENT 'Trạng thái thanh toán',
    transaction_ref VARCHAR(255) COMMENT 'Mã giao dịch từ cổng thanh toán (nếu có)',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    UNIQUE KEY idx_order_id (order_id),
    INDEX idx_user_id (user_id),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==========================================
-- Bảng 2: payment_transactions
-- Lưu lịch sử thay đổi trạng thái và audit logs
-- ==========================================
CREATE TABLE IF NOT EXISTS payment_transactions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    payment_id BIGINT NOT NULL COMMENT 'Reference đến bảng payments',
    status_from VARCHAR(50) COMMENT 'Trạng thái cũ',
    status_to VARCHAR(50) COMMENT 'Trạng thái mới',
    notes TEXT COMMENT 'Ghi chú, lỗi, hoặc response từ gateway',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (payment_id) REFERENCES payments(id) ON DELETE CASCADE,
    INDEX idx_payment_id (payment_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
