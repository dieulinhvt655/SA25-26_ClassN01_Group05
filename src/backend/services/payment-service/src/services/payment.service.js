/**
 * Payment Service
 * 
 * Chịu trách nhiệm:
 * - Xử lý logic thanh toán
 * - Tương tác với Payment Gateways (Mock)
 * - Publish events kết quả
 */

const paymentRepository = require('../repositories/payment.repository');
const { getChannel, QUEUE_NAME, EXCHANGE_NAME } = require('../config/rabbitmq');

class PaymentService {
    /**
     * Xử lý yêu cầu thanh toán từ Order Service
     */
    async processPaymentRequest(eventData) {
        console.log(`\n💳 Processing payment request for Order #${eventData.orderId}`);
        console.log(`   Amount: ${eventData.totalAmount}, Method: ${eventData.paymentMethod}`);

        try {
            // 1. Tạo payment record
            // Map method từ Order sang Payment ENUM nếu cần
            let method = eventData.paymentMethod ? eventData.paymentMethod.toUpperCase() : 'COD';
            if (method === 'CASH') method = 'COD';

            const payment = await paymentRepository.create({
                orderId: eventData.orderId,
                userId: eventData.userId,
                amount: eventData.totalAmount,
                method: method,
                status: 'PENDING'
            });

            // 2. Xử lý theo phương thức
            if (method === 'COD') {
                // COD thì coi như success bước đầu (chờ giao hàng thu tiền)
                // Tuy nhiên, logic thường là PENDING cho đến khi giao hàng
                // Nhưng ở đây ta set SUCCESS để Order Service tiếp tục flow (Ví dụ: Order Confirmed)
                // Hoặc giữ PENDING và User/Admin confirm sau.
                // Để đơn giản flow: COD -> PENDING -> (Shipper Delivered) -> SUCCESS
                // Nhưng Order Service cần biết là payment request đã được handle.

                // Giả lập: COD coi như OK để process đơn hàng
                // Ta có thể update status thành PENDING (mặc định) và gửi event payment.processed

                console.log('COD payment initialized. Waiting for delivery.');
                // Gửi event Payment Pending/Success tùy logic. 
                // Ở đây giả sử Order Service cần payment.success để confirm đơn hàng.
                // Với COD, "thanh toán" chưa diễn ra nhưng "cam kết thanh toán" đã có.
                // Ta sẽ gửi payment.success để flow tiếp tục.
                await this.completePayment(payment.id, 'SUCCESS', 'COD_PENDING');

            } else {
                // Online Payment (Momo, ZaloPay, ...)
                // Giả lập gọi Gateway
                console.log(` Initiating ${method} payment gateway...`);

                // Simulation: Delay 2s rồi random success/fail
                setTimeout(async () => {
                    const isSuccess = Math.random() > 0.1; // 90% success
                    if (isSuccess) {
                        const txnRef = `txn_${Date.now()}`;
                        await this.completePayment(payment.id, 'SUCCESS', txnRef);
                    } else {
                        await this.failPayment(payment.id, 'Insufficient funds (Simulated)');
                    }
                }, 2000);
            }

            return payment;

        } catch (error) {
            console.error('Error creating payment:', error.message);
            // Gửi event failed nếu không tạo được
            this._publishEvent('payment.failed', {
                orderId: eventData.orderId,
                reason: error.message
            });
            throw error;
        }
    }

    /**
     * Hoàn tất thanh toán
     */
    async completePayment(paymentId, status, transactionRef) {
        try {
            const payment = await paymentRepository.updateStatus(paymentId, status, transactionRef);
            console.log(`Payment ${status}: Order #${payment.orderId}`);

            // Gửi event
            this._publishEvent('payment.success', {
                orderId: payment.orderId,
                amount: payment.amount,
                method: payment.method,
                transactionRef: payment.transactionRef,
                timestamp: new Date()
            });

        } catch (error) {
            console.error('Error completing payment:', error.message);
        }
    }

    /**
     * Thanh toán thất bại
     */
    async failPayment(paymentId, reason) {
        try {
            const payment = await paymentRepository.updateStatus(paymentId, 'FAILED');
            // Log lý do vào history
            await paymentRepository.addTransactionHistory(paymentId, 'PENDING', 'FAILED', reason);

            console.log(` Payment FAILED: Order #${payment.orderId}, Reason: ${reason}`);

            // Gửi event
            this._publishEvent('payment.failed', {
                orderId: payment.orderId,
                reason: reason,
                timestamp: new Date()
            });

        } catch (error) {
            console.error('Error failing payment:', error.message);
        }
    }

    /**
     * Publish event to RabbitMQ
     */
    _publishEvent(routingKey, payload) {
        const channel = getChannel();
        if (!channel) {
            console.error(' RabbitMQ channel not available');
            return;
        }

        const message = JSON.stringify(payload);
        channel.publish(EXCHANGE_NAME, routingKey, Buffer.from(message));
        console.log(`Published: ${routingKey}`);
    }
}

module.exports = new PaymentService();
