vie# BÁO CÁO CƠ SỞ DỮ LIỆU PHÂN TÁN
## Phân hệ: Restaurant & Menu

---

## 1. Tổng quan

### 1.1. Mô tả phân hệ

Phân hệ **Restaurant & Menu** quản lý thông tin nhà hàng, danh mục menu, món ăn và các tùy chọn. Đây là một trong những microservice core của hệ thống Yummy Food Delivery.

### 1.2. Thông tin kỹ thuật

| Thông tin | Giá trị |
|-----------|---------|
| **Database Engine** | MySQL 8.x |
| **Character Set** | utf8mb4 |
| **Collation** | utf8mb4_unicode_ci |
| **Storage Engine** | InnoDB |
| **Database Name** | restaurant_service_db |
| **Port** | 3306 |

---

## 2. Mô hình dữ liệu

### 2.1. Entity Relationship Diagram (ERD)

```
┌──────────────────┐
│   restaurants    │
│──────────────────│
│ id (PK, UUID)    │
│ name             │
│ description      │
│ address          │
│ phone            │
│ image_url        │
│ status           │
│ open_time        │
│ close_time       │
│ created_at       │
│ updated_at       │
└────────┬─────────┘
         │ 1
         │
         │ N
┌────────▼─────────┐
│ menu_categories  │
│──────────────────│
│ id (PK, UUID)    │
│ restaurant_id(FK)│───► restaurants.id
│ name             │
│ display_order    │
│ is_active        │
│ created_at       │
│ updated_at       │
└────────┬─────────┘
         │ 1
         │
         │ N
┌────────▼─────────┐
│   menu_items     │
│──────────────────│
│ id (PK, UUID)    │
│ category_id (FK) │───► menu_categories.id
│ name             │
│ description      │
│ base_price       │
│ image_url        │
│ is_available     │
│ created_at       │
│ updated_at       │
└────────┬─────────┘
         │ 1
         │
         │ N
┌────────▼─────────┐
│  option_groups   │
│──────────────────│
│ id (PK, UUID)    │
│ item_id (FK)     │───► menu_items.id
│ name             │
│ required         │
│ min_select       │
│ max_select       │
│ created_at       │
│ updated_at       │
└────────┬─────────┘
         │ 1
         │
         │ N
┌────────▼─────────┐
│     options      │
│──────────────────│
│ id (PK, UUID)    │
│ option_group_id  │───► option_groups.id
│   (FK)           │
│ name             │
│ extra_price      │
│ is_default       │
│ created_at       │
│ updated_at       │
└──────────────────┘
```

### 2.2. Mối quan hệ giữa các bảng

| Bảng cha | Bảng con | Quan hệ | Ràng buộc |
|----------|----------|---------|-----------|
| restaurants | menu_categories | 1:N | ON DELETE CASCADE |
| menu_categories | menu_items | 1:N | ON DELETE CASCADE |
| menu_items | option_groups | 1:N | ON DELETE CASCADE |
| option_groups | options | 1:N | ON DELETE CASCADE |

---

## 3. Chi tiết các bảng

### 3.1. Bảng `restaurants`

**Mô tả**: Lưu trữ thông tin nhà hàng

| Cột | Kiểu dữ liệu | Ràng buộc | Mô tả |
|-----|--------------|-----------|-------|
| id | CHAR(36) | PRIMARY KEY, UUID | Mã nhà hàng |
| name | VARCHAR(255) | NOT NULL | Tên nhà hàng |
| description | TEXT | - | Mô tả |
| address | VARCHAR(500) | - | Địa chỉ |
| phone | VARCHAR(20) | - | Số điện thoại |
| image_url | VARCHAR(500) | - | URL hình ảnh |
| status | ENUM | DEFAULT 'OPEN' | OPEN, CLOSED, INACTIVE |
| open_time | TIME | - | Giờ mở cửa |
| close_time | TIME | - | Giờ đóng cửa |
| created_at | TIMESTAMP | DEFAULT CURRENT | Thời gian tạo |
| updated_at | TIMESTAMP | ON UPDATE CURRENT | Thời gian cập nhật |

**Indexes**:
- `idx_status` (status)
- `idx_created_at` (created_at)

---

### 3.2. Bảng `menu_categories`

**Mô tả**: Lưu trữ danh mục menu của nhà hàng

| Cột | Kiểu dữ liệu | Ràng buộc | Mô tả |
|-----|--------------|-----------|-------|
| id | CHAR(36) | PRIMARY KEY, UUID | Mã danh mục |
| restaurant_id | CHAR(36) | FOREIGN KEY | FK → restaurants.id |
| name | VARCHAR(255) | NOT NULL | Tên danh mục |
| display_order | INT | DEFAULT 0 | Thứ tự hiển thị |
| is_active | BOOLEAN | DEFAULT TRUE | Trạng thái hoạt động |
| created_at | TIMESTAMP | DEFAULT CURRENT | Thời gian tạo |
| updated_at | TIMESTAMP | ON UPDATE CURRENT | Thời gian cập nhật |

