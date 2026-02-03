/**
 * Notification Service - Entry Point
 * 
 * File này chịu trách nhiệm:
 * - Khởi tạo Express application
 * - Kết nối MySQL database
 * - Kết nối RabbitMQ và bắt đầu consume events
 * - Setup middleware và routes
 * 
 * KIẾN TRÚC EVENT-DRIVEN:
 * 
 * Service này hoạt động theo mô hình event-driven với RabbitMQ:
 * 
 *   ┌─────────────────┐     publish      ┌──────────────────┐
 *   │  Order Service  │ ───────────────> │                  │
 *   └─────────────────┘                  │                  │
 *                                        │    RabbitMQ      │
 *   ┌─────────────────┐     publish      │    Exchange      │
 *   │ Payment Service │ ───────────────> │                  │
 *   └─────────────────┘                  │                  │
 *                                        └────────┬─────────┘
 *                                                 │ route
 *                                                 ▼
 *                                        ┌──────────────────┐
 *                                        │ Notification     │
 *                                        │ Queue            │
 *                                        └────────┬─────────┘
 *                                                 │ consume
 *                                                 ▼
 *                                        ┌──────────────────┐
 *                                        │ Notification     │
 *                                        │ Service          │
 *                                        │ (Consumer)       │
 *                                        └────────┬─────────┘
 *                                                 │
 *                           ┌─────────────────────┼─────────────────────┐
 *                           ▼                     ▼                     ▼
 *                    ┌────────────┐        ┌────────────┐        ┌────────────┐
 *                    │   MySQL    │        │  Firebase  │        │   Email    │
 *                    │ (Storage)  │        │  (Push)    │        │  (SMTP)    │
 *                    └────────────┘        └────────────┘        └────────────┘
 * 
 * ƯU ĐIỂM CỦA EVENT-DRIVEN:
 * 1. Loose coupling - Services không phụ thuộc trực tiếp
 * 2. Reliability - Messages được persist trong queue
 * 3. Scalability - Dễ scale horizontally
 * 4. Async processing - Không block caller
 */

require('dotenv').config();

const express = require('express');
const { sequelize } = require('./models');
const rabbitmq = require('./config/rabbitmq');
const { startConsumer } = require('./consumers/notification.consumer');
const setupRoutes = require('./routes');

// Khởi tạo Express app
const app = express();
const PORT = process.env.PORT || 3005;

// ==========================================
// MIDDLEWARE
// ==========================================

// Parse JSON body
app.use(express.json());

// Parse URL-encoded body
app.use(express.urlencoded({ extended: true }));

// Logging middleware
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} | ${req.method} ${req.path}`);
    next();
});

// CORS headers
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    next();
});

// ==========================================
// ROUTES
// ==========================================

setupRoutes(app);

// Handle 404
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: `Không tìm thấy route: ${req.method} ${req.path}`
    });
});

// Error handler
app.use((err, req, res, next) => {
    console.error('❌ Unhandled error:', err.message);
    res.status(500).json({
        success: false,
        message: 'Internal server error'
    });
});

// ==========================================
// KHỞI ĐỘNG SERVER
// ==========================================

const startServer = async () => {
    try {
        // 1. Kết nối MySQL database
        console.log('🔄 Đang kết nối MySQL...');
        await sequelize.authenticate();
        console.log('✅ Kết nối MySQL thành công!');

        // Đồng bộ models (tạo bảng nếu chưa có)
        await sequelize.sync({ alter: true });
        console.log('✅ Database models đã được đồng bộ!');

        // 2. Kết nối RabbitMQ
        console.log('🔄 Đang kết nối RabbitMQ...');
        await rabbitmq.connect();

        // 3. Bắt đầu consume events từ RabbitMQ
        console.log('🔄 Đang khởi động event consumer...');
        await startConsumer();

        // 4. Khởi động HTTP server
        app.listen(PORT, () => {
            console.log('==========================================');
            console.log('🚀 Notification Service đang chạy!');
            console.log(`📍 HTTP API: http://localhost:${PORT}`);
            console.log(`🏥 Health check: http://localhost:${PORT}/health`);
            console.log('🎧 RabbitMQ Consumer: ACTIVE');
            console.log('==========================================');
            console.log('📡 Waiting for events from:');
            console.log('   - order.confirmed');
            console.log('   - order.delivered');
            console.log('   - payment.success');
            console.log('   - user.registered');
            console.log('==========================================\n');
        });

    } catch (error) {
        console.error('❌ Lỗi khởi động server:', error.message);
        process.exit(1);
    }
};

// Graceful shutdown
process.on('SIGINT', async () => {
    console.log('\n⚠️ Đang shutdown...');
    await rabbitmq.close();
    await sequelize.close();
    process.exit(0);
});

process.on('SIGTERM', async () => {
    console.log('\n⚠️ Đang shutdown...');
    await rabbitmq.close();
    await sequelize.close();
    process.exit(0);
});

startServer();
