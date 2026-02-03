/**
 * PaymentInfo Model
 */
class PaymentInfo {
    constructor(data = {}) {
        this.id = data.id || null;
        this.orderId = data.orderId || null;
        this.paymentMethod = data.paymentMethod || null;
        this.transactionId = data.transactionId || null;
        this.amount = data.amount || 0;
        this.status = data.status || 'PENDING'; // PENDING, SUCCESS, FAILED, REFUNDED
        this.paidAt = data.paidAt || null;
    }

    toJSON() {
        return {
            id: this.id,
            orderId: this.orderId,
            paymentMethod: this.paymentMethod,
            transactionId: this.transactionId,
            amount: this.amount,
            status: this.status,
            paidAt: this.paidAt
        };
    }

    static fromDatabase(row) {
        if (!row) return null;
        return new PaymentInfo({
            id: row.id,
            orderId: row.order_id,
            paymentMethod: row.payment_method,
            transactionId: row.transaction_id,
            amount: parseFloat(row.amount) || 0,
            status: row.status,
            paidAt: row.paid_at
        });
    }
}

module.exports = PaymentInfo;
