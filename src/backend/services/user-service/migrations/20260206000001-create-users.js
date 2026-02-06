'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('users', {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false
            },
            email: {
                type: Sequelize.STRING(255),
                allowNull: false,
                unique: true
            },
            password_hash: {
                type: Sequelize.STRING(255),
                allowNull: false
            },
            role: {
                type: Sequelize.ENUM('customer', 'admin', 'restaurant_owner'),
                defaultValue: 'customer',
                allowNull: false
            },
            status: {
                type: Sequelize.ENUM('pending', 'active', 'locked', 'deleted'),
                defaultValue: 'pending',
                allowNull: false
            },
            locked_reason: {
                type: Sequelize.STRING(255),
                allowNull: true
            },
            locked_at: {
                type: Sequelize.DATE,
                allowNull: true
            },
            full_name: {
                type: Sequelize.STRING(255),
                allowNull: false
            },
            phone: {
                type: Sequelize.STRING(20),
                allowNull: true
            },
            avatar: {
                type: Sequelize.STRING(500),
                allowNull: true
            },
            date_of_birth: {
                type: Sequelize.DATEONLY,
                allowNull: true
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

        // Add indexes
        await queryInterface.addIndex('users', ['email'], { unique: true });
        await queryInterface.addIndex('users', ['status']);
        await queryInterface.addIndex('users', ['role']);
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('users');
    }
};
