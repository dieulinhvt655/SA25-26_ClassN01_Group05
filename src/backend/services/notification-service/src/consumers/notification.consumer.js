/**
 * RabbitMQ Consumer cho Notification Service
 * 
 * File này chịu trách nhiệm:
 * - Lắng nghe messages từ RabbitMQ queue
 * - Parse và validate message payload
 * - Delegate xử lý sang NotificationService
 * 
 * TẠI SAO DÙNG EVENT-DRIVEN VỚI RABBITMQ?
 * 
 * 1. DECOUPLING (Tách rời):
 *    - Order Service, Payment Service không cần biết Notification Service tồn tại
 *    - Chúng chỉ publish events, không quan tâm ai sẽ consume
 * 
 * 2. RELIABILITY (Tin cậy):
 *    - Messages được persist trong queue
 *    - Nếu Notification Service down, messages không mất
 *    - Khi service recover, sẽ xử lý messages còn pending
 * 
 * 3. SCALABILITY (Mở rộng):
 *    - Có thể chạy nhiều instance của Notification Service
 *    - RabbitMQ tự động load balance messages giữa các consumers
 * 
 * 4. ASYNC PROCESSING:
 *    - Order Service không cần đợi notification được gửi
 *    - Tăng tốc độ response cho user
 * 
 * LUỒNG XỬ LÝ:
 * 1. Other services → Publish event → notification.exchange
 * 2. Exchange routes → notification.queue (based on routing key)
 * 3. Consumer receives message → parse → NotificationService.processEvent()
 * 4. Acknowledge message khi xử lý xong
 */

const { getChannel, QUEUE_NAME } = require('../config/rabbitmq');
const notificationService = require('../services/notification.service');

/**
 * Bắt đầu consume messages từ queue
 */
const startConsumer = async () => {
    const channel = getChannel();

    if (!channel) {
        console.error('❌ RabbitMQ channel chưa được khởi tạo');
        return;
    }

    console.log(`\n🎧 Đang lắng nghe messages từ queue: ${QUEUE_NAME}`);
    console.log('   Routing keys: order.*, payment.*, user.*');
    console.log('   Waiting for events...\n');

    // Prefetch 1 message tại một thời điểm (để đảm bảo fair dispatch)
    await channel.prefetch(1);

    // Consume messages từ queue
    channel.consume(QUEUE_NAME, async (message) => {
        if (!message) return;

        try {
            // Parse message content
            const content = message.content.toString();
            const routingKey = message.fields.routingKey;

            console.log(`\n📩 Received message:`);
            console.log(`   Routing key: ${routingKey}`);
            console.log(`   Content: ${content}`);

            // Parse JSON payload
            let eventData;
            try {
                eventData = JSON.parse(content);
            } catch (parseError) {
                console.error('❌ Invalid JSON payload:', parseError.message);
                // Reject message permanently (không requeue)
                channel.nack(message, false, false);
                return;
            }

            // Validate required fields
            if (!eventData.userId) {
                console.error('❌ Missing userId in event data');
                channel.nack(message, false, false);
                return;
            }

            // Xử lý event qua NotificationService
            await notificationService.processEvent(routingKey, eventData);

            // Acknowledge message - đã xử lý thành công
            channel.ack(message);
            console.log(`✅ Message processed and acknowledged`);

        } catch (error) {
            console.error('❌ Error processing message:', error.message);

            // Requeue message để retry sau (có thể là lỗi tạm thời)
            // Trong production nên có dead-letter queue để tránh infinite loop
            channel.nack(message, false, true);
        }
    });
};

module.exports = { startConsumer };
