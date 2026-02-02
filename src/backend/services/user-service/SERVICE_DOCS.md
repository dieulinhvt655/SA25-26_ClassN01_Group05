# 📖 Tài liệu User Service

## 1. Giới thiệu

**User Service** là microservice chịu trách nhiệm xử lý toàn bộ logic liên quan đến **xác thực người dùng (Authentication)** trong hệ thống Yummy Food Delivery.

### Thông tin cơ bản
| Thuộc tính | Giá trị |
|------------|---------|
| **Port** | 3002 |
| **Database** | MySQL (yummy_db) |
| **ORM** | Sequelize |
| **Authentication** | JWT (JSON Web Token) |

---

## 2. Kiến trúc Layered Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      CLIENT (Mobile/Web)                     │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼ HTTP Request
┌─────────────────────────────────────────────────────────────┐
│                     ROUTES (user.routes.js)                  │
│         Định nghĩa các endpoint: /register, /login          │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│               MIDDLEWARE (verifyToken.js)                    │
│     Xác thực JWT Token cho các protected routes              │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│              CONTROLLER (user.controller.js)                 │
│         Nhận request, validate input, gọi service            │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                SERVICE (auth.service.js)                     │
│     Xử lý business logic: hash password, tạo JWT             │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                  MODEL (user.model.js)                       │
│           Định nghĩa cấu trúc bảng User                      │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    MySQL DATABASE                            │
│                  Bảng: users                                 │
└─────────────────────────────────────────────────────────────┘
```

---

## 3. Flow Đăng ký (Register)

```mermaid
sequenceDiagram
    participant C as Client
    participant R as Routes
    participant CT as Controller
    participant S as Service
    participant DB as Database

    C->>R: POST /api/auth/register
    Note right of R: Body: {email, password, role, fullName}
    
    R->>CT: userController.register()
    CT->>CT: Validate input (email, password, fullName)
    
    alt Input không hợp lệ
        CT-->>C: 400 Bad Request
    end
    
    CT->>S: authService.register()
    S->>DB: Kiểm tra email đã tồn tại?
    
    alt Email đã tồn tại
        S-->>CT: Throw Error
        CT-->>C: 400 "Email đã được sử dụng"
    end
    
    S->>S: Hash password với bcrypt (10 rounds)
    S->>DB: INSERT user mới
    DB-->>S: User created
    S-->>CT: Return user info
    CT-->>C: 201 "Đăng ký thành công!"
```

### Chi tiết các bước:

1. **Client gửi request** với body chứa email, password, role, fullName
2. **Controller validate** input - kiểm tra các trường bắt buộc
3. **Service kiểm tra email** - đảm bảo email chưa được đăng ký
4. **Hash password** - sử dụng bcrypt với 10 salt rounds để mã hóa
5. **Lưu vào database** - tạo user mới với password đã hash
6. **Trả về thành công** - không bao gồm password trong response

---

## 4. Flow Đăng nhập (Login)

```mermaid
sequenceDiagram
    participant C as Client
    participant R as Routes
    participant CT as Controller
    participant S as Service
    participant DB as Database

    C->>R: POST /api/auth/login
    Note right of R: Body: {email, password}
    
    R->>CT: userController.login()
    CT->>CT: Validate input
    
    CT->>S: authService.login()
    S->>DB: Tìm user theo email
    
    alt User không tồn tại
        S-->>CT: Throw Error
        CT-->>C: 401 "Email không tồn tại"
    end
    
    S->>S: bcrypt.compare(password, password_hash)
    
    alt Password sai
        S-->>CT: Throw Error
        CT-->>C: 401 "Mật khẩu không chính xác"
    end
    
    S->>S: Tạo JWT Token {userId, role}
    S-->>CT: Return {token, user}
    CT-->>C: 200 "Đăng nhập thành công!" + token
