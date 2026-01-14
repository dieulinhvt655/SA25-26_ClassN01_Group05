require('dotenv').config();
const express = require('express');
const foodRoutes = require('./routes/food.routes');
const categoryRoutes = require('./routes/category.routes');
const foodReviewRoutes = require('./routes/foodReview.routes');
const healthRoutes = require('./routes/health.routes');
const { sequelize, testConnection } = require('./config/database');
// Import models to register associations
require('./models/associations');
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/health', healthRoutes);
app.use('/api/foods', foodRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/food-reviews', foodReviewRoutes);

// 404 Handler - phải đặt sau tất cả routes
app.use(notFoundHandler);

// Error Handler - phải đặt cuối cùng
app.use(errorHandler);

// Khởi tạo database và chạy server
const startServer = async () => {
    try {
        // Test kết nối database
        await testConnection();
        
        // Đồng bộ model với database (tạo bảng nếu chưa có)
        await sequelize.sync({ alter: true });
        console.log('Database models đã được đồng bộ!');
        
        // Khởi động server
        const PORT = process.env.PORT || 3001;
        app.listen(PORT, () => {
            console.log('='.repeat(50));
            console.log('Food Service đã khởi động!');
            console.log(`URL: http://localhost:${PORT}`);
            console.log(`Health Check: http://localhost:${PORT}/health`);
            console.log(`Readiness Check: http://localhost:${PORT}/ready`);
            console.log('='.repeat(50));
        });
    } catch (error) {
        console.error('Lỗi khởi động server:', error);
        process.exit(1);
    }
};

startServer();
