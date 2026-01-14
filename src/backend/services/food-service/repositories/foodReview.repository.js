const FoodReview = require('../models/foodReview.sequelize');
const { Op, Sequelize } = require('sequelize');

class FoodReviewRepository {
    async create(foodId, userId, rating, comment, isVerified) {
        const review = await FoodReview.create({
            foodId,
            userId,
            rating,
            comment,
            isVerified: isVerified || false
        });
        return review;
    }

    async findAll(foodId = null, userId = null) {
        const whereClause = {};
        if (foodId) whereClause.foodId = foodId;
        if (userId) whereClause.userId = userId;

        const reviews = await FoodReview.findAll({
            where: whereClause,
            order: [['created_at', 'DESC']]
        });
        return reviews;
    }

    async findById(id) {
        const review = await FoodReview.findByPk(id);
        return review;
    }

    async findByFoodId(foodId) {
        const reviews = await FoodReview.findAll({
            where: { foodId },
            order: [['created_at', 'DESC']]
        });
        return reviews;
    }

    async findByUserId(userId) {
        const reviews = await FoodReview.findAll({
            where: { userId },
            order: [['created_at', 'DESC']]
        });
        return reviews;
    }

    async findUserReviewForFood(foodId, userId) {
        const review = await FoodReview.findOne({
            where: {
                foodId,
                userId
            }
        });
        return review;
    }

    async getAverageRating(foodId) {
        const result = await FoodReview.findOne({
            where: { foodId },
            attributes: [
                [Sequelize.fn('AVG', Sequelize.col('rating')), 'averageRating'],
                [Sequelize.fn('COUNT', Sequelize.col('id')), 'totalReviews']
            ],
            raw: true
        });
        return result;
    }

    async update(id, rating, comment, isVerified) {
        const review = await FoodReview.findByPk(id);
        if (!review) return null;

        const updateData = {};
        if (rating !== undefined) updateData.rating = rating;
        if (comment !== undefined) updateData.comment = comment;
        if (isVerified !== undefined) updateData.isVerified = isVerified;

        await review.update(updateData);
        return review;
    }

    async delete(id) {
        const review = await FoodReview.findByPk(id);
        if (!review) return false;

        await review.destroy();
        return true;
    }
}

module.exports = new FoodReviewRepository();
