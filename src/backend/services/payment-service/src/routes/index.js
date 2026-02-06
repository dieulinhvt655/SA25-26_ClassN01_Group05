/**
 * Routes Index
 * 
 * Tập trung tất cả routes và setup cho Express app.
 * Bao gồm health check endpoint.
 */

const notificationRoutes = require('./notification.routes');
const deviceTokenRoutes = require('./deviceToken.routes');

const setupRoutes = (app) => {
    // Notification routes
    app.use('/notifications', notificationRoutes);

    // DeviceToken routes
    app.use('/device-tokens', deviceTokenRoutes);

    // Health check endpoint
    app.get('/health', (req, res) => {
        res.status(200).json({
            success: true,
            service: 'notification-service',
            status: 'healthy',
            timestamp: new Date().toISOString(),
            rabbitmq: 'connected'  // Sẽ được cập nhật động sau
        });
    });
};

module.exports = setupRoutes;
