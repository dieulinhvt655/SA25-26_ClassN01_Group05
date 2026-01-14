const foodRepository = require('../repositories/food.repository');
const { NotFoundError, DatabaseError, ValidationError } = require('../utils/errors');

class FoodService {
    async createFood(name, price, restaurantId, categoryId, description, imageUrl) {
        try {
            return await foodRepository.create(name, price, restaurantId, categoryId, description, imageUrl);
        } catch (error) {
            // Handle Sequelize validation errors
            if (error.name === 'SequelizeValidationError') {
                const details = error.errors.map(err => ({
                    field: err.path,
                    message: err.message,
                    value: err.value
                }));
                throw new ValidationError('Validation failed', details);
            }
            // Handle other Sequelize errors
            if (error.name && error.name.startsWith('Sequelize')) {
                throw new DatabaseError('Database operation failed: ' + error.message);
            }
            // Re-throw custom errors as-is
            if (error.isOperational) {
                throw error;
            }
            // Wrap unknown errors
            throw new DatabaseError('Failed to create food: ' + error.message);
        }
    }

    async getAllFoods() {
        try {
            return await foodRepository.findAll();
        } catch (error) {
            throw new DatabaseError('Failed to retrieve foods: ' + error.message);
        }
    }

    async getFoodById(id) {
        try {
            const food = await foodRepository.findById(id);
            if (!food) {
                throw new NotFoundError('Food');
            }
            return food;
        } catch (error) {
            // Re-throw NotFoundError as-is
            if (error instanceof NotFoundError) {
                throw error;
            }
            throw new DatabaseError('Failed to retrieve food: ' + error.message);
        }
    }

    async updateFood(id, name, price, restaurantId, categoryId, description, imageUrl) {
        try {
            const food = await foodRepository.update(id, name, price, restaurantId, categoryId, description, imageUrl);
            if (!food) {
                throw new NotFoundError('Food');
            }
            return food;
        } catch (error) {
            // Re-throw NotFoundError as-is
            if (error instanceof NotFoundError) {
                throw error;
            }
            // Handle Sequelize validation errors
            if (error.name === 'SequelizeValidationError') {
                const details = error.errors.map(err => ({
                    field: err.path,
                    message: err.message,
                    value: err.value
                }));
                throw new ValidationError('Validation failed', details);
            }
            // Re-throw custom errors as-is
            if (error.isOperational) {
                throw error;
            }
            // Handle other Sequelize errors
            if (error.name && error.name.startsWith('Sequelize')) {
                throw new DatabaseError('Database operation failed: ' + error.message);
            }
            throw new DatabaseError('Failed to update food: ' + error.message);
        }
    }

    async deleteFood(id) {
        try {
            const success = await foodRepository.delete(id);
            if (!success) {
                throw new NotFoundError('Food');
            }
            return success;
        } catch (error) {
            // Re-throw NotFoundError as-is
            if (error instanceof NotFoundError) {
                throw error;
            }
            throw new DatabaseError('Failed to delete food: ' + error.message);
        }
    }
}

module.exports = new FoodService();
