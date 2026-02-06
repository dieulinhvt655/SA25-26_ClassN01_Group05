/**
 * ===========================================
 * USER SERVICE - ENTRY POINT (ENHANCED)
 * ===========================================
 */

require('dotenv').config();
const express = require('express');
const sequelize = require('./config/database');
const userRoutes = require('./routes/user.routes');

// Import tất cả models để Sequelize sync
const User = require('./models/user.model');
const Address = require('./models/address.model');
const OTP = require('./models/otp.model');
const TokenBlacklist = require('./models/token-blacklist.model');

// Setup associations
User.hasMany(Address, { foreignKey: 'user_id', as: 'addresses' });
Address.belongsTo(User, { foreignKey: 'user_id' });

// Khởi tạo Express app
const app = express();

// Middleware
app.use(express.json());

// CORS
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    if (req.method === 'OPTIONS') return res.sendStatus(200);
    next();
});

// Routes
app.use('/api/auth', userRoutes);

// Health check
app.get('/health', (req, res) => {
    res.json({
        service: 'user-service',
        status: 'running',
        version: '2.0.0',
        features: ['auth', 'otp', 'profile', 'address', 'admin'],
        time: new Date().toISOString()
    });
});

const PORT = process.env.PORT || 3002;

async function startServer() {
    try {
        await sequelize.authenticate();
        console.log('✅ Kết nối MySQL thành công!');

        await sequelize.sync({ alter: true });
        console.log('✅ Đồng bộ database thành công!');

        app.listen(PORT, () => {
            console.log('='.repeat(50));
            console.log(`🚀 USER SERVICE v2.0 đang chạy tại port ${PORT}`);
            console.log('='.repeat(50));
            console.log('📌 Public Endpoints:');
            console.log(`   POST /api/auth/register`);
            console.log(`   POST /api/auth/verify-otp`);
            console.log(`   POST /api/auth/login`);
            console.log(`   POST /api/auth/forgot-password`);
            console.log(`   POST /api/auth/reset-password`);
            console.log('📌 Protected Endpoints:');
            console.log(`   GET  /api/auth/me`);
            console.log(`   PUT  /api/auth/profile`);
            console.log(`   POST /api/auth/logout`);
            console.log(`   GET  /api/auth/addresses`);
            console.log('📌 Admin Endpoints:');
            console.log(`   GET  /api/auth/admin/users`);
            console.log(`   GET  /api/auth/admin/stats`);
            console.log('='.repeat(50));
        });

    } catch (error) {
        console.error('❌ Không thể khởi động service:', error.message);
        process.exit(1);
    }
}

startServer();
