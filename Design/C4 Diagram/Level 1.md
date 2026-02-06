# C4 Diagram Level 1 - System Context Diagram

---

## 1. Tổng quan

System Context Diagram là cấp độ **thu nhỏ nhất** trong C4 Model. Nó cung cấp cái nhìn tổng quan về hệ thống trong bối cảnh rộng lớn hơn, tập trung vào:
- **Actors (Người dùng)**: Ai sử dụng hệ thống?
- **External Systems**: Hệ thống tích hợp với những hệ thống bên ngoài nào?
- **Relationships**: Các mối quan hệ và luồng dữ liệu giữa chúng

---

## 2. Actors (Người dùng)

| Actor | Vai trò | Tương tác với hệ thống |
|-------|---------|------------------------|
| **Customer** | Khách hàng đặt món | Duyệt menu, đặt đơn, thanh toán, theo dõi đơn hàng |
| **Restaurant Owner** | Chủ nhà hàng | Quản lý menu, nhận đơn, cập nhật trạng thái đơn |
| **Driver** | Tài xế giao hàng | Nhận assignment, cập nhật vị trí, xác nhận giao hàng |
| **Admin** | Quản trị viên | Quản lý users, restaurants, báo cáo, cấu hình hệ thống |

---

## 3. External Systems

| External System | Mô tả | Protocol |
|-----------------|-------|----------|
| **Payment Gateway** | VNPay - Xử lý thanh toán online | HTTPS/API |
| **Map Service** | Google Maps - Tính khoảng cách, định vị | HTTPS/API |
| **Push Notification** | Firebase Cloud Messaging - Gửi push notifications | HTTPS/API |
| **Email Service** | SMTP Server - Gửi email xác nhận, thông báo | SMTP |

---

## 4. Mermaid Diagram

```mermaid
flowchart TB
    %% ==================== ACTORS ====================
    subgraph Actors["Users"]
        Customer["<b>Customer</b><br/>Mobile App User<br/>Orders food online"]
        RestaurantOwner["<b>Restaurant Owner</b><br/>Web Dashboard User<br/>Manages menu & orders"]
        Driver["<b>Driver</b><br/>Mobile App User<br/>Delivers orders"]
        Admin["<b>Admin</b><br/>Web Dashboard User<br/>System management"]
    end

    %% ==================== MAIN SYSTEM ====================
    MainSystem["<b>Yummy Food Delivery System</b><br/>[Software System]"]

    %% ==================== EXTERNAL SYSTEMS ====================
    subgraph ExternalSystems["External Systems (3rd Party)"]
        PaymentGateway["<b>VNPay</b><br/>[Payment Gateway]<br/>Processes online payments"]
        MapService["<b>Google Maps</b><br/>[Map Service]<br/>Geolocation & routing"]
        PushService["<b>Firebase FCM</b><br/>[Push Notification]<br/>Mobile notifications"]
        EmailService["<b>SMTP Server</b><br/>[Email Service]<br/>Email notifications"]
    end

    %% ==================== RELATIONSHIPS ====================
    Customer -->|"Browse, Order,<br/>Track, Pay"| MainSystem
    RestaurantOwner -->|"Manage Menu,<br/>Accept Orders"| MainSystem
    Driver -->|"Accept Delivery,<br/>Update Status"| MainSystem
    Admin -->|"Manage System,<br/>View Reports"| MainSystem

    MainSystem -->|"Payment Request<br/>[HTTPS/API]"| PaymentGateway
    MainSystem -->|"Location Query<br/>[HTTPS/API]"| MapService
    MainSystem -->|"Push Message<br/>[HTTPS/API]"| PushService
    MainSystem -->|"Send Email<br/>[SMTP]"| EmailService

    PaymentGateway -.->|"Payment Result"| MainSystem
    MapService -.->|"Location Data"| MainSystem

    %% ==================== STYLING ====================
    style Actors fill:#e3f2fd,stroke:#1565c0,stroke-width:2px
    style ExternalSystems fill:#fff3e0,stroke:#ef6c00,stroke-width:2px

    classDef actor fill:#bbdefb,stroke:#1565c0,stroke-width:2px
    classDef system fill:#1565c0,stroke:#0d47a1,stroke-width:2px,color:#fff
    classDef external fill:#ffe0b2,stroke:#ef6c00,stroke-width:2px

    class Customer,RestaurantOwner,Driver,Admin actor
    class MainSystem system
    class PaymentGateway,MapService,PushService,EmailService external
```
---

## 5. Tóm tắt quan hệ

### 5.1. Actor → System

| Actor | Action | Description |
|-------|--------|-------------|
| Customer | Browses & Orders | Xem menu, đặt đơn, thanh toán, tracking |
| Restaurant Owner | Manages & Receives | Quản lý menu, nhận đơn, cập nhật trạng thái |
| Driver | Delivers | Nhận việc, cập nhật vị trí, xác nhận giao |
| Admin | Manages | Quản lý toàn bộ hệ thống |

### 5.2. System → External System

| Target | Protocol | Purpose |
|--------|----------|---------|
| Payment Gateway (VNPay) | HTTPS/REST | Xử lý thanh toán online |
| Map Service (Google Maps) | HTTPS/REST | Tính khoảng cách, định vị |
| Push Notification (FCM) | HTTPS/REST | Gửi thông báo đến app |
| Email Service (SMTP) | SMTP | Gửi email xác nhận |
