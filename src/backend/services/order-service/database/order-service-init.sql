-- Order Service: tạo database order_service_db và các bảng
CREATE DATABASE IF NOT EXISTS order_service_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE order_service_db;

-- Bảng orders
CREATE TABLE IF NOT EXISTS orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    restaurant_id VARCHAR(255) NOT NULL,
    status ENUM('CREATED', 'PAID', 'CONFIRMED', 'COMPLETED', 'CANCELLED') NOT NULL DEFAULT 'CREATED',
    total_price DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    discount_amount DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    final_price DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    delivery_fee DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    delivery_address TEXT DEFAULT NULL,
    payment_method VARCHAR(50) DEFAULT NULL,
    payment_status VARCHAR(50) DEFAULT 'PENDING',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_user_id (user_id),
    INDEX idx_restaurant_id (restaurant_id),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Bảng order_items
CREATE TABLE IF NOT EXISTS order_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    food_id VARCHAR(255) NOT NULL,
    food_name VARCHAR(255) NOT NULL,
    food_image VARCHAR(500) DEFAULT NULL,
    unit_price DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    quantity INT NOT NULL DEFAULT 1,
    total_price DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    INDEX idx_order_id (order_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Bảng order_status_histories
CREATE TABLE IF NOT EXISTS order_status_histories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    status VARCHAR(50) NOT NULL,
    note TEXT DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    INDEX idx_order_id (order_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Bảng payment_infos
CREATE TABLE IF NOT EXISTS payment_infos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    payment_method VARCHAR(50) DEFAULT NULL,
    transaction_id VARCHAR(255) DEFAULT NULL,
    amount DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    status ENUM('PENDING', 'SUCCESS', 'FAILED', 'REFUNDED') NOT NULL DEFAULT 'PENDING',
    paid_at TIMESTAMP NULL DEFAULT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    INDEX idx_order_id (order_id),
    INDEX idx_transaction_id (transaction_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
