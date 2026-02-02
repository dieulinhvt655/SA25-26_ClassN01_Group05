/**
 * ===========================================
 * DISCOVERY SERVICE - ENTRY POINT
 * ===========================================
 * 
 * Đây là file khởi động chính của Discovery Service.
 * Service này xử lý việc tìm kiếm food/restaurants.
 * 
 * GIAO TIẾP MICROSERVICES:
 * - Service này KHÔNG có database riêng cho Food
 * - Dữ liệu được lấy từ Food Service (port 3001) qua HTTP
 * - Đây là ví dụ về Inter-Service Communication
 * 
 * Port: 3003 (cấu hình trong .env)
 * 
 * Cách chạy:
 * 1. npm install
 * 2. Đảm bảo Food Service đang chạy (port 3001)
 * 3. npm run dev
 */

require('dotenv').config();
const express = require('express');
const searchRoutes = require('./routes/search.routes');

// Khởi tạo Express app
const app = express();

// Middleware để parse JSON body
app.use(express.json());

// Đăng ký routes
// Endpoint: GET /search
app.use('/', searchRoutes);

// Route kiểm tra service đang chạy
app.get('/health', (req, res) => {
    res.json({
        service: 'discovery-service',
        status: 'running',
        time: new Date().toISOString(),
        dependencies: {
            foodService: process.env.FOOD_SERVICE_URL
        }
    });
});

// Lấy port từ .env hoặc mặc định 3003
const PORT = process.env.PORT || 3003;

// Khởi động server
app.listen(PORT, () => {
    console.log('='.repeat(50));
    console.log(`🔍 DISCOVERY SERVICE đang chạy tại port ${PORT}`);
    console.log('='.repeat(50));
    console.log('📌 Endpoints:');
    console.log(`   GET http://localhost:${PORT}/search`);
    console.log(`   GET http://localhost:${PORT}/search?keyword=pizza`);
    console.log(`   GET http://localhost:${PORT}/search?minPrice=30000`);
    console.log(`   GET http://localhost:${PORT}/health`);
    console.log('='.repeat(50));
    console.log('📡 Kết nối đến Food Service:', process.env.FOOD_SERVICE_URL);
    console.log('='.repeat(50));
});
