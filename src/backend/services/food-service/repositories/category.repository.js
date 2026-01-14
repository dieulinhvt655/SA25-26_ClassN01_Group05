const Category = require('../models/category.sequelize');

class CategoryRepository {
    async create(name, description, imageUrl) {
        const category = await Category.create({
            name,
            description,
            imageUrl
        });
        return category;
    }

    async findAll() {
        const categories = await Category.findAll({
            order: [['name', 'ASC']]
        });
        return categories;
    }

    async findById(id) {
        const category = await Category.findByPk(id);
        return category;
    }

    async findByName(name) {
        const category = await Category.findOne({
            where: { name }
        });
        return category;
    }

    async update(id, name, description, imageUrl) {
        const category = await Category.findByPk(id);
        if (!category) return null;

        const updateData = {};
        if (name !== undefined) updateData.name = name;
        if (description !== undefined) updateData.description = description;
        if (imageUrl !== undefined) updateData.imageUrl = imageUrl;

        await category.update(updateData);
        return category;
    }

    async delete(id) {
        const category = await Category.findByPk(id);
        if (!category) return false;

        await category.destroy();
        return true;
    }
}

module.exports = new CategoryRepository();
