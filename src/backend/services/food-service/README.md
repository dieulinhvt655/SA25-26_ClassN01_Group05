# Food Service

Microservice quản lý thông tin món ăn (Food) cho ứng dụng Yummy Food Delivery.

## Cài đặt

1. **Cài đặt dependencies:**

```bash
npm install
```

2. **Cấu hình database:**

   - Tạo file `.env` từ `.env.example`:

   ```bash
   cp .env.example .env
   ```

   - Cập nhật thông tin MySQL trong file `.env`:

   ```env
   DB_NAME=food_service_db
   DB_USER=root
   DB_PASSWORD=your_mysql_password
   DB_HOST=localhost
   DB_PORT=3306
   ```

3. **Tạo database:**

   - Đăng nhập MySQL:

   ```bash
   mysql -u root -p
   ```

   - Tạo database:

   ```sql
   CREATE DATABASE food_service_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   ```

4. **Chạy service:**

```bash
npm start
```

Service sẽ chạy trên port 3001 và tự động tạo bảng `foods` nếu chưa có.

## API Endpoints

- `GET /api/foods` - Lấy danh sách tất cả món ăn
- `GET /api/foods/:id` - Lấy món ăn theo ID
- `POST /api/foods` - Tạo món ăn mới
- `PUT /api/foods/:id` - Cập nhật món ăn
- `DELETE /api/foods/:id` - Xóa món ăn

## Cấu trúc

```
food-service/
├── config/
│   └── database.js          # Cấu hình kết nối database
├── controllers/
│   └── food.controller.js   # Xử lý HTTP requests
├── models/
│   └── food.sequelize.js    # Sequelize model
├── repositories/
│   └── food.repository.js   # Data access layer
├── routes/
│   └── food.routes.js       # Route definitions
├── services/
│   └── food.service.js      # Business logic
└── index.js                 # Entry point
```
