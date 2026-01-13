require('dotenv').config();
const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors');
const servicesConfig = require('./config/services');
const logger = require('./middleware/logger');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(logger);

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({
        status: 'OK',
        service: 'API Gateway',
        timestamp: new Date().toISOString(),
        services: Object.keys(servicesConfig.services)
    });
});

// Tạo proxy cho từng service
Object.entries(servicesConfig.services).forEach(([serviceName, serviceConfig]) => {
    const { url, prefix } = serviceConfig;
    
    // Proxy middleware cho service này
    const proxy = createProxyMiddleware({
        target: url,
        changeOrigin: true,
        pathRewrite: {
            [`^${prefix}`]: prefix // Giữ nguyên path
        },
        onError: (err, req, res) => {
            console.error(`Error proxying to ${serviceName}:`, err.message);
            res.status(503).json({
                error: `${serviceName} service unavailable`,
                message: `Cannot connect to ${serviceName} service at ${url}`,
                timestamp: new Date().toISOString()
            });
        },
        onProxyReq: (proxyReq, req, res) => {
            console.log(`Proxying ${req.method} ${req.originalUrl} -> ${url}${req.originalUrl}`);
        },
        onProxyRes: (proxyRes, req, res) => {
            console.log(`Response from ${serviceName}: ${proxyRes.statusCode}`);
        }
    });

    // Áp dụng proxy cho route prefix
    app.use(prefix, proxy);
    
    console.log(`Route configured: ${prefix} -> ${url}`);
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        error: 'Not Found',
        message: `Route ${req.method} ${req.originalUrl} not found`,
        availableRoutes: Object.values(servicesConfig.services).map(s => s.prefix),
        timestamp: new Date().toISOString()
    });
});

// Error handler
app.use(errorHandler);

// Khởi động server
const PORT = servicesConfig.gateway.port;
const HOST = servicesConfig.gateway.host;

app.listen(PORT, HOST, () => {
    console.log('='.repeat(50));
    console.log('API Gateway đã khởi động!');
    console.log(`URL: http://${HOST}:${PORT}`);
    console.log('='.repeat(50));
    console.log('\n Các routes đã được cấu hình:');
    Object.entries(servicesConfig.services).forEach(([name, config]) => {
        console.log(`   ${config.prefix} -> ${config.url}`);
    });
    console.log('\n Health check: http://' + HOST + ':' + PORT + '/health');
    console.log('='.repeat(50));
});

