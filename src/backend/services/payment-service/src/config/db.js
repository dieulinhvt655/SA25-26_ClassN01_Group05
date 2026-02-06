/**
 * Cấu hình kết nối MySQL Database
 * File này chịu trách nhiệm:
 * - Khởi tạo kết nối Sequelize với MySQL
 * - Cung cấp connection pool cho toàn bộ service
 * - Test kết nối database khi khởi động
 */

const { Sequelize } = require('sequelize');

// Tạo instance Sequelize với cấu hình từ environment variables
const sequelize = new Sequelize(
    process.env.DB_NAME || 'notification_service_db',
    process.env.DB_USER || 'root',
    process.env.DB_PASSWORD || '27272727',
    {
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_PORT || 3306,
        dialect: 'mysql',
        logging: process.env.NODE_ENV === 'development' ? console.log : false,
        pool: {
            max: 10,          // Số kết nối tối đa trong pool
            min: 0,           // Số kết nối tối thiểu
            acquire: 30000,   // Thời gian tối đa (ms) để lấy kết nối
            idle: 10000       // Thời gian kết nối idle trước khi đóng
        },
        define: {
            timestamps: true,
            underscored: true,      // Sử dụng snake_case cho tên cột
            freezeTableName: true   // Không tự động đổi tên bảng
        }
    }
);

/**
 * Test kết nối đến database
 * @returns {Promise<boolean>} - true nếu kết nối thành công
 */
const testConnection = async () => {
    try {
        await sequelize.authenticate();
        console.log('Kết nối MySQL thành công!');
        return true;
    } catch (error) {
        console.error('Không thể kết nối MySQL:', error.message);
        return false;
    }
};

module.exports = { sequelize, testConnection };
