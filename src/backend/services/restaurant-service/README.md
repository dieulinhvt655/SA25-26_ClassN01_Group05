# Restaurant Service

> Microservice quản lý thông tin nhà hàng, menu và các tùy chọn cho ứng dụng Food Delivery (Yummy App).

## 🏗️ Tech Stack

| Công nghệ | Phiên bản |
|-----------|-----------|
| Node.js | >= 18.x |
| Express.js | 4.18.x |
| MySQL | 8.x |
| Sequelize ORM | 6.35.x |

## 📁 Cấu trúc dự án

```
restaurant-service/
├── config/
│   └── database.js          # Cấu hình MySQL
├── models/                   # Sequelize models
├── repositories/             # Data access layer
├── services/                 # Business logic
├── controllers/              # HTTP handlers
├── routes/                   # API routes
├── middlewares/              # Express middlewares
├── migrations/               # SQL migrations
├── index.js                  # Entry point
└── package.json
```

## 🚀 Quick Start

```bash
# 1. Cài đặt dependencies
npm install

# 2. Copy và cấu hình .env
cp .env.example .env

# 3. Tạo database
mysql -u root -p -e "CREATE DATABASE restaurant_service_db"

# 4. Chạy service
npm run dev
```

## 🔗 API Endpoints

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | `/health` | Health check |
| GET/POST | `/restaurants` | CRUD nhà hàng |
| GET/POST | `/restaurants/:id/categories` | Categories theo nhà hàng |
| GET/POST | `/categories/:id/items` | Items theo category |
| GET/POST | `/items/:id/option-groups` | Option groups theo item |
| GET/POST | `/option-groups/:id/options` | Options theo group |

📚 Xem chi tiết trong `SERVICE_DOCS.md`
