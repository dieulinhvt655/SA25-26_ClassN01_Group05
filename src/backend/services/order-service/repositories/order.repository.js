/**
 * Repository Order: chỉ thao tác dữ liệu. Không chứa nghiệp vụ.
 */
const db = require('../config/database');
const Order = require('../models/order.model');

const run = (conn, sql, params) =>
    conn ? db.queryWithConnection(conn, sql, params) : db.query(sql, params);

async function create(userId, cartId, status = 'pending_payment', totalAmount = 0, totalItems = 0, conn = null) {
    const sql = `
        INSERT INTO orders (user_id, cart_id, status, total_amount, total_items)
        VALUES (?, ?, ?, ?, ?)
    `;
    const result = await run(conn, sql, [userId, cartId, status, totalAmount, totalItems]);
    const orderId = result.insertId;
    if (conn) {
        const [rows] = await conn.execute('SELECT * FROM orders WHERE order_id = ?', [orderId]);
        return Order.fromDatabase(rows[0]);
    }
    return findById(orderId);
}

async function findById(orderId) {
    const sql = `SELECT * FROM orders WHERE order_id = ?`;
    const rows = await db.query(sql, [orderId]);
    const row = Array.isArray(rows) ? rows[0] : rows;
    if (!row) return null;
    return Order.fromDatabase(row);
}

async function findByUserId(userId, limit = 50, status = null) {
    let sql = `SELECT * FROM orders WHERE user_id = ?`;
    const params = [userId];
    if (status) {
        sql += ` AND status = ?`;
        params.push(status);
    }
    sql += ` ORDER BY created_at DESC LIMIT ?`;
    params.push(limit);
    const rows = await db.query(sql, params);
    const list = Array.isArray(rows) ? rows : [rows];
    return list.map(row => Order.fromDatabase(row));
}

async function updateStatus(orderId, status) {
    const sql = `UPDATE orders SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE order_id = ?`;
    await db.query(sql, [status, orderId]);
    return findById(orderId);
}

module.exports = {
    create,
    findById,
    findByUserId,
    updateStatus
};
