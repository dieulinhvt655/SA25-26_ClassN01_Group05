const foodReviewService = require('../services/foodReview.service');
const { asyncHandler } = require('../middleware/errorHandler');

exports.createFoodReview = asyncHandler(async (req, res) => {
    const { foodId, userId, rating, comment, isVerified } = req.body;
    const review = await foodReviewService.createFoodReview(foodId, userId, rating, comment, isVerified);
    res.status(201).json(review);
});

exports.getFoodReviews = asyncHandler(async (req, res) => {
    const foodId = req.query.foodId || null;
    const userId = req.query.userId || null;
    const reviews = await foodReviewService.getAllFoodReviews(foodId, userId);
    res.json(reviews);
});

exports.getFoodReview = asyncHandler(async (req, res) => {
    const review = await foodReviewService.getFoodReviewById(req.params.id);
    res.json(review);
});

exports.getFoodReviewsByFoodId = asyncHandler(async (req, res) => {
    const reviews = await foodReviewService.getFoodReviewsByFoodId(req.params.foodId);
    res.json(reviews);
});

exports.getFoodAverageRating = asyncHandler(async (req, res) => {
    const rating = await foodReviewService.getFoodAverageRating(req.params.foodId);
    res.json(rating);
});

exports.updateFoodReview = asyncHandler(async (req, res) => {
    const { rating, comment, isVerified } = req.body;
    const review = await foodReviewService.updateFoodReview(req.params.id, rating, comment, isVerified);
    res.json(review);
});

exports.deleteFoodReview = asyncHandler(async (req, res) => {
    await foodReviewService.deleteFoodReview(req.params.id);
    res.status(200).json({ message: 'Food review deleted successfully' });
});
