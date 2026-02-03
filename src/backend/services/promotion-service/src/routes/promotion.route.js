const express = require('express');
const router = express.Router();
const controller = require('../controllers/promotion.controller');

router.post('/', controller.createPromotion);
router.get('/:productId', controller.getPromotionByProduct);

module.exports = router;