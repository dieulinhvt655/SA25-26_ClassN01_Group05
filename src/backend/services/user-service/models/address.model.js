/**
 * ===========================================
 * ADDRESS MODEL - ĐỊA CHỈ GIAO HÀNG
 * ===========================================
 * 
 * Model lưu trữ địa chỉ giao hàng của người dùng.
 * Một user có thể có nhiều địa chỉ (1-N relationship).
 */

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Address = sequelize.define('Address', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },

    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'FK đến bảng users'
    },

    label: {
        type: DataTypes.STRING(50),
        allowNull: true,
        comment: 'Nhãn: Nhà, Công ty, etc.'
    },

    recipient_name: {
        type: DataTypes.STRING(255),
        allowNull: false,
        comment: 'Tên người nhận'
    },

    recipient_phone: {
        type: DataTypes.STRING(20),
        allowNull: false,
        comment: 'SĐT người nhận'
    },

    address_line: {
        type: DataTypes.STRING(255),
        allowNull: false,
        comment: 'Địa chỉ chi tiết (số nhà, đường)'
    },

    ward: {
        type: DataTypes.STRING(100),
        allowNull: true,
        comment: 'Phường/Xã'
    },

    district: {
        type: DataTypes.STRING(100),
        allowNull: true,
        comment: 'Quận/Huyện'
    },

    city: {
        type: DataTypes.STRING(100),
        allowNull: true,
        defaultValue: 'TP. Hồ Chí Minh',
        comment: 'Thành phố'
    },

    latitude: {
        type: DataTypes.DECIMAL(10, 8),
        allowNull: true,
        comment: 'Vĩ độ GPS'
    },

    longitude: {
        type: DataTypes.DECIMAL(11, 8),
        allowNull: true,
        comment: 'Kinh độ GPS'
    },

    is_default: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        comment: 'Địa chỉ mặc định'
    }
}, {
    tableName: 'addresses',
    timestamps: true,
    underscored: true,
    indexes: [
        { fields: ['user_id'] },
        { fields: ['user_id', 'is_default'] }
    ]
});

module.exports = Address;
