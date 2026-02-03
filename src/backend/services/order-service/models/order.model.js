/**
 * Order Model
 */
class Order {
    constructor(data = {}) {
        this.id = data.id || null;
        this.userId = data.userId || null;
        this.restaurantId = data.restaurantId || null;
        this.status = data.status || 'CREATED'; // CREATED, PAID, CONFIRMED, COMPLETED, CANCELLED
        this.totalPrice = data.totalPrice || 0;
        this.discountAmount = data.discountAmount || 0;
        this.finalPrice = data.finalPrice || 0;
        this.deliveryFee = data.deliveryFee || 0;
        this.deliveryAddress = data.deliveryAddress || null;
        this.paymentMethod = data.paymentMethod || null;
        this.paymentStatus = data.paymentStatus || 'PENDING';
        this.createdAt = data.createdAt || null;
        this.updatedAt = data.updatedAt || null;
    }

    toJSON() {
        return {
            id: this.id,
            userId: this.userId,
            restaurantId: this.restaurantId,
            status: this.status,
            totalPrice: this.totalPrice,
            discountAmount: this.discountAmount,
            finalPrice: this.finalPrice,
            deliveryFee: this.deliveryFee,
            deliveryAddress: this.deliveryAddress,
            paymentMethod: this.paymentMethod,
            paymentStatus: this.paymentStatus,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt
        };
    }

    static fromDatabase(row) {
        if (!row) return null;
        return new Order({
            id: row.id,
            userId: row.user_id,
            restaurantId: row.restaurant_id,
            status: row.status,
            totalPrice: parseFloat(row.total_price) || 0,
            discountAmount: parseFloat(row.discount_amount) || 0,
            finalPrice: parseFloat(row.final_price) || 0,
            deliveryFee: parseFloat(row.delivery_fee) || 0,
            deliveryAddress: row.delivery_address,
            paymentMethod: row.payment_method,
            paymentStatus: row.payment_status,
            createdAt: row.created_at,
            updatedAt: row.updated_at
        });
    }
}

module.exports = Order;
