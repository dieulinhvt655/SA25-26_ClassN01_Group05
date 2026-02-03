# Notification Service - Tài Liệu Chi Tiết

## Tổng quan

**Notification Service** là một microservice độc lập trong hệ thống Food Delivery Yummy App, chịu trách nhiệm xử lý và gửi thông báo đến người dùng.

### Phạm vi chức năng

**Bao gồm:**
- Nhận events từ RabbitMQ (order.*, payment.*, user.*)
- Tạo và lưu trữ notifications
- Gửi push notifications (Firebase simulation)
- Gửi email notifications (SMTP simulation)
- Quản lý device tokens (FCM/APNs)

**KHÔNG bao gồm:**
- Xử lý đơn hàng
- Thanh toán
- Quản lý users

---

## Kiến trúc Event-Driven

### Tại sao dùng Event-Driven với RabbitMQ?

1. **Loose Coupling (Tách rời)**
   - Order Service, Payment Service không cần biết Notification Service tồn tại
   - Chúng chỉ publish events, không quan tâm ai sẽ consume

2. **Reliability (Tin cậy)**
   - Messages được persist trong queue
   - Nếu Notification Service down, messages không mất
   - Khi service recover, sẽ xử lý messages còn pending

3. **Scalability (Mở rộng)**
   - Có thể chạy nhiều instances của Notification Service
   - RabbitMQ tự động load balance messages giữa các consumers

4. **Async Processing**
   - Order Service không cần đợi notification được gửi
   - Tăng tốc độ response cho user

### Luồng xử lý Event

```
1. Order Service → Publish "order.confirmed" → RabbitMQ Exchange
2. Exchange routes message → notification.queue
3. Consumer nhận message → parse JSON payload
4. NotificationService.processEvent() → Tạo notification
5. Lưu vào MySQL database
6. Gửi push notification đến devices
7. Cập nhật status (SENT/FAILED)
8. Acknowledge message
```

---

## Database Schema

### 1. notifications

| Cột | Kiểu | Mô tả |
|-----|------|-------|
| id | BIGINT | Khóa chính (auto increment) |
| user_id | VARCHAR(255) | ID user nhận notification |
| title | VARCHAR(255) | Tiêu đề |
| content | TEXT | Nội dung chi tiết |
| type | ENUM | PUSH, EMAIL |
| status | ENUM | PENDING, SENT, FAILED |
| is_read | BOOLEAN | Đã đọc chưa |
| metadata | JSON | Dữ liệu bổ sung (order_id, etc.) |
| created_at | TIMESTAMP | Thời gian tạo |
| sent_at | TIMESTAMP | Thời gian gửi thành công |

### 2. device_tokens

| Cột | Kiểu | Mô tả |
|-----|------|-------|
| id | BIGINT | Khóa chính |
| user_id | VARCHAR(255) | ID user sở hữu device |
| device_type | ENUM | ANDROID, IOS, WEB |
| token | TEXT | FCM/APNs token |
| is_active | BOOLEAN | Token còn hoạt động |
| created_at | TIMESTAMP | Thời gian tạo |

---

## RabbitMQ Configuration

| Component | Value |
|-----------|-------|
| Exchange | `notification.exchange` (topic) |
| Queue | `notification.queue` |
| Durable | Yes (persist sau restart) |

### Routing Keys

| Key | Event Source | Notification |
|-----|--------------|--------------|
| `order.confirmed` | Order Service | "🎉 Đơn hàng đã được xác nhận!" |
| `order.delivered` | Order Service | "✅ Đơn hàng đã giao thành công!" |
| `payment.success` | Payment Service | "💰 Thanh toán thành công!" |
| `user.registered` | User Service | "👋 Chào mừng bạn đến với Yummy!" |

---

## API Endpoints

### GET /notifications

Lấy danh sách notifications của user với phân trang.

```http
GET /notifications?userId=user-123&page=1&limit=20
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "userId": "user-123",
      "title": "🎉 Đơn hàng đã được xác nhận!",
      "content": "Đơn hàng #order-456 từ Nhà hàng ABC đã được xác nhận",
      "type": "PUSH",
      "status": "SENT",
      "isRead": false,
      "metadata": { "orderId": "order-456" },
      "createdAt": "2026-02-03T10:00:00.000Z"
    }
  ],
  "pagination": {
    "total": 50,
    "page": 1,
    "limit": 20,
    "totalPages": 3
  }
}
```

