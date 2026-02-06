'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        // Lấy user IDs (giả sử customer1 có id = 2, customer2 có id = 3)
        await queryInterface.bulkInsert('addresses', [
            {
                user_id: 2, // customer1
                label: 'Nhà',
                recipient_name: 'Nguyễn Văn A',
                recipient_phone: '0912345678',
                address_line: '123 Nguyễn Huệ',
                ward: 'Phường Bến Nghé',
                district: 'Quận 1',
                city: 'TP. Hồ Chí Minh',
                is_default: true,
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                user_id: 2, // customer1
                label: 'Công ty',
                recipient_name: 'Nguyễn Văn A',
                recipient_phone: '0912345678',
                address_line: '456 Lê Lợi',
                ward: 'Phường Bến Thành',
                district: 'Quận 1',
                city: 'TP. Hồ Chí Minh',
                is_default: false,
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                user_id: 3, // customer2
                label: 'Nhà',
                recipient_name: 'Trần Thị B',
                recipient_phone: '0923456789',
                address_line: '789 Hai Bà Trưng',
                ward: 'Phường 6',
                district: 'Quận 3',
                city: 'TP. Hồ Chí Minh',
                is_default: true,
                created_at: new Date(),
                updated_at: new Date()
            }
        ]);
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete('addresses', null, {});
    }
};
