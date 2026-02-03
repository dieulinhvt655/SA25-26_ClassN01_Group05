# Hướng dẫn Chạy Dự Án Bằng Terminal

## 📋 Yêu cầu

- Node.js (v14 trở lên)
- MySQL (v8.0 trở lên)
- npm hoặc yarn

## 🚀 Các Lệnh Chạy Dự Án

### Bước 1: Setup Database

```bash
# Tạo database (thay YOUR_PASSWORD bằng mật khẩu MySQL của bạn)
mysql -u root -pYOUR_PASSWORD -e "CREATE DATABASE IF NOT EXISTS food_service_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
```

### Bước 2: Tạo File .env cho Food Service

```bash
# Vào thư mục food-service
cd src/backend/services/food-service

# Tạo file .env (thay YOUR_PASSWORD bằng mật khẩu MySQL)
cat > .env << EOF
DB_NAME=food_service_db
DB_USER=root
DB_PASSWORD=YOUR_PASSWORD
DB_HOST=localhost
DB_PORT=3306
PORT=3001
NODE_ENV=development
EOF
```

### Bước 3: Chạy Food Service

**Cách 1: Chạy với file .env (Khuyến nghị)**

```bash
cd src/backend/services/food-service
npm install  # Chỉ cần chạy lần đầu
npm start
```

**Cách 2: Chạy với biến môi trường trực tiếp**

```bash
cd src/backend/services/food-service
DB_PASSWORD="YOUR_PASSWORD" DB_NAME=food_service_db DB_USER=root DB_HOST=localhost DB_PORT=3306 PORT=3001 NODE_ENV=development node index.js
```

### Bước 4: Chạy API Gateway

Mở terminal mới (hoặc tách terminal trong VS Code):

```bash
cd src/backend/services/api-gateway
npm install  # Chỉ cần chạy lần đầu
npm start
```

## 🎯 Chạy Cả 2 Service Cùng Lúc

### Cách 1: Sử dụng 2 Terminal riêng biệt

**Terminal 1 - Food Service:**
```bash
cd src/backend/services/food-service
npm start
```

**Terminal 2 - API Gateway:**
```bash
cd src/backend/services/api-gateway
npm start
```

### Cách 2: Chạy Background (Linux/macOS)

**Terminal 1:**
```bash
cd src/backend/services/food-service
npm start &
```

**Terminal 2:**
```bash
cd src/backend/services/api-gateway
npm start &
```

### Cách 3: Sử dụng Script (Xem file start.sh)

```bash
chmod +x start.sh
./start.sh
```

## ✅ Kiểm Tra Services Đã Chạy

```bash
# Kiểm tra Food Service
curl http://localhost:3001/api/foods

# Kiểm tra API Gateway Health
curl http://localhost:3000/health

# Kiểm tra API Gateway proxy đến Food Service
curl http://localhost:3000/api/foods
```

## 🛑 Dừng Services

```bash
# Tìm và dừng process trên port 3001 (Food Service)
lsof -ti:3001 | xargs kill -9

# Tìm và dừng process trên port 3000 (API Gateway)
lsof -ti:3000 | xargs kill -9

# Hoặc dừng tất cả Node processes
pkill -f "node index.js"
```

## 📝 Lưu Ý

- **Port 3001**: Food Service
- **Port 3000**: API Gateway
- Đảm bảo MySQL đang chạy trước khi start services
- File `.env` không được commit lên git (đã có trong .gitignore)
- Database sẽ tự động tạo bảng khi service khởi động lần đầu

## 🔧 Troubleshooting

### Lỗi kết nối database
```bash
# Kiểm tra MySQL đang chạy
brew services list | grep mysql

# Kiểm tra database đã được tạo
mysql -u root -pYOUR_PASSWORD -e "SHOW DATABASES LIKE 'food_service_db';"
```

### Port đã được sử dụng
```bash
# Dừng process trên port 3001
lsof -ti:3001 | xargs kill -9

# Dừng process trên port 3000
lsof -ti:3000 | xargs kill -9
```
