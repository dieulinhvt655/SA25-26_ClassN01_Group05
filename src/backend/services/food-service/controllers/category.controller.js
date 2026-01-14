const categoryService = require('../services/category.service');
const { asyncHandler } = require('../middleware/errorHandler');

exports.createCategory = asyncHandler(async (req, res) => {
    const { name, description, imageUrl } = req.body;
    const category = await categoryService.createCategory(name, description, imageUrl);
    res.status(201).json(category);
});

exports.getCategories = asyncHandler(async (req, res) => {
    const categories = await categoryService.getAllCategories();
    res.json(categories);
});

exports.getCategory = asyncHandler(async (req, res) => {
    const category = await categoryService.getCategoryById(req.params.id);
    res.json(category);
});

exports.updateCategory = asyncHandler(async (req, res) => {
    const { name, description, imageUrl } = req.body;
    const category = await categoryService.updateCategory(req.params.id, name, description, imageUrl);
    res.json(category);
});

exports.deleteCategory = asyncHandler(async (req, res) => {
    await categoryService.deleteCategory(req.params.id);
    res.status(200).json({ message: 'Category deleted successfully' });
});
