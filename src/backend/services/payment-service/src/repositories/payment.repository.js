/**
 * Payment Repository
 * 
 * Chịu trách nhiệm tương tác trực tiếp với Database.
 */

const { Payment, PaymentTransaction } = require('../models');

class PaymentRepository {
    async create(data) {
        return await Payment.create(data);
    }

    async findByOrderId(orderId) {
        return await Payment.findOne({ where: { orderId } });
    }

    async findById(id) {
        return await Payment.findByPk(id, {
            include: [{ model: PaymentTransaction, as: 'transactions' }]
        });
    }

    async updateStatus(id, newStatus, transactionRef = null) {
        const payment = await Payment.findByPk(id);
        if (!payment) throw new Error('Payment not found');

        const oldStatus = payment.status;

        // Update payment
        payment.status = newStatus;
        if (transactionRef) payment.transactionRef = transactionRef;
        await payment.save();

        // Create history log
        await PaymentTransaction.create({
            paymentId: id,
            statusFrom: oldStatus,
            statusTo: newStatus,
            notes: `Status updated to ${newStatus}`
        });

        return payment;
    }

    async addTransactionHistory(paymentId, statusFrom, statusTo, notes) {
        return await PaymentTransaction.create({
            paymentId,
            statusFrom,
            statusTo,
            notes
        });
    }
}

module.exports = new PaymentRepository();
