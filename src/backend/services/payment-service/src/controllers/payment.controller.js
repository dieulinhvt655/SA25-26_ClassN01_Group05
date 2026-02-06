/**
 * Payment Controller
 */
const paymentRepository = require('../repositories/payment.repository');
const paymentService = require('../services/payment.service');

class PaymentController {
    /**
     * GET /payments/:orderId
     */
    async getPaymentStatus(req, res) {
        try {
            const { orderId } = req.params;
            const payment = await paymentRepository.findByOrderId(orderId);

            if (!payment) {
                return res.status(404).json({
                    success: false,
                    message: 'Payment not found for this order'
                });
            }

            res.json({
                success: true,
                data: payment
            });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    /**
     * POST /payments/initiate
     */
    async initiatePayment(req, res) {
        try {
            // Manual initiate usually for testing or retry
            const result = await paymentService.processPaymentRequest(req.body);
            res.json({
                success: true,
                data: result
            });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
}

module.exports = new PaymentController();
