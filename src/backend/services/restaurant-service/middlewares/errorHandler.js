// Middleware xử lý lỗi chung cho toàn bộ ứng dụng
const errorHandler = (err, req, res, next) => {
    console.error('❌ Lỗi:', err.message);
    console.error('Stack:', err.stack);

    // Xử lý lỗi validation từ Sequelize
    if (err.name === 'SequelizeValidationError') {
        const errors = err.errors.map(e => e.message);
        return res.status(400).json({
            success: false,
            message: 'Validation error',
            errors
        });
    }

    // Xử lý lỗi unique constraint từ Sequelize
    if (err.name === 'SequelizeUniqueConstraintError') {
        return res.status(409).json({
            success: false,
            message: 'Dữ liệu đã tồn tại',
            errors: err.errors.map(e => e.message)
        });
    }

    // Xử lý lỗi foreign key constraint
    if (err.name === 'SequelizeForeignKeyConstraintError') {
        return res.status(400).json({
            success: false,
            message: 'Dữ liệu liên kết không hợp lệ'
        });
    }

    // Lỗi mặc định
    res.status(err.statusCode || 500).json({
        success: false,
        message: err.message || 'Internal server error'
    });
};

module.exports = errorHandler;
