require('dotenv').config();
const express = require('express');
const foodRoutes = require('./routes/food.routes');
const { sequelize, testConnection } = require('./config/database');
const Food = require('./models/food.sequelize');

const app = express();
app.use(express.json());

app.use('/api/foods', foodRoutes);

// Khởi tạo database và chạy server
const startServer = async () => {
    try {
        // Test kết nối database
        await testConnection();
        
        // Đồng bộ model với database (tạo bảng nếu chưa có)
        await sequelize.sync({ alter: true });
        console.log('Database models đã được đồng bộ!');
        
        // Khởi động server
        app.listen(3001, () => {
            console.log('Food Service running on port 3001');
        });
    } catch (error) {
        console.error('Lỗi khởi động server:', error);
        process.exit(1);
    }
};

startServer();
