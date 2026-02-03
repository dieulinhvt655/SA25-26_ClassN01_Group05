const { MenuItem, OptionGroup, Option } = require('../models');

// Repository cho MenuItem - Xử lý truy vấn database cho món ăn
class ItemRepository {
    // Tạo món ăn mới
    async create(data) {
        return await MenuItem.create(data);
    }

    // Lấy món ăn theo ID
    async findById(id) {
        return await MenuItem.findByPk(id);
    }

    // Lấy món ăn với đầy đủ options
    async findByIdWithOptions(id) {
        return await MenuItem.findByPk(id, {
            include: [{
                model: OptionGroup,
                as: 'optionGroups',
                include: [{
                    model: Option,
                    as: 'options'
                }]
            }]
        });
    }

    // Lấy tất cả món ăn của một danh mục
    async findByCategoryId(categoryId) {
        return await MenuItem.findAll({
            where: { categoryId },
            include: [{
                model: OptionGroup,
                as: 'optionGroups',
                include: [{
                    model: Option,
                    as: 'options'
                }]
            }],
            order: [['created_at', 'DESC']]
        });
    }

    // Cập nhật món ăn
    async update(id, data) {
        const item = await MenuItem.findByPk(id);
        if (!item) return null;

        await item.update(data);
        return item;
    }

    // Xóa món ăn
    async delete(id) {
        const item = await MenuItem.findByPk(id);
        if (!item) return false;

        await item.destroy();
        return true;
    }
}

module.exports = new ItemRepository();
