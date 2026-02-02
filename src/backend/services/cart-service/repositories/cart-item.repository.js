/**
 * Repository CartItem: chỉ thao tác dữ liệu (CRUD). Không chứa nghiệp vụ.
 */
const db = require('../config/database');
const CartItem = require('../models/cart-item.model');

async function create(cartItem) {
    const sql = `
        INSERT INTO cart_items
        (cart_id, food_id, food_name, food_image, unit_price, quantity, total_price, note, is_available)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const result = await db.query(sql, [
        cartItem.cartId,
        cartItem.foodId,
        cartItem.foodName,
        cartItem.foodImage ?? null,
        cartItem.unitPrice,
        cartItem.quantity,
        cartItem.totalPrice,
        cartItem.note ?? null,
        cartItem.isAvailable !== undefined ? cartItem.isAvailable : true
    ]);
    const insertId = result.insertId;
    const rows = await db.query('SELECT * FROM cart_items WHERE cart_item_id = ?', [insertId]);
    const row = Array.isArray(rows) ? rows[0] : rows;
    return row ? CartItem.fromDatabase(row) : null;
}

async function findByCartId(cartId) {
    const sql = `SELECT * FROM cart_items WHERE cart_id = ? ORDER BY created_at ASC`;
    const rows = await db.query(sql, [cartId]);
    const list = Array.isArray(rows) ? rows : [rows];
    return list.map(row => CartItem.fromDatabase(row));
}

async function findByCartIdAndFoodId(cartId, foodId) {
    const sql = `SELECT * FROM cart_items WHERE cart_id = ? AND food_id = ?`;
    const rows = await db.query(sql, [cartId, foodId]);
    const row = Array.isArray(rows) ? rows[0] : rows;
    if (!row) return null;
    return CartItem.fromDatabase(row);
}

async function updateQuantityAndTotalPrice(cartItemId, quantity, totalPrice) {
    const sql = `
        UPDATE cart_items
        SET quantity = ?, total_price = ?, updated_at = ?
        WHERE cart_item_id = ?
    `;
    await db.query(sql, [quantity, totalPrice, new Date(), cartItemId]);
    const rows = await db.query('SELECT * FROM cart_items WHERE cart_item_id = ?', [cartItemId]);
    const row = Array.isArray(rows) ? rows[0] : rows;
    return row ? CartItem.fromDatabase(row) : null;
}

async function deleteByCartIdAndFoodId(cartId, foodId) {
    const sql = `DELETE FROM cart_items WHERE cart_id = ? AND food_id = ?`;
    const result = await db.query(sql, [cartId, foodId]);
    return result.affectedRows > 0;
}

async function sumTotalPriceByCartId(cartId) {
    const sql = `SELECT COALESCE(SUM(total_price), 0) AS total FROM cart_items WHERE cart_id = ?`;
    const rows = await db.query(sql, [cartId]);
    const row = Array.isArray(rows) ? rows[0] : rows;
    return parseFloat(row?.total ?? 0);
}

async function countByCartId(cartId) {
    const sql = `SELECT COUNT(*) AS count FROM cart_items WHERE cart_id = ?`;
    const rows = await db.query(sql, [cartId]);
    const row = Array.isArray(rows) ? rows[0] : rows;
    return Number(row?.count ?? 0);
}

module.exports = {
    create,
    findByCartId,
    findByCartIdAndFoodId,
    updateQuantityAndTotalPrice,
    deleteByCartIdAndFoodId,
    sumTotalPriceByCartId,
    countByCartId
};
