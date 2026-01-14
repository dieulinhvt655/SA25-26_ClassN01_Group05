const express = require('express'); 
const router = express.Router();
const controller = require('../controllers/food.controller');
const { validateFood, validateFoodUpdate, validateId } = require('../middleware/validation');

// Apply validation middleware to routes
router.post('/', validateFood, controller.createFood);
router.get('/', controller.getFoods);
router.get('/:id', validateId, controller.getFood);
router.put('/:id', validateId, validateFoodUpdate, controller.updateFood);
router.delete('/:id', validateId, controller.deleteFood);

module.exports = router;
