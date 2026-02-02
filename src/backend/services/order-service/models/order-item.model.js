/**
 * OrderItem Model - Chỉ chứa định nghĩa đối tượng, không có business logic
 */
class OrderItem {
    constructor(data = {}) {
        this.orderItemId = data.orderItemId || null;
        this.orderId = data.orderId || null;
        this.foodId = data.foodId || null;
        this.foodName = data.foodName || null;
        this.foodImage = data.foodImage || null;
        this.unitPrice = data.unitPrice || 0;
        this.quantity = data.quantity || 0;
        this.totalPrice = data.totalPrice || 0;
        this.note = data.note || null;
        this.createdAt = data.createdAt || new Date().toISOString();
        this.updatedAt = data.updatedAt || new Date().toISOString();
    }

    toJSON() {
        return {
            orderItemId: this.orderItemId,
            orderId: this.orderId,
            foodId: this.foodId,
            foodName: this.foodName,
            foodImage: this.foodImage,
            unitPrice: this.unitPrice,
            quantity: this.quantity,
            totalPrice: this.totalPrice,
            note: this.note,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt
        };
    }

    static fromDatabase(row) {
        return new OrderItem({
            orderItemId: row.orderItemId || row.order_item_id,
            orderId: row.orderId || row.order_id,
            foodId: row.foodId || row.food_id,
            foodName: row.foodName || row.food_name,
            foodImage: row.foodImage || row.food_image,
            unitPrice: row.unitPrice || row.unit_price || 0,
            quantity: row.quantity || 0,
            totalPrice: row.totalPrice || row.total_price || 0,
            note: row.note,
            createdAt: row.createdAt || row.created_at,
            updatedAt: row.updatedAt || row.updated_at
        });
    }
}

module.exports = OrderItem;
