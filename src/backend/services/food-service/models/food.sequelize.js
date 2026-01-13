const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Food = sequelize.define('Food', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        validate: {
            min: 0
        }
    },
    restaurantId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'restaurant_id'
    }
}, {
    tableName: 'foods',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

module.exports = Food;

