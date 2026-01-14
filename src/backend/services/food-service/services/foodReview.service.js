const foodReviewRepository = require('../repositories/foodReview.repository');
const { NotFoundError, DatabaseError, ValidationError, ConflictError } = require('../utils/errors');

class FoodReviewService {
    async createFoodReview(foodId, userId, rating, comment, isVerified) {
        try {
            // Check if user already reviewed this food
            const existingReview = await foodReviewRepository.findUserReviewForFood(foodId, userId);
            if (existingReview) {
                throw new ConflictError('Bạn đã đánh giá món ăn này rồi. Vui lòng cập nhật đánh giá hiện có.');
            }

            return await foodReviewRepository.create(foodId, userId, rating, comment, isVerified);
        } catch (error) {
            if (error.isOperational) {
                throw error;
            }
            if (error.name === 'SequelizeValidationError') {
                const details = error.errors.map(err => ({
                    field: err.path,
                    message: err.message,
                    value: err.value
                }));
                throw new ValidationError('Validation failed', details);
            }
            if (error.name && error.name.startsWith('Sequelize')) {
                throw new DatabaseError('Database operation failed: ' + error.message);
            }
            throw new DatabaseError('Failed to create food review: ' + error.message);
        }
    }

    async getAllFoodReviews(foodId = null, userId = null) {
        try {
            return await foodReviewRepository.findAll(foodId, userId);
        } catch (error) {
            throw new DatabaseError('Failed to retrieve food reviews: ' + error.message);
        }
    }

    async getFoodReviewById(id) {
        try {
            const review = await foodReviewRepository.findById(id);
            if (!review) {
                throw new NotFoundError('FoodReview');
            }
            return review;
        } catch (error) {
            if (error instanceof NotFoundError) {
                throw error;
            }
            throw new DatabaseError('Failed to retrieve food review: ' + error.message);
        }
    }

    async getFoodReviewsByFoodId(foodId) {
        try {
            return await foodReviewRepository.findByFoodId(foodId);
        } catch (error) {
            throw new DatabaseError('Failed to retrieve food reviews: ' + error.message);
        }
    }

    async getFoodAverageRating(foodId) {
        try {
            const result = await foodReviewRepository.getAverageRating(foodId);
            return {
                averageRating: parseFloat(result.averageRating) || 0,
                totalReviews: parseInt(result.totalReviews) || 0
            };
        } catch (error) {
            throw new DatabaseError('Failed to get average rating: ' + error.message);
        }
    }

    async updateFoodReview(id, rating, comment, isVerified) {
        try {
            const review = await foodReviewRepository.findById(id);
            if (!review) {
                throw new NotFoundError('FoodReview');
            }

            const updatedReview = await foodReviewRepository.update(id, rating, comment, isVerified);
            return updatedReview;
        } catch (error) {
            if (error instanceof NotFoundError) {
                throw error;
            }
            if (error.name === 'SequelizeValidationError') {
                const details = error.errors.map(err => ({
                    field: err.path,
                    message: err.message,
                    value: err.value
                }));
                throw new ValidationError('Validation failed', details);
            }
            if (error.isOperational) {
                throw error;
            }
            if (error.name && error.name.startsWith('Sequelize')) {
                throw new DatabaseError('Database operation failed: ' + error.message);
            }
            throw new DatabaseError('Failed to update food review: ' + error.message);
        }
    }

    async deleteFoodReview(id) {
        try {
            const success = await foodReviewRepository.delete(id);
            if (!success) {
                throw new NotFoundError('FoodReview');
            }
            return success;
        } catch (error) {
            if (error instanceof NotFoundError) {
                throw error;
            }
            throw new DatabaseError('Failed to delete food review: ' + error.message);
        }
    }
}

module.exports = new FoodReviewService();