**Indexes**:
- `idx_restaurant_id` (restaurant_id)
- `idx_display_order` (display_order)

---

### 3.3. Bảng `menu_items`

**Mô tả**: Lưu trữ thông tin món ăn

| Cột | Kiểu dữ liệu | Ràng buộc | Mô tả |
|-----|--------------|-----------|-------|
| id | CHAR(36) | PRIMARY KEY, UUID | Mã món ăn |
| category_id | CHAR(36) | FOREIGN KEY | FK → menu_categories.id |
| name | VARCHAR(255) | NOT NULL | Tên món |
| description | TEXT | - | Mô tả món |
| base_price | DECIMAL(10,2) | NOT NULL, DEFAULT 0 | Giá gốc |
| image_url | VARCHAR(500) | - | URL hình ảnh |
| is_available | BOOLEAN | DEFAULT TRUE | Còn hàng? |
| created_at | TIMESTAMP | DEFAULT CURRENT | Thời gian tạo |
| updated_at | TIMESTAMP | ON UPDATE CURRENT | Thời gian cập nhật |

**Indexes**:
- `idx_category_id` (category_id)
- `idx_is_available` (is_available)

---

### 3.4. Bảng `option_groups`

**Mô tả**: Lưu trữ nhóm tùy chọn của món ăn

| Cột | Kiểu dữ liệu | Ràng buộc | Mô tả |
|-----|--------------|-----------|-------|
| id | CHAR(36) | PRIMARY KEY, UUID | Mã nhóm |
| item_id | CHAR(36) | FOREIGN KEY | FK → menu_items.id |
| name | VARCHAR(255) | NOT NULL | Tên nhóm (Size, Topping...) |
| required | BOOLEAN | DEFAULT FALSE | Bắt buộc chọn? |
| min_select | INT | DEFAULT 0 | Số lượng chọn tối thiểu |
| max_select | INT | DEFAULT 1 | Số lượng chọn tối đa |
| created_at | TIMESTAMP | DEFAULT CURRENT | Thời gian tạo |
| updated_at | TIMESTAMP | ON UPDATE CURRENT | Thời gian cập nhật |

**Indexes**:
- `idx_item_id` (item_id)

---

### 3.5. Bảng `options`

**Mô tả**: Lưu trữ các tùy chọn cụ thể

| Cột | Kiểu dữ liệu | Ràng buộc | Mô tả |
|-----|--------------|-----------|-------|
| id | CHAR(36) | PRIMARY KEY, UUID | Mã tùy chọn |
| option_group_id | CHAR(36) | FOREIGN KEY | FK → option_groups.id |
| name | VARCHAR(255) | NOT NULL | Tên tùy chọn |
| extra_price | DECIMAL(10,2) | DEFAULT 0 | Giá thêm |
| is_default | BOOLEAN | DEFAULT FALSE | Mặc định được chọn? |
| created_at | TIMESTAMP | DEFAULT CURRENT | Thời gian tạo |
| updated_at | TIMESTAMP | ON UPDATE CURRENT | Thời gian cập nhật |

**Indexes**:
- `idx_option_group_id` (option_group_id)

---

## 4. Chiến lược phân tán (Distributed Strategy)

### 4.1. Kiến trúc phân tán

```
                    ┌─────────────────────────┐
                    │      Load Balancer      │
                    └───────────┬─────────────┘
                                │
          ┌─────────────────────┼─────────────────────┐
          │                     │                     │
          ▼                     ▼                     ▼
┌─────────────────┐   ┌─────────────────┐   ┌─────────────────┐
│ Restaurant Svc  │   │ Restaurant Svc  │   │ Restaurant Svc  │
│   Instance 1    │   │   Instance 2    │   │   Instance 3    │
└────────┬────────┘   └────────┬────────┘   └────────┬────────┘
         │                     │                     │
         └─────────────────────┼─────────────────────┘
                               │
                    ┌──────────▼──────────┐
                    │   MySQL Primary     │
                    │  (Master - Write)   │
                    └──────────┬──────────┘
                               │ Replication
              ┌────────────────┼────────────────┐
              │                │                │
              ▼                ▼                ▼
    ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐
    │  MySQL Replica  │ │  MySQL Replica  │ │  MySQL Replica  │
    │   (Read Only)   │ │   (Read Only)   │ │   (Read Only)   │
    └─────────────────┘ └─────────────────┘ └─────────────────┘
```

### 4.2. Mô hình Replication

| Đặc điểm | Giá trị |
|----------|---------|
| **Mô hình** | Master-Slave (Primary-Replica) |
| **Write Node** | 1 Primary |
| **Read Nodes** | N Replicas |
| **Replication Type** | Asynchronous |
| **Failover** | Automatic (via MySQL Group Replication) |

