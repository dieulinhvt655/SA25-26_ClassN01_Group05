const { Restaurant, MenuCategory, MenuItem, OptionGroup, Option } = require('../models');

// Repository cho Restaurant - Xử lý truy vấn database
class RestaurantRepository {
    // Tạo nhà hàng mới
    async create(data) {
        return await Restaurant.create(data);
    }

    // Lấy tất cả nhà hàng với phân trang
    async findAll(options = {}) {
        const { page = 1, limit = 10, status } = options;
        const offset = (page - 1) * limit;

        const where = {};
        if (status) {
            where.status = status;
        }

        const { count, rows } = await Restaurant.findAndCountAll({
            where,
            limit: parseInt(limit),
            offset: parseInt(offset),
            order: [['created_at', 'DESC']]
        });

        return {
            data: rows,
            pagination: {
                total: count,
                page: parseInt(page),
                limit: parseInt(limit),
                totalPages: Math.ceil(count / limit)
            }
        };
    }

    // Lấy nhà hàng theo ID
    async findById(id) {
        return await Restaurant.findByPk(id);
    }

    // Lấy nhà hàng với đầy đủ thông tin menu
    async findByIdWithMenu(id) {
        return await Restaurant.findByPk(id, {
            include: [{
                model: MenuCategory,
                as: 'categories',
                where: { isActive: true },
                required: false,
                include: [{
                    model: MenuItem,
                    as: 'items',
                    where: { isAvailable: true },
                    required: false,
                    include: [{
                        model: OptionGroup,
                        as: 'optionGroups',
                        include: [{
                            model: Option,
                            as: 'options'
                        }]
                    }]
                }]
            }],
            order: [
                [{ model: MenuCategory, as: 'categories' }, 'display_order', 'ASC']
            ]
        });
    }

    // Cập nhật nhà hàng
    async update(id, data) {
        const restaurant = await Restaurant.findByPk(id);
        if (!restaurant) return null;

        await restaurant.update(data);
        return restaurant;
    }

    // Xóa nhà hàng
    async delete(id) {
        const restaurant = await Restaurant.findByPk(id);
        if (!restaurant) return false;

        await restaurant.destroy();
        return true;
    }
}

module.exports = new RestaurantRepository();
