# Discovery Service - Yummy Food Delivery

## Mô tả
Service xử lý tìm kiếm food/restaurants cho ứng dụng Yummy.

## Chức năng
- **Tìm kiếm** food theo keyword, category, giá

## Giao tiếp Microservices
Service này **KHÔNG** có database riêng cho Food.
Dữ liệu được lấy từ **Food Service** (port 3001) qua HTTP.

```
[Client] --> [Discovery Service:3003] --> HTTP --> [Food Service:3001]
```

## Cấu trúc thư mục
```
discovery-service/
├── index.js                 # Entry point (port 3003)
├── package.json             # Dependencies
├── .env                     # Cấu hình môi trường
├── controllers/
│   └── search.controller.js # Xử lý HTTP requests
├── services/
│   └── search.service.js    # Logic tìm kiếm + gọi Food Service
└── routes/
    └── search.routes.js     # Định nghĩa endpoints
```

## Cài đặt
```bash
# 1. Cài dependencies
npm install

# 2. Đảm bảo Food Service đang chạy (port 3001)
cd ../food-service
npm run dev

# 3. Chạy Discovery Service
cd ../discovery-service
npm run dev
```

## API Endpoints

### GET /search
Tìm kiếm food với các filter.

**Query Parameters:**
- `keyword` - Từ khóa tìm trong tên food
- `category` - Danh mục food  
- `minPrice` - Giá tối thiểu
- `maxPrice` - Giá tối đa

**Ví dụ:**
```bash
# Tìm theo keyword
GET /search?keyword=pizza

# Tìm theo giá
GET /search?minPrice=30000&maxPrice=100000

# Kết hợp nhiều filter
GET /search?keyword=burger&minPrice=50000
```

**Response:**
```json
{
  "message": "Tìm kiếm thành công",
  "count": 5,
  "filters": { "keyword": "pizza", "minPrice": null },
  "data": [...]
}
```
