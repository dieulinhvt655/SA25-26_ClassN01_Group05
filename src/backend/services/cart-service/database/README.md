# Database Setup cho Cart Service

## Tạo database và bảng (một lệnh)

1. **Bật MySQL** (nếu chưa chạy):

```bash
# macOS (Homebrew)
brew services start mysql
```

2. **Chạy file `cart-service-init.sql`** (tạo database `cart_service_db` + bảng `carts`, `cart_items`):

```bash
cd src/backend/services/cart-service
mysql -u root -p < database/cart-service-init.sql
```

(Nhập password MySQL khi được hỏi. Nếu root không có password: `mysql -u root < database/cart-service-init.sql`)

**Nếu bảng `cart_items` đã tồn tại với `food_id INT`** (từ khi dùng food-service), cần đổi sang UUID (restaurant-service):

```sql
USE cart_service_db;
ALTER TABLE cart_items MODIFY food_id VARCHAR(36) NOT NULL COMMENT 'UUID từ restaurant-service menu_items.id';
```

Hoặc trong MySQL client:

```sql
SOURCE /đường/dẫn/đến/database/cart-service-init.sql;
```

## Cấu trúc Database

### Bảng `carts`
- `cart_id` (INT, PRIMARY KEY, AUTO_INCREMENT)
- `user_id` (VARCHAR(255), NOT NULL)
- `status` (ENUM: 'active', 'checked_out', 'abandoned', DEFAULT 'active')
- `total_amount` (DECIMAL(10,2), DEFAULT 0.00)
- `total_items` (INT, DEFAULT 0)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

### Bảng `cart_items`
- `cart_item_id` (INT, PRIMARY KEY, AUTO_INCREMENT)
- `cart_id` (INT, FOREIGN KEY -> carts.cart_id, ON DELETE CASCADE)
- `food_id` (VARCHAR(36), NOT NULL) — UUID từ restaurant-service (menu_items.id)
- `food_name` (VARCHAR(255), NOT NULL)
- `food_image` (VARCHAR(500))
- `unit_price` (DECIMAL(10,2), DEFAULT 0.00)
- `quantity` (INT, DEFAULT 1)
- `total_price` (DECIMAL(10,2), DEFAULT 0.00)
- `note` (TEXT)
- `is_available` (BOOLEAN, DEFAULT TRUE)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

### Quan hệ
- Cart 1-n CartItem (một cart có nhiều items)
- Foreign key: `cart_items.cart_id` -> `carts.cart_id`
- ON DELETE CASCADE: Khi xóa cart, tự động xóa tất cả items

### Indexes
- `idx_user_id` trên `carts.user_id`
- `idx_status` trên `carts.status`
- `idx_cart_id` trên `cart_items.cart_id`
- `idx_food_id` trên `cart_items.food_id`
- `unique_cart_food` trên `(cart_id, food_id)` - đảm bảo mỗi food chỉ có 1 item trong 1 cart
