-- ==========================================
-- SQL Migration: Tạo các bảng cho Restaurant Service
-- Database: MySQL
-- ==========================================

-- Tạo database nếu chưa có
CREATE DATABASE IF NOT EXISTS restaurant_service_db
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

USE restaurant_service_db;

-- ==========================================
-- Bảng 1: restaurants
-- ==========================================
CREATE TABLE IF NOT EXISTS restaurants (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    address VARCHAR(500),
    phone VARCHAR(20),
    image_url VARCHAR(500),
    status ENUM('OPEN', 'CLOSED', 'INACTIVE') DEFAULT 'OPEN',
    open_time TIME,
    close_time TIME,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_status (status),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==========================================
-- Bảng 2: menu_categories
-- ==========================================
CREATE TABLE IF NOT EXISTS menu_categories (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    restaurant_id CHAR(36) NOT NULL,
    name VARCHAR(255) NOT NULL,
    display_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (restaurant_id) REFERENCES restaurants(id) ON DELETE CASCADE,
    INDEX idx_restaurant_id (restaurant_id),
    INDEX idx_display_order (display_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==========================================
-- Bảng 3: menu_items
-- ==========================================
CREATE TABLE IF NOT EXISTS menu_items (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    category_id CHAR(36) NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    base_price DECIMAL(10, 2) NOT NULL DEFAULT 0,
    image_url VARCHAR(500),
    is_available BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES menu_categories(id) ON DELETE CASCADE,
    INDEX idx_category_id (category_id),
    INDEX idx_is_available (is_available)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==========================================
-- Bảng 4: option_groups
-- ==========================================
CREATE TABLE IF NOT EXISTS option_groups (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    item_id CHAR(36) NOT NULL,
    name VARCHAR(255) NOT NULL,
    required BOOLEAN DEFAULT FALSE,
    min_select INT DEFAULT 0,
    max_select INT DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (item_id) REFERENCES menu_items(id) ON DELETE CASCADE,
    INDEX idx_item_id (item_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==========================================
-- Bảng 5: options
-- ==========================================
CREATE TABLE IF NOT EXISTS options (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    option_group_id CHAR(36) NOT NULL,
    name VARCHAR(255) NOT NULL,
    extra_price DECIMAL(10, 2) DEFAULT 0,
    is_default BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (option_group_id) REFERENCES option_groups(id) ON DELETE CASCADE,
    INDEX idx_option_group_id (option_group_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==========================================
-- Sample Data (Dữ liệu mẫu)
-- ==========================================

-- Thêm nhà hàng mẫu
INSERT INTO restaurants (id, name, description, address, phone, status, open_time, close_time)
VALUES 
    ('11111111-1111-1111-1111-111111111111', 'Nhà hàng Phở Việt', 'Phở truyền thống Hà Nội', '123 Đường Nguyễn Huệ, Q.1, TP.HCM', '0901234567', 'OPEN', '06:00:00', '22:00:00'),
    ('22222222-2222-2222-2222-222222222222', 'Quán Cơm Tấm Sài Gòn', 'Cơm tấm sườn bì chả', '456 Đường Lê Lợi, Q.3, TP.HCM', '0907654321', 'OPEN', '07:00:00', '21:00:00');

-- Thêm danh mục mẫu
INSERT INTO menu_categories (id, restaurant_id, name, display_order, is_active)
VALUES
    ('aaaa1111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 'Phở', 1, TRUE),
    ('aaaa2222-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111111', 'Đồ uống', 2, TRUE),
    ('bbbb1111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222', 'Cơm tấm', 1, TRUE);

-- Thêm món ăn mẫu
INSERT INTO menu_items (id, category_id, name, description, base_price, is_available)
VALUES
    ('item1111-1111-1111-1111-111111111111', 'aaaa1111-1111-1111-1111-111111111111', 'Phở Bò Tái', 'Phở với thịt bò tái chín', 55000, TRUE),
    ('item2222-2222-2222-2222-222222222222', 'aaaa1111-1111-1111-1111-111111111111', 'Phở Gà', 'Phở với thịt gà xé', 50000, TRUE),
    ('item3333-3333-3333-3333-333333333333', 'aaaa2222-2222-2222-2222-222222222222', 'Trà Đá', 'Trà đá miễn phí', 0, TRUE),
    ('item4444-4444-4444-4444-444444444444', 'bbbb1111-1111-1111-1111-111111111111', 'Cơm Tấm Sườn Bì Chả', 'Đầy đủ sườn, bì, chả, trứng', 65000, TRUE);

-- Thêm nhóm tùy chọn mẫu
INSERT INTO option_groups (id, item_id, name, required, min_select, max_select)
VALUES
    ('grp11111-1111-1111-1111-111111111111', 'item1111-1111-1111-1111-111111111111', 'Chọn size', TRUE, 1, 1),
    ('grp22222-2222-2222-2222-222222222222', 'item1111-1111-1111-1111-111111111111', 'Thêm topping', FALSE, 0, 3),
    ('grp33333-3333-3333-3333-333333333333', 'item4444-4444-4444-4444-444444444444', 'Chọn thêm', FALSE, 0, 2);

-- Thêm tùy chọn mẫu
INSERT INTO options (id, option_group_id, name, extra_price, is_default)
VALUES
    ('opt11111-1111-1111-1111-111111111111', 'grp11111-1111-1111-1111-111111111111', 'Size nhỏ', 0, TRUE),
    ('opt22222-2222-2222-2222-222222222222', 'grp11111-1111-1111-1111-111111111111', 'Size lớn', 15000, FALSE),
    ('opt33333-3333-3333-3333-333333333333', 'grp22222-2222-2222-2222-222222222222', 'Thêm thịt bò', 20000, FALSE),
    ('opt44444-4444-4444-4444-444444444444', 'grp22222-2222-2222-2222-222222222222', 'Thêm trứng', 10000, FALSE),
    ('opt55555-5555-5555-5555-555555555555', 'grp33333-3333-3333-3333-333333333333', 'Thêm sườn', 25000, FALSE),
    ('opt66666-6666-6666-6666-666666666666', 'grp33333-3333-3333-3333-333333333333', 'Thêm chả', 15000, FALSE);
