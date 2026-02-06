/**
 * Model: Payment
 * 
 * Đại diện cho bảng 'payments' trong database.
 */

const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const Payment = sequelize.define('Payment', {
        id: {
            type: DataTypes.BIGINT,
            autoIncrement: true,
            primaryKey: true
        },
        orderId: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            field: 'order_id'
        },
        userId: {
            type: DataTypes.STRING,
            allowNull: false,
            field: 'user_id'
        },
        amount: {
            type: DataTypes.DECIMAL(15, 2),
            allowNull: false
        },
        currency: {
            type: DataTypes.STRING,
            defaultValue: 'VND'
        },
        method: {
            type: DataTypes.ENUM('COD', 'MOMO', 'ZALOPAY', 'BANKING'),
            allowNull: false
        },
        status: {
            type: DataTypes.ENUM('PENDING', 'SUCCESS', 'FAILED', 'CANCELLED', 'EXPIRED'),
            defaultValue: 'PENDING'
        },
        transactionRef: {
            type: DataTypes.STRING,
            field: 'transaction_ref'
        },
        createdAt: {
            type: DataTypes.DATE,
            field: 'created_at'
        },
        updatedAt: {
            type: DataTypes.DATE,
            field: 'updated_at'
        }
    }, {
        tableName: 'payments',
        timestamps: true,
        updatedAt: 'updated_at',
        createdAt: 'created_at'
    });

    return Payment;
};