---

### PATCH /notifications/:id/read

Đánh dấu notification đã đọc.

```http
PATCH /notifications/1/read
```

**Response:**
```json
{
  "success": true,
  "message": "Đã đánh dấu là đã đọc",
  "data": { ... }
}
```

---

### PATCH /notifications/read-all

Đánh dấu tất cả notifications đã đọc.

```http
PATCH /notifications/read-all?userId=user-123
```

---

### POST /device-tokens

Đăng ký device token để nhận push notifications.

```http
POST /device-tokens
Content-Type: application/json

{
  "userId": "user-123",
  "deviceType": "ANDROID",
  "token": "dXbV9sK3..."
}
```

---

### DELETE /device-tokens/:token

Xóa device token (khi logout).

```http
DELETE /device-tokens/dXbV9sK3...
```

---

## Sample Event Payloads

### order.confirmed

```json
{
  "userId": "user-123",
  "orderId": "order-456",
  "restaurantName": "Nhà hàng ABC",
  "totalAmount": 150000,
  "timestamp": "2026-02-03T10:00:00Z"
}
```

### payment.success

```json
{
  "userId": "user-123",
  "orderId": "order-456",
  "amount": 150000,
  "paymentMethod": "MOMO",
  "timestamp": "2026-02-03T10:05:00Z"
}
```

### user.registered

```json
{
  "userId": "user-789",
  "email": "newuser@example.com",
  "name": "Nguyễn Văn A",
  "timestamp": "2026-02-03T09:00:00Z"
}
```

---

## Hướng dẫn chạy locally

### Yêu cầu

- Node.js >= 18.x
- MySQL >= 8.x
- RabbitMQ >= 3.x (hoặc Docker)

### Các bước thực hiện

1. **Cài đặt dependencies:**
```bash
cd src/backend/services/notification-service
npm install
```

2. **Cấu hình môi trường:**
```bash
cp .env.example .env
# Chỉnh sửa .env với thông tin database và RabbitMQ
```

3. **Tạo database:**
```bash
mysql -u root -p -e "CREATE DATABASE notification_service_db"
```

4. **Chạy RabbitMQ (Docker):**
```bash
docker run -d --name rabbitmq \
  -p 5672:5672 \
  -p 15672:15672 \
  rabbitmq:management
```
(Truy cập http://localhost:15672 với guest/guest để xem management UI)

5. **Chạy service:**
```bash
npm run dev
```

6. **Test với sample events:**
```bash
node src/utils/testPublisher.js
```

---

## Cấu trúc thư mục

```
notification-service/
├── src/
│   ├── app.js                    # Entry point
│   ├── config/
│   │   ├── db.js                 # MySQL configuration
│   │   └── rabbitmq.js           # RabbitMQ configuration
│   ├── consumers/
│   │   └── notification.consumer.js  # Event listener
│   ├── models/
│   │   ├── index.js
│   │   ├── notification.model.js
│   │   └── deviceToken.model.js
│   ├── repositories/
│   │   ├── notification.repository.js
│   │   └── deviceToken.repository.js
│   ├── services/
│   │   ├── notification.service.js
│   │   ├── deviceToken.service.js
│   │   ├── push.service.js       # Firebase simulation
│   │   └── email.service.js      # Email simulation
│   ├── controllers/
│   │   ├── notification.controller.js
│   │   └── deviceToken.controller.js
│   ├── routes/
│   │   ├── index.js
│   │   ├── notification.routes.js
│   │   └── deviceToken.routes.js
│   └── utils/
│       └── testPublisher.js      # Test utility
├── migrations/
│   └── 001_create_tables.sql
├── .env.example
├── package.json
└── README.md
```

---

## HTTP Status Codes

| Code | Ý nghĩa |
|------|---------|
| 200 | Thành công |
| 201 | Tạo mới thành công |
| 400 | Dữ liệu không hợp lệ |
| 404 | Không tìm thấy |
| 500 | Lỗi server |

---

## Lưu ý

- Service này chạy độc lập trên port **3005**
- Cần RabbitMQ đang chạy để nhận events
- Push/Email hiện tại là simulation (chỉ log), cần tích hợp Firebase Admin SDK và SMTP cho production
- Tất cả ID sử dụng **BIGINT auto-increment** (khác với Restaurant Service dùng UUID)
