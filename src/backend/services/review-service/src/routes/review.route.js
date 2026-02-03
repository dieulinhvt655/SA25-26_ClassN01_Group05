const express = require('express');
const router = express.Router();
const controller = require('../controllers/review.controller');

router.post('/', controller.createReview);
router.get('/:productId', controller.getReviewsByProduct);

module.exports = router;