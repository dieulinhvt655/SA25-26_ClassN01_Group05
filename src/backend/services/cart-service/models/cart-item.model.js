/**
 * CartItem Model - Chỉ chứa định nghĩa đối tượng, không có business logic
 * Business logic được xử lý ở Service layer
 */
class CartItem {
    constructor(data = {}) {
        this.cartItemId = data.cartItemId || null;
        this.cartId = data.cartId || null;
        this.foodId = data.foodId || null;
        this.foodName = data.foodName || null;
        this.foodImage = data.foodImage || null;
        this.unitPrice = data.unitPrice || 0;
        this.quantity = data.quantity || 0;
        this.totalPrice = data.totalPrice || 0; // unitPrice * quantity
        this.note = data.note || null;
        this.isAvailable = data.isAvailable !== undefined ? data.isAvailable : true;
        this.createdAt = data.createdAt || new Date().toISOString();
        this.updatedAt = data.updatedAt || new Date().toISOString();
    }

    /**
     * Convert model instance to plain object
     */
    toJSON() {
        return {
            cartItemId: this.cartItemId,
            cartId: this.cartId,
            foodId: this.foodId,
            foodName: this.foodName,
            foodImage: this.foodImage,
            unitPrice: this.unitPrice,
            quantity: this.quantity,
            totalPrice: this.totalPrice,
            note: this.note,
            isAvailable: this.isAvailable,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt
        };
    }

    /**
     * Create CartItem instance from database row
     */
    static fromDatabase(row) {
        return new CartItem({
            cartItemId: row.cartItemId || row.cart_item_id,
            cartId: row.cartId || row.cart_id,
            foodId: row.foodId || row.food_id,
            foodName: row.foodName || row.food_name,
            foodImage: row.foodImage || row.food_image,
            unitPrice: row.unitPrice || row.unit_price || 0,
            quantity: row.quantity || 0,
            totalPrice: row.totalPrice || row.total_price || 0,
            note: row.note,
            isAvailable: row.isAvailable !== undefined ? row.isAvailable : (row.is_available !== undefined ? row.is_available : true),
            createdAt: row.createdAt || row.created_at,
            updatedAt: row.updatedAt || row.updated_at
        });
    }
}

module.exports = CartItem;
