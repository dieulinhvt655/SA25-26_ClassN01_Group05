/**
 * ===========================================
 * USER SERVICE - ENTRY POINT
 * ===========================================
 * 
 * Đây là file khởi động chính của User Service.
 * Service này xử lý việc xác thực người dùng (Authentication):
 * - Đăng ký tài khoản
 * - Đăng nhập và cấp JWT token
 * 
 * Port: 3002 (cấu hình trong .env)
 * 
 * Cách chạy:
 * 1. npm install
 * 2. Cấu hình file .env (DB credentials, JWT secret)
 * 3. npm run dev
 */

require('dotenv').config();
const express = require('express');
const sequelize = require('./config/database');
const userRoutes = require('./routes/user.routes');

// Khởi tạo Express app
const app = express();

// Middleware để parse JSON body
app.use(express.json());

// Đăng ký routes
// Tất cả endpoints sẽ có prefix /api/auth
// Ví dụ: POST /api/auth/register, POST /api/auth/login
app.use('/api/auth', userRoutes);

// Route kiểm tra service đang chạy
app.get('/health', (req, res) => {
    res.json({
        service: 'user-service',
        status: 'running',
        time: new Date().toISOString()
    });
});

// Lấy port từ .env hoặc mặc định 3002
const PORT = process.env.PORT || 3002;

/**
 * KHỞI ĐỘNG SERVICE
 * 
 * Quy trình:
 * 1. Kiểm tra kết nối database
 * 2. Sync models (tạo bảng nếu chưa có)
 * 3. Khởi động HTTP server
 */
async function startServer() {
    try {
        // Bước 1: Kiểm tra kết nối MySQL
        await sequelize.authenticate();
        console.log('✅ Kết nối MySQL thành công!');

        // Bước 2: Sync models với database
        // alter: true sẽ cập nhật bảng nếu có thay đổi (development only)
        // Trong production, dùng migrations thay vì sync
        await sequelize.sync({ alter: true });
        console.log('✅ Đồng bộ database thành công!');

        // Bước 3: Khởi động server
        app.listen(PORT, () => {
            console.log('='.repeat(50));
            console.log(`🚀 USER SERVICE đang chạy tại port ${PORT}`);
            console.log('='.repeat(50));
            console.log('📌 Endpoints:');
            console.log(`   POST http://localhost:${PORT}/api/auth/register`);
            console.log(`   POST http://localhost:${PORT}/api/auth/login`);
            console.log(`   GET  http://localhost:${PORT}/api/auth/me (cần token)`);
            console.log(`   GET  http://localhost:${PORT}/health`);
            console.log('='.repeat(50));
        });

    } catch (error) {
        console.error('❌ Không thể khởi động service:', error.message);
        console.error('💡 Kiểm tra lại file .env và đảm bảo MySQL đang chạy.');
        process.exit(1);
    }
}

// Chạy server
startServer();
