const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

// Model MenuCategory - danh mục món ăn trong nhà hàng
const MenuCategory = sequelize.define('MenuCategory', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        comment: 'ID duy nhất của danh mục (UUID)'
    },
    restaurantId: {
        type: DataTypes.UUID,
        allowNull: false,
        field: 'restaurant_id',
        comment: 'ID của nhà hàng chứa danh mục này'
    },
    name: {
        type: DataTypes.STRING(255),
        allowNull: false,
        validate: {
            notEmpty: { msg: 'Tên danh mục không được để trống' }
        },
        comment: 'Tên danh mục (VD: Món khai vị, Món chính, Đồ uống)'
    },
    displayOrder: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        field: 'display_order',
        comment: 'Thứ tự hiển thị của danh mục'
    },
    isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        field: 'is_active',
        comment: 'Trạng thái kích hoạt của danh mục'
    }
}, {
    tableName: 'menu_categories',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

module.exports = MenuCategory;
