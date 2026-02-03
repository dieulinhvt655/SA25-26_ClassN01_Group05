# 🎯Promotion Service

Promotion Service là microservice dùng để quản lý khuyến mãi (promotion) cho sản phẩm.

Mỗi promotion gắn với một product_id.

## Công nghệ sử dụng

- Node.js
- Express
- MySQL
- dotenv

## Cài đặt & chạy service
1. **Cài dependencies:**
```bash
npm install
```

2. **Cấu hình môi trường (.env):**
```env
PORT=3002

DB_HOST=localhost
DB_PORT=3306
DB_NAME=promotion_db
DB_USER=root
DB_PASSWORD=
```

3. **Tạo database:**
```sql
CREATE DATABASE promotion_db;
USE promotion_db;

CREATE TABLE promotions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  product_id INT,
  discount_percent INT,
  start_date DATE,
  end_date DATE
);
```

4. **Chạy service:**
```bash
node src/server.js
```

Nếu thành công:

**Promotion Service running on port 3002**

## API Endpoints

### Lấy promotion theo sản phẩm
**GET** /promotions/:productId


**Ví dụ:**
```
GET http://localhost:3002/promotions/1
```

Response khi chưa có promotion:
```
[]
```

**Tạo promotion mới**
**POST** /promotions


**Body:**
```json
{
  "product_id": 1,
  "discount_percent": 20,
  "start_date": "2024-12-01",
  "end_date": "2024-12-31"
}
```

## Cấu trúc thư mục
```
promotion-service/
├── src/
│   ├── controllers/
│   │   └── promotion.controller.js   # Xử lý request/response cho Promotion
│   │                                  # Nhận dữ liệu từ client, gọi model, trả JSON
│   │
│   ├── routes/
│   │   └── promotion.route.js         # Định nghĩa các API endpoint
│   │                                  # POST /promotions
│   │                                  # GET  /promotions/:productId
│   │
│   ├── models/
│   │   └── promotion.model.js         # Làm việc trực tiếp với MySQL
│   │                                  # Thực hiện các câu lệnh SQL (SELECT, INSERT)
│   │
│   ├── config/
│   │   └── database.js                # Cấu hình và khởi tạo kết nối MySQL
│   │                                  # Được import trong model
│   │
│   ├── app.js                         # Khởi tạo Express app
│   │                                  # Load middleware và promotion routes
│   │
│   └── server.js                      # Entry point của Promotion Service
│                                      # Lắng nghe port (ví dụ: 3002)
│
├── .env                                # Biến môi trường
│                                      # PORT, DB_HOST, DB_NAME, DB_USER, DB_PASSWORD
│
└── package.json                        # Thông tin project & dependencies
```

## Ghi chú

- Nếu chưa có promotion, API trả về []
- Promotion Service không quản lý product
- Các service khác gọi để lấy thông tin giảm giá