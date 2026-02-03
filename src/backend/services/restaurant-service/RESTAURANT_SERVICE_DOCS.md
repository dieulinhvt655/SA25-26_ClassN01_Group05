# Restaurant Service - Tài Liệu Chi Tiết

## Tổng quan

**Restaurant Service** là một microservice độc lập trong hệ thống Food Delivery Yummy App, chịu trách nhiệm quản lý toàn bộ thông tin liên quan đến nhà hàng và menu.

### Phạm vi chức năng

**Bao gồm:**
- Quản lý thông tin nhà hàng (CRUD)
- Quản lý danh mục menu (Menu Categories)
- Quản lý món ăn (Menu Items)
- Quản lý nhóm tùy chọn (Option Groups) - VD: Chọn size, Thêm topping
- Quản lý tùy chọn (Options) - VD: Size M, Size L, Thêm trân châu

---

## Database Schema

### ERD (Entity Relationship Diagram)

```
┌─────────────┐       ┌─────────────────┐       ┌─────────────┐
│ restaurants │ 1───N │ menu_categories │ 1───N │ menu_items  │
└─────────────┘       └─────────────────┘       └─────────────┘
                                                       │
                                                       │ 1
                                                       │
                                                       N
                                                ┌──────────────┐
                                                │ option_groups│
                                                └──────────────┘
                                                       │
                                                       │ 1
                                                       │
                                                       N
                                                  ┌─────────┐
                                                  │ options │
                                                  └─────────┘
```

### Chi tiết các bảng

#### 1. restaurants
| Cột | Kiểu dữ liệu | Mô tả |
|-----|--------------|-------|
| id | UUID | Khóa chính |
| name | VARCHAR(255) | Tên nhà hàng |
| description | TEXT | Mô tả |
| address | VARCHAR(500) | Địa chỉ |
| phone | VARCHAR(20) | Số điện thoại |
| image_url | VARCHAR(500) | URL hình ảnh |
| status | ENUM | OPEN, CLOSED, INACTIVE |
| open_time | TIME | Giờ mở cửa |
| close_time | TIME | Giờ đóng cửa |
| created_at | TIMESTAMP | Thời gian tạo |
| updated_at | TIMESTAMP | Thời gian cập nhật |

#### 2. menu_categories
| Cột | Kiểu dữ liệu | Mô tả |
|-----|--------------|-------|
| id | UUID | Khóa chính |
| restaurant_id | UUID | FK → restaurants |
| name | VARCHAR(255) | Tên danh mục |
| display_order | INT | Thứ tự hiển thị |
| is_active | BOOLEAN | Trạng thái kích hoạt |

#### 3. menu_items
| Cột | Kiểu dữ liệu | Mô tả |
|-----|--------------|-------|
| id | UUID | Khóa chính |
| category_id | UUID | FK → menu_categories |
| name | VARCHAR(255) | Tên món |
| description | TEXT | Mô tả |
| base_price | DECIMAL(10,2) | Giá cơ bản |
| image_url | VARCHAR(500) | URL hình ảnh |
| is_available | BOOLEAN | Còn hàng |

#### 4. option_groups
| Cột | Kiểu dữ liệu | Mô tả |
|-----|--------------|-------|
| id | UUID | Khóa chính |
| item_id | UUID | FK → menu_items |
| name | VARCHAR(255) | Tên nhóm (VD: Chọn size) |
| required | BOOLEAN | Bắt buộc chọn |
| min_select | INT | Số lượng tối thiểu |
| max_select | INT | Số lượng tối đa |

#### 5. options
| Cột | Kiểu dữ liệu | Mô tả |
|-----|--------------|-------|
| id | UUID | Khóa chính |
| option_group_id | UUID | FK → option_groups |
| name | VARCHAR(255) | Tên option (VD: Size L) |
| extra_price | DECIMAL(10,2) | Giá thêm |
| is_default | BOOLEAN | Option mặc định |

---

## API Endpoints

### Health Check

```http
GET /health
```

**Response:**
```json
{
  "success": true,
  "service": "restaurant-service",
  "status": "healthy",
  "timestamp": "2026-02-03T03:50:00.000Z"
}
```

---

### 🏪 Restaurants

#### Lấy danh sách nhà hàng
```http
GET /restaurants?page=1&limit=10&status=OPEN
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "11111111-1111-1111-1111-111111111111",
      "name": "Nhà hàng Phở Việt",
      "description": "Phở truyền thống Hà Nội",
      "address": "123 Đường Nguyễn Huệ, Q.1, TP.HCM",
      "phone": "0901234567",
      "imageUrl": null,
      "status": "OPEN",
      "openTime": "06:00:00",
      "closeTime": "22:00:00"
    }
  ],
  "pagination": {
    "total": 1,
    "page": 1,
    "limit": 10,
    "totalPages": 1
  }
}
```

#### Lấy chi tiết nhà hàng (với menu)
```http
GET /restaurants/:id?includeMenu=true
```

