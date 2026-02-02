# User Service - Yummy Food Delivery

## Mô tả
Service xử lý xác thực người dùng (Authentication) cho ứng dụng Yummy.

## Chức năng
- **Đăng ký** tài khoản mới
- **Đăng nhập** và nhận JWT Token
- **Middleware verifyToken** để bảo vệ API (chia sẻ cho team)

## Cấu trúc thư mục
```
user-service/
├── index.js                 # Entry point (port 3002)
├── package.json             # Dependencies
├── .env                     # Cấu hình môi trường
├── config/
│   └── database.js          # Kết nối MySQL với Sequelize
├── models/
│   └── user.model.js        # Model User (id, email, password_hash, role, full_name)
├── controllers/
│   └── user.controller.js   # Xử lý HTTP requests
├── services/
│   └── auth.service.js      # Logic đăng ký/đăng nhập/JWT
├── middlewares/
│   └── verifyToken.js       # Middleware xác thực token (CHIA SẺ CHO TEAM)
└── routes/
    └── user.routes.js       # Định nghĩa endpoints
```

## Cài đặt
```bash
# 1. Cài dependencies
npm install

# 2. Cấu hình .env
# Sửa file .env với thông tin database và JWT secret của bạn

# 3. Tạo database MySQL
# CREATE DATABASE yummy_db;

# 4. Chạy service
npm run dev
```

## API Endpoints

### POST /api/auth/register
Đăng ký tài khoản mới.
```json
{
  "email": "user@example.com",
  "password": "123456",
  "role": "customer",
  "fullName": "Nguyen Van A"
}
```

### POST /api/auth/login
Đăng nhập và nhận token.
```json
{
  "email": "user@example.com",
  "password": "123456"
}
```
**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": { "id": 1, "email": "...", "role": "customer", "fullName": "..." }
}
```

### GET /api/auth/me (Cần token)
Lấy thông tin user hiện tại.
Header: `Authorization: Bearer <token>`

## Chia sẻ middleware verifyToken cho team
File `middlewares/verifyToken.js` có thể copy sang các service khác để bảo vệ API.
Xem hướng dẫn chi tiết trong file đó.
