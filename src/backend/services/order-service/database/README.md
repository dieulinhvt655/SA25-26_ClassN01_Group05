# Database Setup cho Order Service

## Tạo database và bảng (một lệnh)

1. **Bật MySQL** (nếu chưa chạy):

```bash
brew services start mysql
```

2. **Chạy file `order-service-init.sql`**:

```bash
cd src/backend/services/order-service
mysql -u root -p < database/order-service-init.sql
```

(Nhập password MySQL khi được hỏi.)

## Cập nhật ENUM status (nếu DB đã tồn tại)

Nếu bảng `orders` đã có với ENUM cũ, chạy:

```sql
USE order_service_db;
ALTER TABLE orders MODIFY status ENUM('pending_payment', 'payment_failed', 'paid', 'confirmed', 'delivering', 'completed', 'cancelled') NOT NULL DEFAULT 'pending_payment';
```

## Cấu trúc

- **orders**: order_id, user_id, cart_id, status, total_amount, total_items, created_at, updated_at  
  - status: pending_payment | payment_failed | paid | confirmed | delivering | completed | cancelled
- **order_items**: order_item_id, order_id, food_id, food_name, unit_price, quantity, total_price, note, ...

Quan hệ: Order 1-n OrderItem.
