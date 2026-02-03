-- Cart Service: tạo database cart_service_db và các bảng
CREATE DATABASE IF NOT EXISTS cart_service_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE cart_service_db;

-- Bảng Cart
CREATE TABLE IF NOT EXISTS carts (
    cart_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    status ENUM('active', 'checked_out', 'abandoned') NOT NULL DEFAULT 'active',
    total_amount DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    total_items INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_user_id (user_id),
    INDEX idx_status (status),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Bảng CartItem
CREATE TABLE IF NOT EXISTS cart_items (
    cart_item_id INT AUTO_INCREMENT PRIMARY KEY,
    cart_id INT NOT NULL,
    food_id VARCHAR(36) NOT NULL COMMENT 'UUID từ restaurant-service menu_items.id',
    food_name VARCHAR(255) NOT NULL,
    food_image VARCHAR(500) DEFAULT NULL,
    unit_price DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    quantity INT NOT NULL DEFAULT 1,
    total_price DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    note TEXT DEFAULT NULL,
    is_available BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (cart_id) REFERENCES carts(cart_id) ON DELETE CASCADE,
    INDEX idx_cart_id (cart_id),
    INDEX idx_food_id (food_id),
    INDEX idx_is_available (is_available),
    UNIQUE KEY unique_cart_food (cart_id, food_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