### 4.3. Read/Write Splitting

| Operation | Node | Mô tả |
|-----------|------|-------|
| `INSERT` | Primary | Tạo restaurant, category, item, option |
| `UPDATE` | Primary | Cập nhật thông tin |
| `DELETE` | Primary | Xóa dữ liệu |
| `SELECT` (single) | Replica | Lấy chi tiết |
| `SELECT` (list) | Replica | Danh sách với pagination |

---

## 5. Chiến lược Sharding (Horizontal Partitioning)

### 5.1. Sharding Key

| Bảng | Sharding Key | Lý do |
|------|--------------|-------|
| restaurants | id (UUID) | Phân bố đều |
| menu_categories | restaurant_id | Cùng shard với restaurant |
| menu_items | category_id | Cascade từ category |
| option_groups | item_id | Cascade từ item |
| options | option_group_id | Cascade từ group |

### 5.2. Sharding Strategy

```
Shard 1: restaurants (a-f)*
├── menu_categories (of restaurants a-f)
├── menu_items (of categories above)
├── option_groups (of items above)
└── options (of groups above)

Shard 2: restaurants (g-m)*
├── menu_categories (of restaurants g-m)
├── menu_items (of categories above)
├── option_groups (of items above)
└── options (of groups above)

Shard 3: restaurants (n-z)*
├── menu_categories (of restaurants n-z)
├── menu_items (of categories above)
├── option_groups (of items above)
└── options (of groups above)

* Dựa trên ký tự đầu của UUID
```

---

## 6. Indexes và Tối ưu hóa

### 6.1. Danh sách Indexes

| Tên Index | Cột | Mục đích |
|-----------|-----|----------|
| `PRIMARY` (restaurants) | id | Định danh duy nhất nhà hàng |
| `idx_status` | status | Lọc nhà hàng theo trạng thái (OPEN/CLOSED) |
| `idx_created_at` | created_at | Sắp xếp nhà hàng theo thời gian tạo |
| `PRIMARY` (menu_categories) | id | Định danh duy nhất danh mục |
| `idx_restaurant_id` | restaurant_id | Tìm tất cả danh mục của một nhà hàng |
| `idx_display_order` | display_order | Sắp xếp danh mục theo thứ tự hiển thị |
| `PRIMARY` (menu_items) | id | Định danh duy nhất món ăn |
| `idx_category_id` | category_id | Tìm tất cả món ăn trong một danh mục |
| `idx_is_available` | is_available | Lọc những món còn hàng/hết hàng |
| `PRIMARY` (option_groups) | id | Định danh duy nhất nhóm tùy chọn |
| `idx_item_id` | item_id | Tìm tất cả nhóm tùy chọn của một món ăn |
| `PRIMARY` (options) | id | Định danh duy nhất tùy chọn |
| `idx_option_group_id` | option_group_id | Tìm tất cả tùy chọn trong một nhóm |

### 6.2. Query Optimization

| Query Pattern | Optimization |
|---------------|--------------|
| Get restaurant by ID | Primary key lookup - O(1) |
| List restaurants by status | Index on status - O(log n) |
| Get categories by restaurant | Index on restaurant_id - O(log n) |
| Get items by category | Index on category_id - O(log n) |
| Get available items | Index on is_available - O(log n) |

---

## 7. Consistency và CAP Theorem

### 7.1. CAP Analysis

| Property | Support | Notes |
|----------|---------|-------|
| **Consistency** | Eventual | Read replicas may lag behind |
| **Availability** | High | Multiple replicas |
| **Partition Tolerance** | Yes | Can operate during network splits |

### 7.2. Consistency Guarantees

| Scenario | Consistency Level |
|----------|------------------|
| Create restaurant | Strong (Primary) |
| Update menu item | Strong (Primary) |
| Read menu list | Eventual (Replica) |
| Read item details | Eventual (Replica) |

---

## 8. Backup và Recovery

### 8.1. Backup Strategy

| Type | Frequency | Retention |
|------|-----------|-----------|
| Full Backup | Daily | 30 days |
| Incremental | Hourly | 7 days |
| Binary Logs | Continuous | 3 days |

### 8.2. Recovery Point Objective (RPO)

- **RPO**: 1 hour (maximum data loss)
- **RTO**: 4 hours (recovery time)

---

## 9. Kết luận

Phân hệ Restaurant & Menu sử dụng mô hình cơ sở dữ liệu phân tán với các đặc điểm:

1. **Kiến trúc Master-Slave** cho read/write splitting
2. **Horizontal Sharding** theo restaurant_id
3. **Cascading FK** với ON DELETE CASCADE
4. **UUID Primary Keys** cho phân tán dễ dàng
5. **Indexes tối ưu** cho các query pattern phổ biến
6. **Eventual Consistency** cho high availability

---

*Báo cáo được tạo ngày: 04/02/2026*
