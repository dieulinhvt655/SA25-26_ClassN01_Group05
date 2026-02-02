require('dotenv').config();
const mysql = require('mysql2/promise');

/**
 * Database configuration và connection pool
 */
const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'cart_service_db',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    charset: 'utf8mb4'
};

// Tạo connection pool
const pool = mysql.createPool(dbConfig);

/**
 * Test database connection
 */
async function testConnection() {
    try {
        const connection = await pool.getConnection();
        console.log('✅ Database connected successfully');
        connection.release();
        return true;
    } catch (error) {
        console.error('❌ Database connection failed:', error.message);
        return false;
    }
}

/**
 * Execute query với error handling
 */
async function query(sql, params = []) {
    try {
        const [results] = await pool.execute(sql, params);
        return results;
    } catch (error) {
        console.error('Database query error:', error);
        throw error;
    }
}

/**
 * Begin transaction
 */
async function beginTransaction() {
    const connection = await pool.getConnection();
    await connection.beginTransaction();
    return connection;
}

/**
 * Commit transaction
 */
async function commit(connection) {
    await connection.commit();
    connection.release();
}

/**
 * Rollback transaction
 */
async function rollback(connection) {
    await connection.rollback();
    connection.release();
}

/**
 * Close all connections
 */
async function close() {
    await pool.end();
}

module.exports = {
    pool,
    query,
    beginTransaction,
    commit,
    rollback,
    close,
    testConnection
};
