const express = require('express');
const router = express.Router();
const controller = require('../controllers/category.controller');
const { validateCategory, validateCategoryUpdate, validateId } = require('../middleware/validation');

router.post('/', validateCategory, controller.createCategory);
router.get('/', controller.getCategories);
router.get('/:id', validateId, controller.getCategory);
router.put('/:id', validateId, validateCategoryUpdate, controller.updateCategory);
router.delete('/:id', validateId, controller.deleteCategory);

module.exports = router;
