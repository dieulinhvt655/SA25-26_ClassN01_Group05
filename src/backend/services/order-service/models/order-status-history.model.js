/**
 * OrderStatusHistory Model
 */
class OrderStatusHistory {
    constructor(data = {}) {
        this.id = data.id || null;
        this.orderId = data.orderId || null;
        this.status = data.status || null;
        this.note = data.note || null;
        this.createdAt = data.createdAt || null;
    }

    toJSON() {
        return {
            id: this.id,
            orderId: this.orderId,
            status: this.status,
            note: this.note,
            createdAt: this.createdAt
        };
    }

    static fromDatabase(row) {
        if (!row) return null;
        return new OrderStatusHistory({
            id: row.id,
            orderId: row.order_id,
            status: row.status,
            note: row.note,
            createdAt: row.created_at
        });
    }
}

module.exports = OrderStatusHistory;
