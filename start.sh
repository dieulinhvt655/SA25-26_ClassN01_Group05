#!/bin/bash

# Script để chạy tất cả services của dự án
# Sử dụng: chmod +x start.sh && ./start.sh

echo "=========================================="
echo "  Khởi động Yummy Food Delivery Services"
echo "=========================================="
echo ""

# Màu sắc cho output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Kiểm tra MySQL
echo -e "${YELLOW}Kiểm tra MySQL...${NC}"
if ! mysql -u root -e "SELECT 1" > /dev/null 2>&1; then
    echo -e "${RED}❌ MySQL không thể kết nối. Vui lòng kiểm tra MySQL đang chạy và mật khẩu trong file .env${NC}"
    exit 1
fi
echo -e "${GREEN}✅ MySQL đang chạy${NC}"
echo ""

# Kiểm tra database
echo -e "${YELLOW}Kiểm tra database...${NC}"
if ! mysql -u root -e "USE food_service_db" > /dev/null 2>&1; then
    echo -e "${YELLOW}⚠️  Database chưa tồn tại, đang tạo...${NC}"
    mysql -u root -e "CREATE DATABASE IF NOT EXISTS food_service_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;" 2>/dev/null
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ Database đã được tạo${NC}"
    else
        echo -e "${RED}❌ Không thể tạo database. Vui lòng kiểm tra quyền MySQL${NC}"
        exit 1
    fi
else
    echo -e "${GREEN}✅ Database đã tồn tại${NC}"
fi
echo ""

# Kiểm tra file .env
FOOD_SERVICE_DIR="src/backend/services/food-service"
if [ ! -f "$FOOD_SERVICE_DIR/.env" ]; then
    echo -e "${YELLOW}⚠️  File .env chưa tồn tại${NC}"
    echo "Vui lòng tạo file .env trong $FOOD_SERVICE_DIR với nội dung:"
    echo ""
    echo "DB_NAME=food_service_db"
    echo "DB_USER=root"
    echo "DB_PASSWORD=your_mysql_password"
    echo "DB_HOST=localhost"
    echo "DB_PORT=3306"
    echo "PORT=3001"
    echo "NODE_ENV=development"
    echo ""
    read -p "Bạn có muốn tiếp tục chạy với biến môi trường mặc định không? (y/n): " -n 1 -r
    echo ""
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# Kiểm tra dependencies
echo -e "${YELLOW}Kiểm tra dependencies...${NC}"
if [ ! -d "$FOOD_SERVICE_DIR/node_modules" ]; then
    echo -e "${YELLOW}⚠️  Đang cài đặt dependencies cho Food Service...${NC}"
    cd "$FOOD_SERVICE_DIR" && npm install
    cd - > /dev/null
fi

if [ ! -d "src/backend/services/api-gateway/node_modules" ]; then
    echo -e "${YELLOW}⚠️  Đang cài đặt dependencies cho API Gateway...${NC}"
    cd src/backend/services/api-gateway && npm install
    cd - > /dev/null
fi
echo -e "${GREEN}✅ Dependencies đã sẵn sàng${NC}"
echo ""

# Kiểm tra port đang sử dụng
echo -e "${YELLOW}Kiểm tra ports...${NC}"
if lsof -ti:3001 > /dev/null 2>&1; then
    echo -e "${YELLOW}⚠️  Port 3001 đang được sử dụng. Đang dừng process...${NC}"
    lsof -ti:3001 | xargs kill -9 2>/dev/null
    sleep 2
fi

if lsof -ti:3000 > /dev/null 2>&1; then
    echo -e "${YELLOW}⚠️  Port 3000 đang được sử dụng. Đang dừng process...${NC}"
    lsof -ti:3000 | xargs kill -9 2>/dev/null
    sleep 2
fi
echo -e "${GREEN}✅ Ports sẵn sàng${NC}"
echo ""

# Khởi động Food Service
echo -e "${YELLOW}🚀 Khởi động Food Service (port 3001)...${NC}"
cd "$FOOD_SERVICE_DIR"
npm start > /tmp/food-service.log 2>&1 &
FOOD_PID=$!
cd - > /dev/null
sleep 3

# Kiểm tra Food Service đã chạy
if curl -s http://localhost:3001/api/foods > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Food Service đã khởi động thành công (PID: $FOOD_PID)${NC}"
else
    echo -e "${RED}❌ Food Service không thể khởi động. Kiểm tra log: /tmp/food-service.log${NC}"
    exit 1
fi
echo ""

# Khởi động API Gateway
echo -e "${YELLOW}🚀 Khởi động API Gateway (port 3000)...${NC}"
cd src/backend/services/api-gateway
npm start > /tmp/api-gateway.log 2>&1 &
GATEWAY_PID=$!
cd - > /dev/null
sleep 3

# Kiểm tra API Gateway đã chạy
if curl -s http://localhost:3000/health > /dev/null 2>&1; then
    echo -e "${GREEN}✅ API Gateway đã khởi động thành công (PID: $GATEWAY_PID)${NC}"
else
    echo -e "${RED}❌ API Gateway không thể khởi động. Kiểm tra log: /tmp/api-gateway.log${NC}"
    kill $FOOD_PID 2>/dev/null
    exit 1
fi
echo ""

echo "=========================================="
echo -e "${GREEN}✅ Tất cả services đã khởi động thành công!${NC}"
echo "=========================================="
echo ""
echo "📡 Endpoints:"
echo "  - Food Service:     http://localhost:3001/api/foods"
echo "  - API Gateway:      http://localhost:3000/api/foods"
echo "  - Health Check:     http://localhost:3000/health"
echo ""
echo "📝 Logs:"
echo "  - Food Service:     /tmp/food-service.log"
echo "  - API Gateway:      /tmp/api-gateway.log"
echo ""
echo "🛑 Để dừng services, chạy:"
echo "  kill $FOOD_PID $GATEWAY_PID"
echo "  hoặc: lsof -ti:3001,3000 | xargs kill -9"
echo ""
