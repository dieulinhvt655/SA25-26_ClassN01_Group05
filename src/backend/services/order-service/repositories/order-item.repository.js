/**
 * Repository OrderItem: chỉ thao tác dữ liệu. Không chứa nghiệp vụ.
 */
const db = require('../config/database');
const OrderItem = require('../models/order-item.model');

const run = (conn, sql, params) =>
    conn ? db.queryWithConnection(conn, sql, params) : db.query(sql, params);

async function create(orderItem, conn = null) {
    const sql = `
        INSERT INTO order_items
        (order_id, food_id, food_name, food_image, unit_price, quantity, total_price, note)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const result = await run(conn, sql, [
        orderItem.orderId,
        orderItem.foodId,
        orderItem.foodName,
        orderItem.foodImage ?? null,
        orderItem.unitPrice,
        orderItem.quantity,
        orderItem.totalPrice,
        orderItem.note ?? null
    ]);
    const orderItemId = result.insertId;
    if (conn) {
        const [rows] = await conn.execute('SELECT * FROM order_items WHERE order_item_id = ?', [orderItemId]);
        return rows[0] ? OrderItem.fromDatabase(rows[0]) : null;
    }
    const rows = await db.query('SELECT * FROM order_items WHERE order_item_id = ?', [orderItemId]);
    const row = Array.isArray(rows) ? rows[0] : rows;
    return row ? OrderItem.fromDatabase(row) : null;
}

async function findByOrderId(orderId) {
    const sql = `SELECT * FROM order_items WHERE order_id = ? ORDER BY created_at ASC`;
    const rows = await db.query(sql, [orderId]);
    const list = Array.isArray(rows) ? rows : [rows];
    return list.map(row => OrderItem.fromDatabase(row));
}

module.exports = {
    create,
    findByOrderId
};
