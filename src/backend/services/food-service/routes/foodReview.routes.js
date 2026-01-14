const express = require('express');
const router = express.Router();
const controller = require('../controllers/foodReview.controller');
const { validateFoodReview, validateFoodReviewUpdate, validateId } = require('../middleware/validation');
const { param } = require('express-validator');
const { validate } = require('../middleware/validation');

const validateFoodId = [
    param('foodId')
        .isInt({ min: 1 })
        .withMessage('Food ID must be a positive integer')
        .toInt(),
    validate
];

router.post('/', validateFoodReview, controller.createFoodReview);
router.get('/', controller.getFoodReviews);
router.get('/food/:foodId', validateFoodId, controller.getFoodReviewsByFoodId);
router.get('/food/:foodId/rating', validateFoodId, controller.getFoodAverageRating);
router.get('/:id', validateId, controller.getFoodReview);
router.put('/:id', validateId, validateFoodReviewUpdate, controller.updateFoodReview);
router.delete('/:id', validateId, controller.deleteFoodReview);

module.exports = router;
