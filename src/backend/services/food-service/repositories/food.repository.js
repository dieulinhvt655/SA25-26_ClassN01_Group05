const Food = require('../models/food.sequelize');

class FoodRepository {

    async create(name, price, restaurantId, categoryId, description, imageUrl) {
        const food = await Food.create({
            name,
            price,
            restaurantId,
            categoryId,
            description,
            imageUrl
        });
        return food;
    }

    async findAll() {
        const foods = await Food.findAll({
            order: [['id', 'ASC']]
        });
        return foods;
    }

    async findById(id) {
        const food = await Food.findByPk(id);
        return food;
    }

    async update(id, name, price, restaurantId, categoryId, description, imageUrl) {
        const food = await Food.findByPk(id);
        if (!food) return null;

        const updateData = {};
        if (name !== undefined) updateData.name = name;
        if (price !== undefined) updateData.price = price;
        if (restaurantId !== undefined) updateData.restaurantId = restaurantId;
        if (categoryId !== undefined) updateData.categoryId = categoryId;
        if (description !== undefined) updateData.description = description;
        if (imageUrl !== undefined) updateData.imageUrl = imageUrl;

        await food.update(updateData);
        return food;
    }

    async delete(id) {
        const food = await Food.findByPk(id);
        if (!food) return false;

        await food.destroy();
        return true;
    }
}

module.exports = new FoodRepository();
