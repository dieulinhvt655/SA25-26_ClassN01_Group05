/**
 * ===========================================
 * CẤU HÌNH KẾT NỐI DATABASE - SEQUELIZE
 * ===========================================
 * 
 * File này cấu hình kết nối đến MySQL database sử dụng Sequelize ORM.
 * Sequelize giúp ta tương tác với database thông qua JavaScript objects
 * thay vì viết raw SQL queries.
 */

const { Sequelize } = require('sequelize');
require('dotenv').config();

// Khởi tạo kết nối Sequelize với MySQL
// Các thông số được lấy từ file .env để bảo mật
const sequelize = new Sequelize(
    process.env.DB_NAME,      // Tên database: yummy_db
    process.env.DB_USER,      // Username: root (hoặc user khác)
    process.env.DB_PASSWORD,  // Password của MySQL
    {
        host: process.env.DB_HOST,  // Địa chỉ server: localhost
        port: process.env.DB_PORT,  // Cổng MySQL: 3306
        dialect: 'mysql',           // Loại database: MySQL
        
        // Cấu hình logging - tắt log SQL trong production
        logging: console.log,
        
        // Cấu hình connection pool để tối ưu hiệu năng
        pool: {
            max: 5,      // Số kết nối tối đa
            min: 0,      // Số kết nối tối thiểu
            acquire: 30000,  // Thời gian chờ lấy connection (ms)
            idle: 10000      // Thời gian connection rảnh trước khi đóng (ms)
        }
    }
);

// Export sequelize instance để các file khác sử dụng
module.exports = sequelize;
