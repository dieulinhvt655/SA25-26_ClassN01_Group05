/**
 * Order Repository
 */
const db = require('../config/database');
const Order = require('../models/order.model');

const run = (conn, sql, params) =>
    conn ? db.queryWithConnection(conn, sql, params) : db.query(sql, params);

async function create(orderData, conn = null) {
    const {
        userId, restaurantId, status, totalPrice, discountAmount,
        finalPrice, deliveryFee, deliveryAddress, paymentMethod, paymentStatus
    } = orderData;

    const sql = `
        INSERT INTO orders (
            user_id, restaurant_id, status, total_price, discount_amount,
            final_price, delivery_fee, delivery_address, payment_method, payment_status
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const result = await run(conn, sql, [
        userId, restaurantId, status || 'CREATED', totalPrice || 0, discountAmount || 0,
        finalPrice || 0, deliveryFee || 0, deliveryAddress, paymentMethod, paymentStatus || 'PENDING'
    ]);

    const id = result.insertId;
    if (conn) {
        const [rows] = await conn.execute('SELECT * FROM orders WHERE id = ?', [id]);
        return Order.fromDatabase(rows[0]);
    }
    return findById(id);
}

async function findById(id) {
    const sql = `SELECT * FROM orders WHERE id = ?`;
    const rows = await db.query(sql, [id]);
    const row = Array.isArray(rows) ? rows[0] : rows;
    if (!row) return null;
    return Order.fromDatabase(row);
}

async function findByUserId(userId = null, limit = 50, status = null) {
    let sql = `SELECT * FROM orders WHERE 1=1`;
    const params = [];

    if (userId) {
        sql += ` AND user_id = ?`;
        params.push(userId);
    }

    if (status) {
        sql += ` AND status = ?`;
        params.push(status);
    }

    sql += ` ORDER BY created_at DESC LIMIT ${Number(limit)}`;
    params.push(limit);
    const rows = await db.query(sql, params?.length>0?params:undefined);
    const list = Array.isArray(rows) ? rows : (rows ? [rows] : []);
    return list.map(row => Order.fromDatabase(row));
}

async function updateStatus(id, status, conn = null) {
    const sql = `UPDATE orders SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`;
    await run(conn, sql, [status, id]);
    return findById(id);
}

module.exports = {
    create,
    findById,
    findByUserId,
    updateStatus
};
