/**
 * Utility functions cho cart calculations và validations
 */

/**
 * Tính tổng giá trị của cart từ danh sách items
 * @param {Array} items - Mảng các cart items
 * @returns {number} - Tổng giá trị của cart
 */
function calculateCartTotal(items) {
    if (!Array.isArray(items) || items.length === 0) {
        return 0;
    }
    return items.reduce((total, item) => {
        // Sử dụng totalPrice nếu có, nếu không tính từ unitPrice * quantity
        const itemTotal = item.totalPrice !== undefined 
            ? item.totalPrice 
            : calculateItemSubtotal(item.unitPrice || item.price, item.quantity);
        return total + itemTotal;
    }, 0);
}

/**
 * Tính subtotal của một item (price * quantity)
 * @param {number} price - Giá của item
 * @param {number} quantity - Số lượng item
 * @returns {number} - Subtotal của item
 */
function calculateItemSubtotal(price, quantity) {
    return price * quantity;
}

/**
 * Validate giá có hợp lệ không
 * @param {number} price - Giá cần validate
 * @returns {boolean} - True nếu hợp lệ
 */
function validatePrice(price) {
    return typeof price === 'number' && price >= 0 && !isNaN(price);
}

/**
 * Validate số lượng có hợp lệ không
 * @param {number} quantity - Số lượng cần validate
 * @returns {boolean} - True nếu hợp lệ
 */
function validateQuantity(quantity) {
    return typeof quantity === 'number' && quantity > 0 && Number.isInteger(quantity);
}

/**
 * Validate dữ liệu item trước khi thêm vào cart
 * @param {Object} itemData - Dữ liệu item {foodId, foodName, unitPrice, quantity}
 * @returns {Object} - {isValid: boolean, error: string}
 */
function validateItemData(itemData) {
    const { foodId, foodName, unitPrice, quantity } = itemData;

    if (!foodId) {
        return { isValid: false, error: 'FoodId is required' };
    }

    if (!foodName || typeof foodName !== 'string' || foodName.trim() === '') {
        return { isValid: false, error: 'FoodName is required and must be a non-empty string' };
    }

    const price = unitPrice !== undefined ? unitPrice : itemData.price;
    if (!validatePrice(price)) {
        return { isValid: false, error: 'UnitPrice must be a valid non-negative number' };
    }

    if (!validateQuantity(quantity)) {
        return { isValid: false, error: 'Quantity must be a positive integer' };
    }

    return { isValid: true, error: null };
}

/**
 * Format số tiền thành định dạng currency
 * @param {number} amount - Số tiền cần format
 * @param {string} currency - Mã tiền tệ (mặc định: 'VND')
 * @returns {string} - Chuỗi đã format
 */
function formatCurrency(amount, currency = 'VND') {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: currency
    }).format(amount);
}

module.exports = {
    calculateCartTotal,
    calculateItemSubtotal,
    validatePrice,
    validateQuantity,
    validateItemData,
    formatCurrency
};
