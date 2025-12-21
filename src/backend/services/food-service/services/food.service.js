const foodRepository = require('../repositories/food.repository');

class FoodService {
    createFood(name, price, restaurantId) {
        if (!name || !price || price <= 0 || !restaurantId) {
            throw new Error('Invalid food data: name, price (>0), and restaurantId are required');
        }
        return foodRepository.create(name, price, restaurantId);
    }

    getAllFoods() {
        return foodRepository.findAll();
    }

    getFoodById(id) {
        const food = foodRepository.findById(id);
        if (!food) {
            throw new Error('Food not found');
        }
        return food;
    }

    updateFood(id, name, price, restaurantId) {
        const food = foodRepository.update(id, name, price, restaurantId);
        if (!food) {
            throw new Error('Food not found');
        }
        return food;
    }

    deleteFood(id) {
        const success = foodRepository.delete(id);
        if (!success) {
            throw new Error('Food not found');
        }
        return success;
    }
}

module.exports = new FoodService();
