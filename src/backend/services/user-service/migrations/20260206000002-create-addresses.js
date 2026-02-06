'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('addresses', {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false
            },
            user_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'users',
                    key: 'id'
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE'
            },
            label: {
                type: Sequelize.STRING(50),
                allowNull: true
            },
            recipient_name: {
                type: Sequelize.STRING(255),
                allowNull: false
            },
            recipient_phone: {
                type: Sequelize.STRING(20),
                allowNull: false
            },
            address_line: {
                type: Sequelize.STRING(255),
                allowNull: false
            },
            ward: {
                type: Sequelize.STRING(100),
                allowNull: true
            },
            district: {
                type: Sequelize.STRING(100),
                allowNull: true
            },
            city: {
                type: Sequelize.STRING(100),
                allowNull: true,
                defaultValue: 'TP. Hồ Chí Minh'
            },
            latitude: {
                type: Sequelize.DECIMAL(10, 8),
                allowNull: true
            },
            longitude: {
                type: Sequelize.DECIMAL(11, 8),
                allowNull: true
            },
            is_default: {
                type: Sequelize.BOOLEAN,
                defaultValue: false
            },
            created_at: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
            },
            updated_at: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP')
            }
        });

        await queryInterface.addIndex('addresses', ['user_id']);
        await queryInterface.addIndex('addresses', ['user_id', 'is_default']);
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('addresses');
    }
};
