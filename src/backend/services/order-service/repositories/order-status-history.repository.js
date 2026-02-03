/**
 * OrderStatusHistory Repository
 */
const db = require('../config/database');
const OrderStatusHistory = require('../models/order-status-history.model');

const run = (conn, sql, params) =>
    conn ? db.queryWithConnection(conn, sql, params) : db.query(sql, params);

async function create(historyData, conn = null) {
    const { orderId, status, note } = historyData;
    const sql = `
        INSERT INTO order_status_histories (order_id, status, note)
        VALUES (?, ?, ?)
    `;
    const result = await run(conn, sql, [orderId, status, note || null]);
    const id = result.insertId;

    const rows = await run(conn, 'SELECT * FROM order_status_histories WHERE id = ?', [id]);
    const row = Array.isArray(rows) ? rows[0] : rows;
    return row ? OrderStatusHistory.fromDatabase(row) : null;
}

async function findByOrderId(orderId) {
    const sql = `SELECT * FROM order_status_histories WHERE order_id = ? ORDER BY created_at DESC`;
    const rows = await db.query(sql, [orderId]);
    const list = Array.isArray(rows) ? rows : (rows ? [rows] : []);
    return list.map(row => OrderStatusHistory.fromDatabase(row));
}

module.exports = {
    create,
    findByOrderId
};