#### Tạo nhà hàng mới
```http
POST /restaurants
Content-Type: application/json

{
  "name": "Quán ABC",
  "description": "Mô tả quán",
  "address": "123 Đường XYZ",
  "phone": "0901234567",
  "status": "OPEN",
  "openTime": "08:00",
  "closeTime": "22:00"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Tạo nhà hàng thành công",
  "data": {
    "id": "uuid-generated",
    "name": "Quán ABC",
    ...
  }
}
```

#### Cập nhật nhà hàng
```http
PUT /restaurants/:id
```

#### Xóa nhà hàng
```http
DELETE /restaurants/:id
```

---

### Menu Categories

#### Lấy danh mục theo nhà hàng
```http
GET /restaurants/:restaurantId/categories
```

#### Tạo danh mục mới
```http
POST /restaurants/:restaurantId/categories

{
  "name": "Món chính",
  "displayOrder": 1,
  "isActive": true
}
```

#### Cập nhật danh mục
```http
PUT /categories/:id
```

#### Xóa danh mục
```http
DELETE /categories/:id
```

---

### Menu Items

#### Lấy món ăn theo danh mục
```http
GET /categories/:categoryId/items
```

#### Lấy chi tiết món ăn (với options)
```http
GET /items/:id
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "item1111-1111-1111-1111-111111111111",
    "name": "Phở Bò Tái",
    "description": "Phở với thịt bò tái chín",
    "basePrice": "55000.00",
    "isAvailable": true,
    "optionGroups": [
      {
        "id": "grp11111-1111-1111-1111-111111111111",
        "name": "Chọn size",
        "required": true,
        "minSelect": 1,
        "maxSelect": 1,
        "options": [
          {
            "id": "opt11111-1111-1111-1111-111111111111",
            "name": "Size nhỏ",
            "extraPrice": "0.00",
            "isDefault": true
          },
          {
            "id": "opt22222-2222-2222-2222-222222222222",
            "name": "Size lớn",
            "extraPrice": "15000.00",
            "isDefault": false
          }
        ]
      }
    ]
  }
}
```

#### Tạo món ăn mới
```http
POST /categories/:categoryId/items

{
  "name": "Phở Bò Tái",
  "description": "Phở với thịt bò tái chín",
  "basePrice": 55000,
  "isAvailable": true
}
```

---

### Option Groups

#### Lấy option groups của món ăn
```http
GET /items/:itemId/option-groups
```

#### Tạo option group
```http
POST /items/:itemId/option-groups

{
  "name": "Chọn size",
  "required": true,
  "minSelect": 1,
  "maxSelect": 1
}
```

---

### Options

#### Lấy options của group
```http
GET /option-groups/:groupId/options
```

#### Tạo option
```http
POST /option-groups/:groupId/options

{
  "name": "Size L",
  "extraPrice": 15000,
  "isDefault": false
}
```

---

## Hướng dẫn chạy locally

### Yêu cầu hệ thống
- Node.js >= 18.x
- MySQL >= 8.x

### Các bước thực hiện

1. **Cài đặt dependencies:**
```bash
cd src/backend/services/restaurant-service
npm install
```

2. **Cấu hình môi trường:**
```bash
cp .env.example .env
# Chỉnh sửa .env với thông tin database của bạn
```

3. **Tạo database:**
```bash
mysql -u root -p
> CREATE DATABASE restaurant_service_db;
> exit;
```

4. **Chạy service:**
```bash
npm run dev
```

5. **Test API:**
```bash
# Health check
curl http://localhost:3004/health

# Lấy danh sách nhà hàng
curl http://localhost:3004/restaurants

# Tạo nhà hàng mới
curl -X POST http://localhost:3004/restaurants \
  -H "Content-Type: application/json" \
  -d '{"name": "Test Restaurant", "address": "123 Test St"}'
```

---

## HTTP Status Codes

| Code | Ý nghĩa |
|------|---------|
| 200 | Thành công |
| 201 | Tạo mới thành công |
| 400 | Dữ liệu không hợp lệ |
| 404 | Không tìm thấy |
| 409 | Dữ liệu trùng lặp |
| 500 | Lỗi server |

---

## Lưu ý

- Service này chạy độc lập trên port **3004**
- Tất cả primary key sử dụng **UUID**
- Xóa cascade: xóa restaurant → xóa categories → xóa items → xóa option groups → xóa options

---

## Cấu trúc thư mục:
```
restaurant-service/
├── config/          # Cấu hình database
├── models/          # Định nghĩa entities + associations
├── repositories/    # Data access layer (CRUD operations)
├── services/        # Business logic layer
├── controllers/     # HTTP request handlers
├── routes/          # API routing
├── middlewares/     # Error handling, logging
└── migrations/      # Database schema
```

**Cấu hình môi trường (.env.example):**
```env
PORT=3004
DB_HOST=localhost
DB_PORT=3306
DB_NAME=restaurant_service_db
DB_USER=root
DB_PASSWORD=
```

---

### Khuyến nghị cải thiện

1. **API Versioning**: Thêm prefix `/api/v1` cho tất cả routes
2. **Event-driven**: Tích hợp message queue (Kafka/RabbitMQ) cho giao tiếp async với các service khác
3. **Rate Limiting**: Thêm middleware giới hạn request để bảo vệ API
4. **Logging**: Sử dụng thư viện logging chuyên nghiệp (Winston, Pino) thay vì console.log
