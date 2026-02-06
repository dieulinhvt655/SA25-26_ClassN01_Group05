/**
 * Utils - Payment Event Publisher (Dùng cho testing)
 * 
 * File này dùng để test publish events đến RabbitMQ giả lập Order Service.
 * Chạy: node src/utils/testPaymentPublisher.js
 */

require('dotenv').config();
const amqp = require('amqplib');

const RABBITMQ_URL = process.env.RABBITMQ_URL || 'amqp://localhost:5672';
const EXCHANGE_NAME = 'notification.exchange'; // Trong plan notification dùng exchange này. 
// Tuy nhiên Payment Service cũng cần listen từ một exchange. 
// Nếu Order Service dùng chung 1 exchange cho toàn hệ thống thì ok. 
// Giả sử dùng chung 'notification.exchange' cho đơn giản hoặc nên đổi tên thành 'yummy.exchange'.
// Trong code consumer tôi thấy dùng EXCHANGE_NAME từ config. 
// Hãy check file config/rabbitmq.js

async function publishTestEvents() {
    try {
        console.log('🔄 Connecting to RabbitMQ...');
        const connection = await amqp.connect(RABBITMQ_URL);
        const channel = await connection.createChannel();

        // Hardcode exchange name nếu config bên kia chưa đổi
        // Cần đảm bảo consumer lắng nghe đúng exchange
        const exchangeName = 'notification.exchange';

        await channel.assertExchange(exchangeName, 'topic', { durable: true });

        console.log('✅ Connected! Publishing test events...\n');

        const events = [
            {
                routingKey: 'order.created',
                payload: {
                    orderId: `ORD-${Date.now()}`,
                    userId: 'user-001',
                    totalAmount: 500000,
                    paymentMethod: 'COD'
                }
            },
            {
                routingKey: 'order.created',
                payload: {
                    orderId: `ORD-${Date.now()}-2`,
                    userId: 'user-002',
                    totalAmount: 120000,
                    paymentMethod: 'MOMO'
                }
            }
        ];

        for (const event of events) {
            const message = JSON.stringify(event.payload);

            channel.publish(
                exchangeName,
                event.routingKey,
                Buffer.from(message)
            );

            console.log(`📤 Published: ${event.routingKey}`); // Fixed log
            console.log(`   Payload: ${message}\n`);

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

publishTestEvents();
