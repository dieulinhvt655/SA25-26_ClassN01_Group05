require('dotenv').config();
const express = require('express');
const { sequelize } = require('./models');
const setupRoutes = require('./routes');
const errorHandler = require('./middlewares/errorHandler');

// Khởi tạo Express app
const app = express();
const PORT = process.env.PORT || 3004;

// ==========================================
// MIDDLEWARE
// ==========================================

// Parse JSON body
app.use(express.json());

// Parse URL-encoded body
app.use(express.urlencoded({ extended: true }));

// Logging middleware đơn giản
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} | ${req.method} ${req.path}`);
    next();
});

// CORS headers (cho development)
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    next();
});

// ==========================================
// ROUTES
// ==========================================

// Setup tất cả routes
setupRoutes(app);

// Error handler (phải đặt cuối cùng)
app.use(errorHandler);

// Handle 404
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: `Không tìm thấy route: ${req.method} ${req.path}`
    });
});

// ==========================================
// KHỞI ĐỘNG SERVER
// ==========================================

const startServer = async () => {
    try {
        // Test kết nối database
        await sequelize.authenticate();
        console.log('✅ Kết nối database MySQL thành công!');

        // Đồng bộ models với database (tạo bảng nếu chưa có)
        await sequelize.sync({ alter: true });
        console.log('✅ Database models đã được đồng bộ!');

        // Khởi động server
        app.listen(PORT, () => {
            console.log('==========================================');
            console.log(`🚀 Restaurant Service đang chạy!`);
            console.log(`📍 URL: http://localhost:${PORT}`);
            console.log(`🏥 Health check: http://localhost:${PORT}/health`);
            console.log('==========================================');
        });
    } catch (error) {
        console.error('❌ Lỗi khởi động server:', error.message);
        process.exit(1);
    }
};

startServer();
