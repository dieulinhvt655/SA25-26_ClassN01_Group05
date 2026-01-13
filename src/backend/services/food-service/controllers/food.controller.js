const foodService = require('../services/food.service');

exports.createFood = async (req, res) => {
    try {
        const { name, price, restaurantId } = req.body;
        const food = await foodService.createFood(name, price, restaurantId);
        res.status(201).json(food);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.getFoods = async (req, res) => {
    try {
        const foods = await foodService.getAllFoods();
        res.json(foods);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getFood = async (req, res) => {
    try {
        const food = await foodService.getFoodById(parseInt(req.params.id));
        res.json(food);
    } catch (err) {
        res.status(404).json({ error: err.message });
    }
};

exports.updateFood = async (req, res) => {
    try {
        const { name, price, restaurantId } = req.body;
        const food = await foodService.updateFood(parseInt(req.params.id), name, price, restaurantId);
        res.json(food);
    } catch (err) {
        res.status(404).json({ error: err.message });
    }
};

exports.deleteFood = async (req, res) => {
    try {
        await foodService.deleteFood(parseInt(req.params.id));
        res.status(200).json({ message: 'Food deleted successfully' });
    } catch (err) {
        res.status(404).json({ error: err.message });
    }
};
