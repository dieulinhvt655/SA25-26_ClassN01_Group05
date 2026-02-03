const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

// Model OptionGroup - nhóm tùy chọn của món ăn (VD: Size, Topping)
const OptionGroup = sequelize.define('OptionGroup', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        comment: 'ID duy nhất của nhóm tùy chọn (UUID)'
    },
    itemId: {
        type: DataTypes.UUID,
        allowNull: false,
        field: 'item_id',
        comment: 'ID của món ăn chứa nhóm tùy chọn này'
    },
    name: {
        type: DataTypes.STRING(255),
        allowNull: false,
        validate: {
            notEmpty: { msg: 'Tên nhóm tùy chọn không được để trống' }
        },
        comment: 'Tên nhóm tùy chọn (VD: Chọn size, Thêm topping)'
    },
    required: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        comment: 'Bắt buộc phải chọn hay không'
    },
    minSelect: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        field: 'min_select',
        validate: {
            min: { args: [0], msg: 'minSelect phải >= 0' }
        },
        comment: 'Số lượng tối thiểu phải chọn'
    },
    maxSelect: {
        type: DataTypes.INTEGER,
        defaultValue: 1,
        field: 'max_select',
        validate: {
            min: { args: [1], msg: 'maxSelect phải >= 1' }
        },
        comment: 'Số lượng tối đa được chọn'
    }
}, {
    tableName: 'option_groups',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

module.exports = OptionGroup;
