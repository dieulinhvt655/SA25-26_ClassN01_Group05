/**
 * Order Model - Chỉ chứa định nghĩa đối tượng, không có business logic
 */
class Order {
    constructor(data = {}) {
        this.orderId = data.orderId || null;
        this.userId = data.userId || null;
        this.cartId = data.cartId || null;
        this.status = data.status || 'pending_payment'; // pending_payment, pending, confirmed, completed, cancelled
        this.totalAmount = data.totalAmount || 0;
        this.totalItems = data.totalItems || 0;
        this.createdAt = data.createdAt || new Date().toISOString();
        this.updatedAt = data.updatedAt || new Date().toISOString();
    }

    toJSON() {
        return {
            orderId: this.orderId,
            userId: this.userId,
            cartId: this.cartId,
            status: this.status,
            totalAmount: this.totalAmount,
            totalItems: this.totalItems,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt
        };
    }

    static fromDatabase(row) {
        return new Order({
            orderId: row.orderId || row.order_id,
            userId: row.userId || row.user_id,
            cartId: row.cartId || row.cart_id,
            status: row.status,
            totalAmount: row.totalAmount || row.total_amount || 0,
            totalItems: row.totalItems || row.total_items || 0,
            createdAt: row.createdAt || row.created_at,
            updatedAt: row.updatedAt || row.updated_at
        });
    }
}

module.exports = Order;
