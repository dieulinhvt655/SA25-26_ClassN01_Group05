const { MenuCategory, MenuItem, OptionGroup, Option } = require('../models');

// Repository cho MenuCategory - Xử lý truy vấn database cho danh mục
class CategoryRepository {
    // Tạo danh mục mới
    async create(data) {
        return await MenuCategory.create(data);
    }

    // Lấy danh mục theo ID
    async findById(id) {
        return await MenuCategory.findByPk(id);
    }

    // Lấy tất cả danh mục của một nhà hàng
    async findByRestaurantId(restaurantId) {
        return await MenuCategory.findAll({
            where: { restaurantId },
            order: [['display_order', 'ASC']]
        });
    }

    // Lấy danh mục kèm theo các món ăn
    async findByIdWithItems(id) {
        return await MenuCategory.findByPk(id, {
            include: [{
                model: MenuItem,
                as: 'items',
                include: [{
                    model: OptionGroup,
                    as: 'optionGroups',
                    include: [{
                        model: Option,
                        as: 'options'
                    }]
                }]
            }]
        });
    }

    // Cập nhật danh mục
    async update(id, data) {
        const category = await MenuCategory.findByPk(id);
        if (!category) return null;

        await category.update(data);
        return category;
    }

    // Xóa danh mục
    async delete(id) {
        const category = await MenuCategory.findByPk(id);
        if (!category) return false;

        await category.destroy();
        return true;
    }
}

module.exports = new CategoryRepository();
