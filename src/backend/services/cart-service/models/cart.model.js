/**
 * Cart Model - Chỉ chứa định nghĩa đối tượng, không có business logic
 * Business logic được xử lý ở Service layer
 */
class Cart {
    constructor(data = {}) {
        this.cartId = data.cartId || null;
        this.userId = data.userId || null;
        this.status = data.status || 'active'; // active, checked_out, abandoned
        this.totalAmount = data.totalAmount || 0;
        this.totalItems = data.totalItems || 0;
        this.createdAt = data.createdAt || new Date().toISOString();
        this.updatedAt = data.updatedAt || new Date().toISOString();
    }

    /**
     * Convert model instance to plain object
     */
    toJSON() {
        return {
            cartId: this.cartId,
            userId: this.userId,
            status: this.status,
            totalAmount: this.totalAmount,
            totalItems: this.totalItems,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt
        };
    }

    /**
     * Create Cart instance from database row
     */
    static fromDatabase(row) {
        return new Cart({
            cartId: row.cartId || row.cart_id,
            userId: row.userId || row.user_id,
            status: row.status,
            totalAmount: row.totalAmount || row.total_amount || 0,
            totalItems: row.totalItems || row.total_items || 0,
            createdAt: row.createdAt || row.created_at,
            updatedAt: row.updatedAt || row.updated_at
        });
    }
}

module.exports = Cart;
