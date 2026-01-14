# 🚀 Quick Start - Chạy Dự Án Nhanh

## ⚡ Cách Nhanh Nhất (Sử dụng Script)

```bash
# 1. Cấp quyền thực thi (chỉ cần làm 1 lần)
chmod +x start.sh

# 2. Chạy script
./start.sh
```

## 📝 Các Lệnh Cơ Bản

### 1. Setup Database (Chỉ cần làm 1 lần)

```bash
mysql -u root -p27272727 -e "CREATE DATABASE IF NOT EXISTS food_service_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
```

### 2. Tạo File .env cho Food Service (Chỉ cần làm 1 lần)

```bash
cd src/backend/services/food-service
cat > .env << EOF
DB_NAME=food_service_db
DB_USER=root
DB_PASSWORD=27272727
DB_HOST=localhost
DB_PORT=3306
PORT=3001
NODE_ENV=development
EOF
```

### 3. Chạy Food Service

```bash
cd src/backend/services/food-service
npm start
```

### 4. Chạy API Gateway (Terminal mới)

```bash
cd src/backend/services/api-gateway
npm start
```

## ✅ Test Services

```bash
# Test Food Service
curl http://localhost:3001/api/foods

# Test API Gateway
curl http://localhost:3000/health
curl http://localhost:3000/api/foods
```

## 🛑 Dừng Services

```bash
# Dừng tất cả
lsof -ti:3001,3000 | xargs kill -9

# Hoặc dừng từng port
lsof -ti:3001 | xargs kill -9  # Food Service
lsof -ti:3000 | xargs kill -9  # API Gateway
```

## 📚 Xem Chi Tiết

Xem file `RUN.md` để biết hướng dẫn đầy đủ.
