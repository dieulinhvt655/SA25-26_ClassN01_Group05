/**
 * OrderItem Model
 */
class OrderItem {
    constructor(data = {}) {
        this.id = data.id || null;
        this.orderId = data.orderId || null;
        this.foodId = data.foodId || null;
        this.foodName = data.foodName || null;
        this.foodImage = data.foodImage || null;
        this.unitPrice = data.unitPrice || 0;
        this.quantity = data.quantity || 0;
        this.totalPrice = data.totalPrice || 0;
    }

    toJSON() {
        return {
            id: this.id,
            orderId: this.orderId,
            foodId: this.foodId,
            foodName: this.foodName,
            foodImage: this.foodImage,
            unitPrice: this.unitPrice,
            quantity: this.quantity,
            totalPrice: this.totalPrice
        };
    }

    static fromDatabase(row) {
        if (!row) return null;
        return new OrderItem({
            id: row.id,
            orderId: row.order_id,
            foodId: row.food_id,
            foodName: row.food_name,
            foodImage: row.food_image,
            unitPrice: parseFloat(row.unit_price) || 0,
            quantity: row.quantity || 0,
            totalPrice: parseFloat(row.total_price) || 0
        });
    }
}

module.exports = OrderItem;
