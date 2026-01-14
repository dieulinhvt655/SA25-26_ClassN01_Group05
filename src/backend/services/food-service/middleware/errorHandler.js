const { AppError } = require('../utils/errors');

// Global Error Handler Middleware
const errorHandler = (err, req, res, next) => {
    // Set default error
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    // Log error for debugging
    console.error('Error:', {
        message: err.message,
        stack: err.stack,
        statusCode: err.statusCode,
        path: req.path,
        method: req.method,
        timestamp: new Date().toISOString()
    });

    // Handle operational errors (known errors)
    if (err.isOperational) {
        return res.status(err.statusCode).json({
            error: {
                code: err.name || 'APP_ERROR',
                message: err.message,
                ...(err.details && { details: err.details }),
                statusCode: err.statusCode
            },
            timestamp: new Date().toISOString()
        });
    }

    // Handle programming errors (unknown errors)
    // Don't leak error details in production
    const isDevelopment = process.env.NODE_ENV === 'development';
    
    return res.status(500).json({
        error: {
            code: 'INTERNAL_SERVER_ERROR',
            message: isDevelopment ? err.message : 'Something went wrong',
            ...(isDevelopment && { stack: err.stack }),
            statusCode: 500
        },
        timestamp: new Date().toISOString()
    });
};

// Async error wrapper to catch errors in async route handlers
const asyncHandler = (fn) => {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};

// 404 Not Found Handler
const notFoundHandler = (req, res, next) => {
    const err = new AppError(`Route ${req.method} ${req.originalUrl} not found`, 404);
    next(err);
};

module.exports = {
    errorHandler,
    asyncHandler,
    notFoundHandler
};
