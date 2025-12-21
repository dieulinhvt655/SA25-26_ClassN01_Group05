const express = require('express');
const router = express.Router();
const controller = require('../controllers/food.controller');

router.post('/', controller.createFood);
router.get('/', controller.getFoods);
router.get('/:id', controller.getFood);
router.put('/:id', controller.updateFood);
router.delete('/:id', controller.deleteFood);

module.exports = router;
