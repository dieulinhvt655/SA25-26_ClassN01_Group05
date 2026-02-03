const { OptionGroup, Option } = require('../models');

// Repository cho OptionGroup - Xử lý truy vấn database cho nhóm tùy chọn
class OptionGroupRepository {
    // Tạo nhóm tùy chọn mới
    async create(data) {
        return await OptionGroup.create(data);
    }

    // Lấy nhóm tùy chọn theo ID
    async findById(id) {
        return await OptionGroup.findByPk(id);
    }

    // Lấy nhóm tùy chọn với các options
    async findByIdWithOptions(id) {
        return await OptionGroup.findByPk(id, {
            include: [{
                model: Option,
                as: 'options'
            }]
        });
    }

    // Lấy tất cả nhóm tùy chọn của một món ăn
    async findByItemId(itemId) {
        return await OptionGroup.findAll({
            where: { itemId },
            include: [{
                model: Option,
                as: 'options'
            }],
            order: [['created_at', 'ASC']]
        });
    }

    // Cập nhật nhóm tùy chọn
    async update(id, data) {
        const optionGroup = await OptionGroup.findByPk(id);
        if (!optionGroup) return null;

        await optionGroup.update(data);
        return optionGroup;
    }

    // Xóa nhóm tùy chọn
    async delete(id) {
        const optionGroup = await OptionGroup.findByPk(id);
        if (!optionGroup) return false;

        await optionGroup.destroy();
        return true;
    }
}

module.exports = new OptionGroupRepository();
