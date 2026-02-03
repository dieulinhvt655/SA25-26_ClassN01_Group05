const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

// Model Option - tùy chọn cụ thể trong nhóm tùy chọn
const Option = sequelize.define('Option', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        comment: 'ID duy nhất của tùy chọn (UUID)'
    },
    optionGroupId: {
        type: DataTypes.UUID,
        allowNull: false,
        field: 'option_group_id',
        comment: 'ID của nhóm tùy chọn chứa option này'
    },
    name: {
        type: DataTypes.STRING(255),
        allowNull: false,
        validate: {
            notEmpty: { msg: 'Tên tùy chọn không được để trống' }
        },
        comment: 'Tên tùy chọn (VD: Size M, Size L, Thêm trân châu)'
    },
    extraPrice: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0,
        field: 'extra_price',
        validate: {
            min: { args: [0], msg: 'Giá thêm phải >= 0' }
        },
        comment: 'Giá thêm khi chọn option này'
    },
    isDefault: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        field: 'is_default',
        comment: 'Đây có phải là option mặc định không'
    }
}, {
    tableName: 'options',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

module.exports = Option;
