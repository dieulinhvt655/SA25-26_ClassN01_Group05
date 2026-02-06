/**
 * Payment Consumer
 * 
 * Lắng nghe events từ Order Service
 */

const { getChannel, QUEUE_NAME } = require('../config/rabbitmq');
const paymentService = require('../services/payment.service');

const startConsumer = async () => {
    const channel = getChannel();
    if (!channel) {
        console.error('RabbitMQ channel not ready');
        return;
    }

    console.log(`\n🎧 Payment Service listening on ${QUEUE_NAME}`);

    await channel.prefetch(1);

    channel.consume(QUEUE_NAME, async (message) => {
        if (!message) return;

        try {
            const content = JSON.parse(message.content.toString());
            const routingKey = message.fields.routingKey;

            console.log(`\n📩 Received: ${routingKey}`);

            if (routingKey === 'order.created') {
                await paymentService.processPaymentRequest(content);
            } else if (routingKey === 'order.cancelled') {
                // Handle refund logic if needed
                console.log('ℹ️ Order cancelled event received. Implementation pending.');
            }

            channel.ack(message);

        } catch (error) {
            console.error('Error processing message:', error.message);
            channel.nack(message, false, false); // No requeue for bad logic
        }
    });
};

module.exports = { startConsumer };
