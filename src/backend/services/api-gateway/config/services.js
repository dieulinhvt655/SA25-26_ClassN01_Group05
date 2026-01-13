// Cấu hình các microservices
module.exports = {
    services: {
        food: {
            url: process.env.FOOD_SERVICE_URL || 'http://localhost:3001',
            prefix: '/api/foods'
        }
    },
    gateway: {
        port: process.env.GATEWAY_PORT || 3000,
        host: process.env.GATEWAY_HOST || 'localhost'
    }
};

