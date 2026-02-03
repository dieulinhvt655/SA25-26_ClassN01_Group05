/**
 * PaymentInfo Repository
 */
const db = require('../config/database');
const PaymentInfo = require('../models/payment-info.model');

const run = (conn, sql, params) =>
    conn ? db.queryWithConnection(conn, sql, params) : db.query(sql, params);

async function create(paymentData, conn = null) {
    const { orderId, paymentMethod, transactionId, amount, status, paidAt } = paymentData;
    const sql = `
        INSERT INTO payment_infos (order_id, payment_method, transaction_id, amount, status, paid_at)
        VALUES (?, ?, ?, ?, ?, ?)
    `;
    const result = await run(conn, sql, [
        orderId,
        paymentMethod,
        transactionId || null,
        amount || 0,
        status || 'PENDING',
        paidAt || null
    ]);
    const id = result.insertId;

    const rows = await run(conn, 'SELECT * FROM payment_infos WHERE id = ?', [id]);
    const row = Array.isArray(rows) ? rows[0] : rows;
    return row ? PaymentInfo.fromDatabase(row) : null;
}

async function findByOrderId(orderId) {
    const sql = `SELECT * FROM payment_infos WHERE order_id = ?`;
    const rows = await db.query(sql, [orderId]);
    const row = Array.isArray(rows) ? rows[0] : rows;
    return row ? PaymentInfo.fromDatabase(row) : null;
}

async function updateStatus(id, status, transactionId = null, paidAt = null, conn = null) {
    let sql = `UPDATE payment_infos SET status = ?`;
    const params = [status];

    if (transactionId) {
        sql += `, transaction_id = ?`;
        params.push(transactionId);
    }
    if (paidAt) {
        sql += `, paid_at = ?`;
        params.push(paidAt);
    }

    sql += ` WHERE id = ?`;
    params.push(id);

    await run(conn, sql, params);
    const rows = await run(conn, 'SELECT * FROM payment_infos WHERE id = ?', [id]);
    const row = Array.isArray(rows) ? rows[0] : rows;
    return row ? PaymentInfo.fromDatabase(row) : null;
}

module.exports = {
    create,
    findByOrderId,
    updateStatus
};
