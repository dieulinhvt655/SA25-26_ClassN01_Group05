const { Sequelize } = require('sequelize');

// Cấu hình kết nối database MySQL
const sequelize = new Sequelize(
    process.env.DB_NAME || 'restaurant_service_db',
    process.env.DB_USER || 'root',
    process.env.DB_PASSWORD || '27272727',
    {
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_PORT || 3306,
        dialect: 'mysql',
        logging: process.env.NODE_ENV === 'development' ? console.log : false,
        pool: {
            max: 10,          // Số kết nối tối đa trong pool
            min: 0,           // Số kết nối tối thiểu trong pool
            acquire: 30000,   // Thời gian tối đa (ms) để lấy kết nối
            idle: 10000       // Thời gian kết nối có thể ở trạng thái idle trước khi bị đóng
        },
        define: {
            timestamps: true,       // Tự động thêm createdAt, updatedAt
            underscored: true,      // Sử dụng snake_case cho tên cột
            freezeTableName: true   // Không đổi tên bảng thành số nhiều
        }
    }
);

// Hàm test kết nối database
const testConnection = async () => {
    try {
        await sequelize.authenticate();
        console.log('Kết nối database MySQL thành công!');
    } catch (error) {
        console.error('Không thể kết nối database:', error.message);
        throw error;
    }
};

module.exports = { sequelize, testConnection };
