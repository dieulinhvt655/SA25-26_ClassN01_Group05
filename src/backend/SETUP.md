# Hướng dẫn Setup Backend

Hướng dẫn này giúp teammate setup và chạy các services trong dự án.

## Yêu cầu

- Node.js (v14 trở lên)
- MySQL (v8.0 trở lên)
- npm hoặc yarn

## Bước 1: Clone repository

```bash
git clone <repository-url>
cd SA25-26_ClassN01_Group05
```

## Bước 2: Setup Database

1. **Khởi động MySQL:**

```bash
# macOS (Homebrew)
brew services start mysql

# Hoặc kiểm tra MySQL đang chạy
mysql -u root -p
```

2. **Tạo database:**

```sql
CREATE DATABASE food_service_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

## Bước 3: Setup Food Service

1. **Vào thư mục food-service:**

```bash
cd src/backend/services/food-service
```

2. **Cài đặt dependencies:**

```bash
npm install
```

3. **Cấu hình environment:**

```bash
# Copy file .env.example thành .env
cp .env.example .env

# Mở file .env và cập nhật thông tin MySQL của bạn
# DB_PASSWORD=your_mysql_password
```

4. **Chạy service:**

```bash
npm start
```

Service sẽ chạy trên `http://localhost:3001`

## Bước 4: Setup API Gateway

1. **Vào thư mục api-gateway:**

```bash
cd ../api-gateway
```

2. **Cài đặt dependencies:**

```bash
npm install
```

3. **Cấu hình environment:**

```bash
# Copy file .env.example thành .env (nếu chưa có)
cp .env.example .env
```

4. **Chạy API Gateway:**

```bash
npm start
```

API Gateway sẽ chạy trên `http://localhost:3000`

## Kiểm tra

1. **Test Food Service trực tiếp:**

```bash
curl http://localhost:3001/api/foods
```

2. **Test qua API Gateway:**

```bash
curl http://localhost:3000/api/foods
```

3. **Health check API Gateway:**

```bash
curl http://localhost:3000/health
```

## Lưu ý quan trọng

- **KHÔNG commit file `.env`** lên git (đã có trong .gitignore)
- Mỗi teammate cần tạo file `.env` riêng với thông tin MySQL của mình
- Đảm bảo MySQL đang chạy trước khi start services
- Database sẽ tự động tạo bảng khi service khởi động lần đầu

## Troubleshooting

### Lỗi kết nối database

- Kiểm tra MySQL đang chạy: `brew services list | grep mysql`
- Kiểm tra password trong file `.env` đã đúng chưa
- Kiểm tra database đã được tạo chưa

### Port đã được sử dụng

- Dừng process cũ: `lsof -ti:3001 | xargs kill -9`
- Hoặc đổi port trong file `.env`
