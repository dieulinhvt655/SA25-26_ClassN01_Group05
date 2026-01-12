const { Sequelize } = require('sequelize');

// Cấu hình kết nối database
const sequelize = new Sequelize(
    process.env.DB_NAME || 'food_service_db',
    process.env.DB_USER || 'root',
    process.env.DB_PASSWORD || '27272727',
    {
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_PORT || 3306,
        dialect: 'mysql',
        logging: process.env.NODE_ENV === 'development' ? console.log : false,
        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000
        }
    }
);

// Test kết nối
const testConnection = async () => {
    try {
        await sequelize.authenticate();
        console.log('Kết nối database thành công!');
    } catch (error) {
        console.error('Không thể kết nối database:', error);
    }
};

module.exports = { sequelize, testConnection };