```

### Chi tiết JWT Token:

```javascript
// Payload của JWT Token
{
    userId: 1,        // ID của user trong database
    role: "customer"  // Vai trò: customer/admin/restaurant_owner
}

// Token có thời hạn 24h (cấu hình trong .env)
```

---

## 5. Flow Xác thực Token (verifyToken Middleware)

```mermaid
sequenceDiagram
    participant C as Client
    participant M as Middleware
    participant R as Route Handler

    C->>M: Request + Authorization: Bearer <token>
    
    alt Không có Authorization header
        M-->>C: 401 "Không có token"
    end
    
    alt Format sai (không phải "Bearer token")
        M-->>C: 401 "Token không hợp lệ"
    end
    
    M->>M: jwt.verify(token, JWT_SECRET)
    
    alt Token hết hạn
        M-->>C: 401 "Token hết hạn"
    end
    
    alt Token bị sửa đổi
        M-->>C: 401 "Token không hợp lệ"
    end
    
    M->>M: Gắn req.user = {userId, role}
    M->>R: next() - Cho phép tiếp tục
    R-->>C: 200 Response data
```

### Cách sử dụng trong các service khác:

```javascript
// 1. Copy file verifyToken.js vào service của bạn
// 2. Import và sử dụng
const verifyToken = require('./middlewares/verifyToken');

// Route không cần xác thực
router.get('/public', handler);

// Route cần xác thực
router.get('/protected', verifyToken, (req, res) => {
    // req.user.userId - ID của user
    // req.user.role   - Vai trò của user
});
```

---

## 6. Cấu trúc Database

### Bảng `users`

| Cột | Kiểu dữ liệu | Mô tả |
|-----|-------------|-------|
| `id` | INT (PK, Auto Increment) | Khóa chính |
| `email` | VARCHAR(255), UNIQUE | Email đăng nhập |
| `password_hash` | VARCHAR(255) | Mật khẩu đã mã hóa bcrypt |
| `role` | ENUM | 'customer', 'admin', 'restaurant_owner' |
| `full_name` | VARCHAR(255) | Họ tên đầy đủ |
| `created_at` | TIMESTAMP | Thời gian tạo |
| `updated_at` | TIMESTAMP | Thời gian cập nhật |

---

## 7. API Reference

### POST /api/auth/register

Đăng ký tài khoản mới.

**Request:**
```json
{
    "email": "user@example.com",
    "password": "123456",
    "role": "customer",
    "fullName": "Nguyễn Văn A"
}
```

**Response thành công (201):**
```json
{
    "message": "Đăng ký thành công!",
    "user": {
        "id": 1,
        "email": "user@example.com",
        "role": "customer",
        "fullName": "Nguyễn Văn A",
        "createdAt": "2026-02-02T07:00:00.000Z"
    }
}
```

---

### POST /api/auth/login

Đăng nhập và nhận JWT token.

**Request:**
```json
{
    "email": "user@example.com",
    "password": "123456"
}
```

**Response thành công (200):**
```json
{
    "message": "Đăng nhập thành công!",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
        "id": 1,
        "email": "user@example.com",
        "role": "customer",
        "fullName": "Nguyễn Văn A"
    }
}
```

---

### GET /api/auth/me (Protected)

Lấy thông tin user hiện tại.

**Header:** `Authorization: Bearer <token>`

**Response thành công (200):**
```json
{
    "user": {
        "id": 1,
        "email": "user@example.com",
        "role": "customer",
        "fullName": "Nguyễn Văn A",
        "createdAt": "2026-02-02T07:00:00.000Z"
    }
}
```

---

## 8. Error Codes

| HTTP Code | Ý nghĩa | Ví dụ |
|-----------|---------|-------|
| 400 | Bad Request | Thiếu thông tin bắt buộc, email đã tồn tại |
| 401 | Unauthorized | Sai mật khẩu, token không hợp lệ, token hết hạn |
| 404 | Not Found | User không tồn tại |
| 500 | Server Error | Lỗi database, lỗi server |
