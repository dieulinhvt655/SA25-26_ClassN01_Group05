/**
 * Model: PaymentTransaction
 * 
 * Đại diện cho bảng 'payment_transactions' - Lịch sử giao dịch.
 */

const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const PaymentTransaction = sequelize.define('PaymentTransaction', {
        id: {
            type: DataTypes.BIGINT,
            autoIncrement: true,
            primaryKey: true
        },
        paymentId: {
            type: DataTypes.BIGINT,
            allowNull: false,
            field: 'payment_id'
        },
        statusFrom: {
            type: DataTypes.STRING,
            field: 'status_from'
        },
        statusTo: {
            type: DataTypes.STRING,
            field: 'status_to'
        },
        notes: {
            type: DataTypes.TEXT
        },
        createdAt: {
            type: DataTypes.DATE,
            field: 'created_at'
        }
    }, {
        tableName: 'payment_transactions',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: false // Chỉ có create time
    });

    return PaymentTransaction;
};
