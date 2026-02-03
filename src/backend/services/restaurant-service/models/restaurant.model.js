const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

// Model Restaurant - thông tin nhà hàng
const Restaurant = sequelize.define('Restaurant', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        comment: 'ID duy nhất của nhà hàng (UUID)'
    },
    name: {
        type: DataTypes.STRING(255),
        allowNull: false,
        validate: {
            notEmpty: { msg: 'Tên nhà hàng không được để trống' }
        },
        comment: 'Tên nhà hàng'
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: 'Mô tả về nhà hàng'
    },
    address: {
        type: DataTypes.STRING(500),
        allowNull: true,
        comment: 'Địa chỉ nhà hàng'
    },
    phone: {
        type: DataTypes.STRING(20),
        allowNull: true,
        comment: 'Số điện thoại liên hệ'
    },
    imageUrl: {
        type: DataTypes.STRING(500),
        allowNull: true,
        field: 'image_url',
        comment: 'URL hình ảnh đại diện'
    },
    status: {
        type: DataTypes.ENUM('OPEN', 'CLOSED', 'INACTIVE'),
        defaultValue: 'OPEN',
        comment: 'Trạng thái hoạt động: OPEN (đang mở), CLOSED (đóng cửa), INACTIVE (ngừng hoạt động)'
    },
    openTime: {
        type: DataTypes.TIME,
        allowNull: true,
        field: 'open_time',
        comment: 'Giờ mở cửa'
    },
    closeTime: {
        type: DataTypes.TIME,
        allowNull: true,
        field: 'close_time',
        comment: 'Giờ đóng cửa'
    }
}, {
    tableName: 'restaurants',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

module.exports = Restaurant;
