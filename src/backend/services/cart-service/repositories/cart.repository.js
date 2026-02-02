/**
 * Repository Cart: chỉ thao tác dữ liệu phục vụ nghiệp vụ tạo giỏ hàng.
 */
const db = require('../config/database');
const Cart = require('../models/cart.model');

async function create(userId, status = 'active') {
    const sql = `
        INSERT INTO carts (user_id, status, total_amount, total_items)
        VALUES (?, ?, 0, 0)
    `;
    const result = await db.query(sql, [userId, status]);
    return findById(result.insertId);
}

async function findById(cartId) {
    const sql = `SELECT * FROM carts WHERE cart_id = ?`;
    const rows = await db.query(sql, [cartId]);
    const row = Array.isArray(rows) ? rows[0] : rows;
    if (!row) return null;
    return Cart.fromDatabase(row);
}

async function findByUserId(userId, status = null) {
    let sql = `SELECT * FROM carts WHERE user_id = ?`;
    const params = [userId];
    if (status) {
        sql += ` AND status = ?`;
        params.push(status);
    }
    sql += ` ORDER BY created_at DESC LIMIT 1`;
    const rows = await db.query(sql, params);
    const row = Array.isArray(rows) ? rows[0] : rows;
    if (!row) return null;
    return Cart.fromDatabase(row);
}

async function findActiveCartByUserId(userId) {
    return findByUserId(userId, 'active');
}

/**
 * Cập nhật cart (total_amount, total_items). Chỉ thao tác dữ liệu.
 */
async function update(cart) {
    const sql = `
        UPDATE carts
        SET total_amount = ?, total_items = ?, updated_at = ?
        WHERE cart_id = ?
    `;
    await db.query(sql, [cart.totalAmount, cart.totalItems, new Date(), cart.cartId]);
    return findById(cart.cartId);
}

/**
 * Cập nhật status của cart. Chỉ thao tác dữ liệu.
 */
async function updateStatus(cartId, status) {
    const sql = `UPDATE carts SET status = ?, updated_at = ? WHERE cart_id = ?`;
    await db.query(sql, [status, new Date(), cartId]);
    return findById(cartId);
}

module.exports = {
    create,
    findById,
    findByUserId,
    findActiveCartByUserId,
    update,
    updateStatus
};
