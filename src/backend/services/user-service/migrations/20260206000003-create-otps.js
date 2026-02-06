'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('otps', {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false
            },
            email: {
                type: Sequelize.STRING(255),
                allowNull: false
            },
            code: {
                type: Sequelize.STRING(6),
                allowNull: false
            },
            purpose: {
                type: Sequelize.ENUM('register', 'login', 'forgot_password', 'verify_email'),
                allowNull: false
            },
            expires_at: {
                type: Sequelize.DATE,
                allowNull: false
            },
            verified: {
                type: Sequelize.BOOLEAN,
                defaultValue: false
            },
            attempts: {
                type: Sequelize.INTEGER,
                defaultValue: 0
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

        await queryInterface.addIndex('otps', ['email', 'purpose']);
        await queryInterface.addIndex('otps', ['expires_at']);
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('otps');
    }
};
