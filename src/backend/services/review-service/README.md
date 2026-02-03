# ⭐Review Service

Review Service là microservice dùng để lưu và lấy đánh giá (review) của sản phẩm theo product_id.

Service này có database MySQL riêng, không lưu thông tin product, chỉ liên kết qua product_id.

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
PORT=3001

DB_HOST=localhost
DB_PORT=3306
DB_NAME=review_db
DB_USER=root
DB_PASSWORD=
```

3. **Tạo database:**

Trong MySQL Workbench hoặc terminal:

```sql
CREATE DATABASE review_db;
USE review_db;

CREATE TABLE reviews (
  id INT AUTO_INCREMENT PRIMARY KEY,
  product_id INT NOT NULL,
  rating INT,
  comment TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

4. **Chạy service:**
```bash
node src/server.js
```

Nếu thành công:

**Review Service running on port 3001**

## API Endpoints

### Lấy review theo sản phẩm
**GET** /reviews/:productId


**Ví dụ:**
```
GET http://localhost:3001/reviews/1
```

Response khi chưa có dữ liệu:
```
[]
```

**Tạo review mới**
**POST** /reviews


**Body:**
```json
{
  "product_id": 1,
  "rating": 5,
  "comment": "Sản phẩm tốt"
}
```

## Cấu trúc thư mục
```
review-service/
├── src/
│   ├── config/
│   │   └── database.js          # Cấu hình kết nối MySQL cho Review Service
│   │
│   ├── controllers/
│   │   └── review.controller.js # Xử lý HTTP requests (POST/GET review)
│   │                              # Nhận dữ liệu từ client và trả response JSON
│   │
│   ├── routes/
│   │   └── review.route.js      # Định nghĩa API endpoints cho review
│   │                              # POST /reviews
│   │                              # GET  /reviews/:productId
│   │
│   ├── app.js                   # Khởi tạo Express app
│   │                              # Load middleware và review routes
│   │
│   └── server.js                # Entry point
│                                  # Chạy server và lắng nghe port (3001)
│
├── .env                          # Biến môi trường (PORT, DB_*)
└── package.json                  # Thông tin project & dependencies
```

## Ghi chú

- Nếu chưa có review, API sẽ trả về []
- Service hoạt động độc lập
- Các service khác có thể gọi để lấy đánh giá sản phẩm