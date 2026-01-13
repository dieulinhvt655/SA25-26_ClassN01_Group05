const foodRepository = require('../repositories/food.repository');

class FoodService {
    async createFood(name, price, restaurantId) {
        if (!name || !price || price <= 0 || !restaurantId) {
            throw new Error('Invalid food data: name, price (>0), and restaurantId are required');
        }
        return await foodRepository.create(name, price, restaurantId);
    }

    async getAllFoods() {
        return await foodRepository.findAll();
    }

    async getFoodById(id) {
        const food = await foodRepository.findById(id);
        if (!food) {
            throw new Error('Food not found');
        }
        return food;
    }

    async updateFood(id, name, price, restaurantId) {
        const food = await foodRepository.update(id, name, price, restaurantId);
        if (!food) {
            throw new Error('Food not found');
        }
        return food;
    }

    async deleteFood(id) {
        const success = await foodRepository.delete(id);
        if (!success) {
            throw new Error('Food not found');
        }
        return success;
    }
}

module.exports = new FoodService();
