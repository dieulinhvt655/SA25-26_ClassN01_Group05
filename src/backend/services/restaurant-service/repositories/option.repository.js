const { Option } = require('../models');

// Repository cho Option - Xử lý truy vấn database cho tùy chọn
class OptionRepository {
    // Tạo tùy chọn mới
    async create(data) {
        return await Option.create(data);
    }

    // Lấy tùy chọn theo ID
    async findById(id) {
        return await Option.findByPk(id);
    }

    // Lấy tất cả tùy chọn của một nhóm
    async findByOptionGroupId(optionGroupId) {
        return await Option.findAll({
            where: { optionGroupId },
            order: [['created_at', 'ASC']]
        });
    }

    // Cập nhật tùy chọn
    async update(id, data) {
        const option = await Option.findByPk(id);
        if (!option) return null;

        await option.update(data);
        return option;
    }

    // Xóa tùy chọn
    async delete(id) {
        const option = await Option.findByPk(id);
        if (!option) return false;

        await option.destroy();
        return true;
    }
}

module.exports = new OptionRepository();
