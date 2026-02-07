/**
 * Cấu hình kết nối RabbitMQ
 * 
 * File này chịu trách nhiệm:
 * - Khởi tạo kết nối đến RabbitMQ server
 * - Tạo exchange và queue cho notification events
 * - Bind queue với các routing keys cần thiết
 * 
 * KIẾN TRÚC EVENT-DRIVEN:
 * - Exchange: notification.exchange (type: topic)
 * - Queue: notification.queue
 * - Routing keys: order.*, payment.*, user.*
 * 
 * Các service khác (Order, Payment, User) sẽ publish events
 * vào exchange, và Notification Service sẽ consume từ queue.
 */

const amqp = require('amqplib');

// Biến lưu trữ connection và channel
let connection = null;
let channel = null;

// Cấu hình từ environment variables
const RABBITMQ_URL = process.env.RABBITMQ_URL || 'amqp://localhost:5672';
const EXCHANGE_NAME = process.env.RABBITMQ_EXCHANGE || 'notification.exchange';
const QUEUE_NAME = process.env.RABBITMQ_QUEUE || 'notification.queue';

// Các routing keys mà service này quan tâm
const ROUTING_KEYS = [
    'order.confirmed',      // Đơn hàng được xác nhận
    'order.delivered',      // Đơn hàng đã giao
    'payment.success',      // Thanh toán thành công
    'user.registered'       // Người dùng mới đăng ký
];

/**
 * Kết nối đến RabbitMQ server
 * @returns {Promise<{connection, channel}>}
 */
const connect = async () => {
    try {
        // Tạo connection đến RabbitMQ
        connection = await amqp.connect(RABBITMQ_URL);
        console.log('✅ Kết nối RabbitMQ thành công!');

        // Tạo channel để publish/consume messages
        channel = await connection.createChannel();

        // Tạo exchange kiểu topic (cho phép routing linh hoạt)
        await channel.assertExchange(EXCHANGE_NAME, 'topic', {
            durable: true  // Exchange tồn tại sau khi restart RabbitMQ
        });

        // Tạo queue cho notification service
        await channel.assertQueue(QUEUE_NAME, {
            durable: true  // Queue tồn tại sau khi restart
        });

        // Bind queue với các routing keys
        for (const routingKey of ROUTING_KEYS) {
            await channel.bindQueue(QUEUE_NAME, EXCHANGE_NAME, routingKey);
            console.log(`📌 Đã bind queue với routing key: ${routingKey}`);
        }

        console.log('RabbitMQ exchange và queue đã sẵn sàng!');

        // Xử lý khi connection bị đóng
        connection.on('close', () => {
            console.log('⚠️ RabbitMQ connection đã đóng');
        });

        connection.on('error', (err) => {
            console.error('RabbitMQ connection error:', err.message);
        });

        return { connection, channel };
    } catch (error) {
        console.error('Không thể kết nối RabbitMQ:', error.message);
        throw error;
    }
};

/**
 * Lấy channel hiện tại
 * @returns {Channel} - RabbitMQ channel
 */
const getChannel = () => channel;

/**
 * Lấy connection hiện tại
 * @returns {Connection} - RabbitMQ connection
 */
const getConnection = () => connection;

/**
 * Đóng kết nối RabbitMQ
 */
const close = async () => {
    try {
        if (channel) await channel.close();
        if (connection) await connection.close();
        console.log('Đã đóng kết nối RabbitMQ');
    } catch (error) {
        console.error('Lỗi khi đóng RabbitMQ:', error.message);
    }
};

module.exports = {
    connect,
    getChannel,
    getConnection,
    close,
    EXCHANGE_NAME,
    QUEUE_NAME,
    ROUTING_KEYS
};
