const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

// Model MenuItem - món ăn trong menu
const MenuItem = sequelize.define('MenuItem', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        comment: 'ID duy nhất của món ăn (UUID)'
    },
    categoryId: {
        type: DataTypes.UUID,
        allowNull: false,
        field: 'category_id',
        comment: 'ID của danh mục chứa món ăn này'
    },
    name: {
        type: DataTypes.STRING(255),
        allowNull: false,
        validate: {
            notEmpty: { msg: 'Tên món ăn không được để trống' }
        },
        comment: 'Tên món ăn'
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: 'Mô tả chi tiết về món ăn'
    },
    basePrice: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        field: 'base_price',
        validate: {
            min: { args: [0], msg: 'Giá món ăn phải >= 0' }
        },
        comment: 'Giá cơ bản của món ăn'
    },
    imageUrl: {
        type: DataTypes.STRING(500),
        allowNull: true,
        field: 'image_url',
        comment: 'URL hình ảnh món ăn'
    },
    isAvailable: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        field: 'is_available',
        comment: 'Trạng thái có sẵn của món ăn'
    }
}, {
    tableName: 'menu_items',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

module.exports = MenuItem;
