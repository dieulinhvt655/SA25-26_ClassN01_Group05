/**
 * OrderItem Repository
 */
const db = require('../config/database');
const OrderItem = require('../models/order-item.model');

const run = (conn, sql, params) =>
    conn ? db.queryWithConnection(conn, sql, params) : db.query(sql, params);

async function create(item, conn = null) {
    const sql = `
        INSERT INTO order_items
        (order_id, food_id, food_name, food_image, unit_price, quantity, total_price)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    const result = await run(conn, sql, [
        item.orderId,
        item.foodId,
        item.foodName,
        item.foodImage || null,
        item.unitPrice || 0,
        item.quantity || 0,
        item.totalPrice || 0
    ]);

    const id = result.insertId;
    if (conn) {
        const [rows] = await conn.execute('SELECT * FROM order_items WHERE id = ?', [id]);
        return rows[0] ? OrderItem.fromDatabase(rows[0]) : null;
    }
    const rows = await db.query('SELECT * FROM order_items WHERE id = ?', [id]);
    const row = Array.isArray(rows) ? rows[0] : rows;
    return row ? OrderItem.fromDatabase(row) : null;
}

async function findByOrderId(orderId) {
    const sql = `SELECT * FROM order_items WHERE order_id = ?`;
    const rows = await db.query(sql, [orderId]);
    const list = Array.isArray(rows) ? rows : (rows ? [rows] : []);
    return list.map(row => OrderItem.fromDatabase(row));
}

module.exports = {
    create,
    findByOrderId
};
