# 🗄️ Hướng Dẫn Sử Dụng Database Migrations

## 📋 Giới Thiệu

Migrations giúp bạn tạo cấu trúc database từ code, không cần import file SQL thủ công.

## 🚀 Cách Sử Dụng (Cho thành viên nhóm)

### Bước 1: Cài đặt dependencies
```bash
cd src/backend/services/user-service
npm install
```

### Bước 2: Cấu hình database
Mở file `config/config.json` và cập nhật password MySQL của bạn:
```json
{
  "development": {
    "username": "root",
    "password": "MẬT_KHẨU_MYSQL_CỦA_BẠN",
    "database": "yummy_db",
    ...
  }
}
```

### Bước 3: Tạo database (nếu chưa có)
```sql
CREATE DATABASE IF NOT EXISTS yummy_db;
```

### Bước 4: Chạy migrations (tạo bảng)
```bash
npm run db:migrate
```

### Bước 5: Chạy seeders (thêm dữ liệu mẫu)
```bash
npm run db:seed
```

## 📜 Các Lệnh Có Sẵn

| Lệnh | Mô tả |
|------|-------|
| `npm run db:migrate` | Chạy tất cả migrations (tạo bảng) |
| `npm run db:migrate:undo` | Rollback migration gần nhất |
| `npm run db:migrate:undo:all` | Rollback tất cả migrations |
| `npm run db:seed` | Chạy tất cả seeders (thêm dữ liệu) |
| `npm run db:seed:undo` | Xóa dữ liệu từ seeders |
| `npm run db:reset` | Reset toàn bộ (undo + migrate + seed) |

## 👥 Dữ Liệu Mẫu

Sau khi chạy seeders, bạn sẽ có các tài khoản:

| Email | Password | Role |
|-------|----------|------|
| admin@yummy.com | 123456 | admin |
| customer1@gmail.com | 123456 | customer |
| customer2@gmail.com | 123456 | customer |
| restaurant@yummy.com | 123456 | restaurant_owner |

## 📁 Cấu Trúc Files

```
user-service/
├── config/
│   └── config.json       # Cấu hình database cho Sequelize CLI
├── migrations/
│   ├── 20260206000001-create-users.js
│   ├── 20260206000002-create-addresses.js
│   ├── 20260206000003-create-otps.js
│   └── 20260206000004-create-token-blacklist.js
├── seeders/
│   ├── 20260206000001-demo-users.js
│   └── 20260206000002-demo-addresses.js
└── .sequelizerc          # Config paths cho Sequelize CLI
```

## ⚠️ Lưu Ý

1. **Không commit file `config/config.json`** nếu chứa password thật
2. Chạy migrations **TRƯỚC** khi khởi động service
3. Nếu đã có bảng từ `sync()`, hãy xóa trước khi chạy migrations
