# Notification Service

Microservice xử lý thông báo với kiến trúc **event-driven** sử dụng RabbitMQ.

## Tổng quan

Service này **KHÔNG expose API** để gửi notification. Thay vào đó, nó:
- Lắng nghe events từ RabbitMQ (order.*, payment.*, user.*)
- Tự động tạo và gửi push/email notifications
- Chỉ cung cấp APIs để query và quản lý notifications

## Tech Stack

- Node.js + Express.js
- MySQL (Sequelize ORM)
- RabbitMQ (amqplib)

## Quick Start

```bash
# 1. Cài dependencies
npm install

# 2. Copy environment config
cp .env.example .env

# 3. Tạo database MySQL
mysql -u root -p -e "CREATE DATABASE notification_service_db"

# 4. Chạy RabbitMQ (cần Docker)
docker run -d --name rabbitmq -p 5672:5672 -p 15672:15672 rabbitmq:management

# 5. Chạy service (port 3005)
npm run dev

# 6. Test publish events (optional)
node src/utils/testPublisher.js
```

## Event-Driven Architecture

```
┌─────────────┐     ┌─────────────┐     ┌───────────────┐
│   Order     │     │   Payment   │     │    User       │
│   Service   │     │   Service   │     │   Service     │
└──────┬──────┘     └──────┬──────┘     └───────┬───────┘
       │ publish           │ publish            │ publish
       ▼                   ▼                    ▼
┌─────────────────────────────────────────────────────────┐
│                    RabbitMQ Exchange                     │
│                  (notification.exchange)                 │
└──────────────────────────┬──────────────────────────────┘
                           │ route
                           ▼
┌──────────────────────────────────────────────────────────┐
│                 Notification Queue                        │
└──────────────────────────┬───────────────────────────────┘
                           │ consume
                           ▼
┌──────────────────────────────────────────────────────────┐
│              Notification Service (Consumer)              │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐  │
│  │  MySQL   │  │ Firebase │  │  Email   │  │ HTTP API │  │
│  │ Storage  │  │  Push    │  │  SMTP    │  │ (Query)  │  │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘  │
└──────────────────────────────────────────────────────────┘
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/notifications?userId=` | Lấy notifications của user |
| PATCH | `/notifications/:id/read` | Đánh dấu đã đọc |
| PATCH | `/notifications/read-all?userId=` | Đánh dấu tất cả đã đọc |
| GET | `/notifications/unread-count?userId=` | Số notifications chưa đọc |
| POST | `/device-tokens` | Đăng ký FCM token |
| DELETE | `/device-tokens/:token` | Xóa token |
| GET | `/health` | Health check |

## RabbitMQ Events

| Routing Key | Notification |
|-------------|--------------|
| `order.confirmed` | "Đơn hàng đã được xác nhận!" |
| `order.delivered` | "Đơn hàng đã giao thành công!" |
| `payment.success` | "Thanh toán thành công!" |
| `user.registered` | "Chào mừng bạn đến với Yummy!" |

## Project Structure

```
notification-service/
├── src/
│   ├── app.js              # Entry point
│   ├── config/
│   │   ├── db.js           # MySQL config
│   │   └── rabbitmq.js     # RabbitMQ config
│   ├── consumers/          # Event listeners
│   ├── models/             # Sequelize models
│   ├── repositories/       # Data access
│   ├── services/           # Business logic
│   ├── controllers/        # HTTP handlers
│   ├── routes/             # API routing
│   └── utils/              # Test utilities
├── migrations/
└── package.json
```
