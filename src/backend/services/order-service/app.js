/**
 * Order Service - File main (entry point).
 * Chỉ cấu hình Express, gắn routes, middleware và khởi động server.
 * Không chứa nghiệp vụ hay xử lý dữ liệu.
 */
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const orderRoutes = require('./routes/order.routes');
const db = require('./config/database');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] ${req.method} ${req.originalUrl}`);
    next();
});

app.get('/health', async (req, res) => {
    const dbStatus = await db.testConnection();
    res.json({
        status: dbStatus ? 'OK' : 'ERROR',
        service: 'Order Service',
        database: dbStatus ? 'connected' : 'disconnected',
        timestamp: new Date().toISOString()
    });
});

// Gắn base path cho Order service: mọi route trong order.routes sẽ có prefix /api/orders
app.use('/api/orders', orderRoutes);

app.use((req, res) => {
    res.status(404).json({
        error: 'Not Found',
        message: `Route ${req.method} ${req.originalUrl} not found`,
        timestamp: new Date().toISOString()
    });
});

app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(err.status || 500).json({
        error: err.message || 'Internal Server Error',
        timestamp: new Date().toISOString()
    });
});

const PORT = process.env.PORT || 3003;
const HOST = process.env.HOST || 'localhost';

db.testConnection().then(connected => {
    if (!connected) {
        console.error('Warning: Database connection failed.');
    }
    app.listen(PORT, HOST, () => {
        console.log('='.repeat(50));
        console.log('Order Service đã khởi động!');
        console.log(`URL: http://${HOST}:${PORT}`);
        console.log(`Health: http://${HOST}:${PORT}/health`);
        console.log(`API: http://${HOST}:${PORT}/api/orders`);
        console.log('='.repeat(50));
    });
});

process.on('SIGINT', async () => {
    console.log('\nShutting down gracefully...');
    await db.close();
    process.exit(0);
});

module.exports = app;
