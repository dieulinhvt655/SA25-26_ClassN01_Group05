/**
 * Utils - Event Publisher (Dùng cho testing)
 * 
 * File này dùng để test publish events đến RabbitMQ.
 * Chạy: node src/utils/testPublisher.js
 */

require('dotenv').config();
const amqp = require('amqplib');

const RABBITMQ_URL = process.env.RABBITMQ_URL || 'amqp://localhost:5672';
const EXCHANGE_NAME = 'notification.exchange';

// Sample events để test
const sampleEvents = [
    {
        routingKey: 'order.confirmed',
        payload: {
            userId: 'user-123',
            orderId: 'order-456',
            restaurantName: 'Nhà hàng Phở Việt',
            totalAmount: 150000,
            timestamp: new Date().toISOString()
        }
    },
    {
        routingKey: 'payment.success',
        payload: {
            userId: 'user-123',
            orderId: 'order-456',
            amount: 150000,
            paymentMethod: 'MOMO',
            timestamp: new Date().toISOString()
        }
    },
    {
        routingKey: 'order.cancelled',
        payload: {
            userId: 'user-123',
            orderId: 'order-456',
            reason: 'Nhà hàng hết món',
            timestamp: new Date().toISOString()
        }
    },
    {
        routingKey: 'order.driver_assigned',
        payload: {
            userId: 'user-123',
            orderId: 'order-456',
            driverName: 'Nguyen Van Tai',
            driverPlate: '29A-123.45',
            timestamp: new Date().toISOString()
        }
    },
    {
        routingKey: 'order.picked_up',
        payload: {
            userId: 'user-123',
            orderId: 'order-456',
            timestamp: new Date().toISOString()
        }
    },
    {
        routingKey: 'order.arrived',
        payload: {
            userId: 'user-123',
            orderId: 'order-456',
            timestamp: new Date().toISOString()
        }
    },
    {
        routingKey: 'order.delivered',
        payload: {
            userId: 'user-123',
            orderId: 'order-456',
            deliveryTime: new Date().toISOString(),
            timestamp: new Date().toISOString()
        }
    },
    {
        routingKey: 'promotion.new',
        payload: {
            userId: 'user-123',
            title: 'Giảm 50% cho Pizza',
            description: 'Giảm giá cực sốc hôm nay',
            code: 'PIZZA50',
            timestamp: new Date().toISOString()
        }
    },
    {
        routingKey: 'user.registered',
        payload: {
            userId: 'user-789',
            email: 'newuser@example.com',
            name: 'Nguyễn Văn A',
            timestamp: new Date().toISOString()
        }
    }
];

async function publishTestEvents() {
    try {
        console.log('🔄 Connecting to RabbitMQ...');
        const connection = await amqp.connect(RABBITMQ_URL);
        const channel = await connection.createChannel();

        // Đảm bảo exchange tồn tại
        await channel.assertExchange(EXCHANGE_NAME, 'topic', { durable: true });

        console.log('✅ Connected! Publishing test events...\n');

        for (const event of sampleEvents) {
            const message = JSON.stringify(event.payload);

            channel.publish(
                EXCHANGE_NAME,
                event.routingKey,
                Buffer.from(message)
            );

            console.log(`📤 Published: ${event.routingKey}`);
            console.log(`   Payload: ${message}\n`);

            // Chờ 1 giây giữa các events
            await new Promise(resolve => setTimeout(resolve, 1000));
        }

        console.log('✅ All test events published!');

        await channel.close();
        await connection.close();
        process.exit(0);

    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

// Chạy nếu file này được execute trực tiếp
if (require.main === module) {
    publishTestEvents();
}

module.exports = { publishTestEvents, sampleEvents };
