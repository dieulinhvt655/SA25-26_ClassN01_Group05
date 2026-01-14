const foodService = require('../services/food.service');
const { asyncHandler } = require('../middleware/errorHandler');

// Validation đã được xử lý ở middleware, nên controllers chỉ cần gọi service
exports.createFood = asyncHandler(async (req, res) => {
    const { name, price, restaurantId } = req.body;
    const food = await foodService.createFood(name, price, restaurantId);
    res.status(201).json(food);
});

exports.getFoods = asyncHandler(async (req, res) => {
    const foods = await foodService.getAllFoods();
    res.json(foods);
});

exports.getFood = asyncHandler(async (req, res) => {
    const food = await foodService.getFoodById(req.params.id);
    res.json(food);
});

exports.updateFood = asyncHandler(async (req, res) => {
    const { name, price, restaurantId } = req.body;
    const food = await foodService.updateFood(req.params.id, name, price, restaurantId);
    res.json(food);
});

exports.deleteFood = asyncHandler(async (req, res) => {
    await foodService.deleteFood(req.params.id);
    res.status(200).json({ message: 'Food deleted successfully' });
});
