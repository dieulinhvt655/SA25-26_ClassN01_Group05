'use strict';
const bcrypt = require('bcrypt');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        // Password: 123456 (hashed)
        const passwordHash = await bcrypt.hash('123456', 10);

        await queryInterface.bulkInsert('users', [
            {
                email: 'admin@yummy.com',
                password_hash: passwordHash,
                role: 'admin',
                status: 'active',
                full_name: 'Quản Trị Viên',
                phone: '0901234567',
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                email: 'customer1@gmail.com',
                password_hash: passwordHash,
                role: 'customer',
                status: 'active',
                full_name: 'Nguyễn Văn A',
                phone: '0912345678',
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                email: 'customer2@gmail.com',
                password_hash: passwordHash,
                role: 'customer',
                status: 'active',
                full_name: 'Trần Thị B',
                phone: '0923456789',
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                email: 'restaurant@yummy.com',
                password_hash: passwordHash,
                role: 'restaurant_owner',
                status: 'active',
                full_name: 'Chủ Nhà Hàng',
                phone: '0934567890',
                created_at: new Date(),
                updated_at: new Date()
            }
        ]);
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete('users', null, {});
    }
};
