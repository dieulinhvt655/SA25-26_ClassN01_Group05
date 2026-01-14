const express = require('express');
const router = express.Router();
const { sequelize } = require('../config/database');

// Health check endpoint
router.get('/health', (req, res) => {
    res.json({
        status: 'OK',
        service: 'food-service',
        timestamp: new Date().toISOString()
    });
});

// Readiness check - checks if service is ready to accept traffic
router.get('/ready', async (req, res) => {
    try {
        // Test database connection
        await sequelize.authenticate();
        
        res.json({
            status: 'ready',
            service: 'food-service',
            database: 'connected',
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        res.status(503).json({
            status: 'not ready',
            service: 'food-service',
            database: 'disconnected',
            error: error.message,
            timestamp: new Date().toISOString()
        });
    }
});

// Liveness check - checks if service is alive
router.get('/live', (req, res) => {
    res.json({
        status: 'alive',
        service: 'food-service',
        timestamp: new Date().toISOString()
    });
});

module.exports = router;
