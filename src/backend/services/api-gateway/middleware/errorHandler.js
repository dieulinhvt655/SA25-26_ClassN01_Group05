// Middleware xử lý lỗi
const errorHandler = (err, req, res, next) => {
    console.error('API Gateway Error:', {
        message: err.message,
        stack: err.stack,
        url: req.originalUrl,
        method: req.method,
        timestamp: new Date().toISOString()
    });

    // Nếu service không khả dụng
    if (err.code === 'ECONNREFUSED' || err.code === 'ETIMEDOUT') {
        return res.status(503).json({
            error: 'Service temporarily unavailable',
            message: 'The requested service is not available at the moment',
            timestamp: new Date().toISOString()
        });
    }

    // Lỗi khác
    res.status(err.status || 500).json({
        error: err.message || 'Internal Server Error',
        timestamp: new Date().toISOString()
    });
};

module.exports = errorHandler;

