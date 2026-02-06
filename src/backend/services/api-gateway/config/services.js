// Cấu hình các microservices - toàn bộ dự án
module.exports = {
    services: {
        // Cart: giỏ hàng
        cart: {
            url: process.env.CART_SERVICE_URL || 'http://localhost:3002',
            prefix: '/api/carts'
        },
        // Order: đơn hàng
        order: {
            url: process.env.ORDER_SERVICE_URL || 'http://localhost:3003',
            prefix: '/api/orders'
        },
        // Restaurant: nhà hàng + menu (restaurant-service expose nhiều path gốc)
        restaurants: {
            url: process.env.RESTAURANT_SERVICE_URL || 'http://localhost:3004',
            prefix: '/restaurants'
        },
        items: {
            url: process.env.RESTAURANT_SERVICE_URL || 'http://localhost:3004',
            prefix: '/items'
        },
        categories: {
            url: process.env.RESTAURANT_SERVICE_URL || 'http://localhost:3004',
            prefix: '/categories'
        },
        optionGroups: {
            url: process.env.RESTAURANT_SERVICE_URL || 'http://localhost:3004',
            prefix: '/option-groups'
        },
        options: {
            url: process.env.RESTAURANT_SERVICE_URL || 'http://localhost:3004',
            prefix: '/options'
        },
        // Discovery: tìm kiếm (chạy với PORT=3006 để tránh trùng order)
        discovery: {
            url: process.env.DISCOVERY_SERVICE_URL || 'http://localhost:3006',
            prefix: '/search'
        },
        // User / Auth (chạy với PORT=3007 để tránh trùng cart)
        auth: {
            url: process.env.USER_SERVICE_URL || 'http://localhost:3007',
            prefix: '/api/auth'
        },
        // Notification (tùy chọn)
        notification: {
            url: process.env.NOTIFICATION_SERVICE_URL || 'http://localhost:3005',
            prefix: '/notifications'
        },
        deviceTokens: {
            url: process.env.NOTIFICATION_SERVICE_URL || 'http://localhost:3005',
            prefix: '/device-tokens'
        }
    },
    gateway: {
        port: process.env.GATEWAY_PORT || 3000,
        host: process.env.GATEWAY_HOST || 'localhost'
    }
};



