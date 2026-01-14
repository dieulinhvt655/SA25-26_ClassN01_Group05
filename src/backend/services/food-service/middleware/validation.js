const { body, param, validationResult } = require('express-validator');
const { ValidationError } = require('../utils/errors');

// Validation middleware to check for errors
const validate = (req, res, next) => {
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
        const errorDetails = errors.array().map(err => ({
            field: err.path || err.param,
            message: err.msg,
            value: err.value
        }));
        
        throw new ValidationError('Validation failed', errorDetails);
    }
    
    next();
};

// Food validation rules
const validateFood = [
    body('name')
        .trim()
        .notEmpty()
        .withMessage('Name is required')
        .isLength({ min: 1, max: 255 })
        .withMessage('Name must be between 1 and 255 characters'),
    
    body('price')
        .notEmpty()
        .withMessage('Price is required')
        .isFloat({ min: 0 })
        .withMessage('Price must be a positive number')
        .toFloat(),
    
    body('restaurantId')
        .notEmpty()
        .withMessage('Restaurant ID is required')
        .isInt({ min: 1 })
        .withMessage('Restaurant ID must be a positive integer')
        .toInt(),
    
    body('categoryId')
        .optional()
        .isInt({ min: 1 })
        .withMessage('Category ID must be a positive integer')
        .toInt(),
    
    body('description')
        .optional()
        .isString()
        .withMessage('Description must be a string'),
    
    body('imageUrl')
        .optional()
        .isURL()
        .withMessage('Image URL must be a valid URL'),
    
    validate
];

// Food update validation (all fields optional)
const validateFoodUpdate = [
    body('name')
        .optional()
        .trim()
        .notEmpty()
        .withMessage('Name cannot be empty')
        .isLength({ min: 1, max: 255 })
        .withMessage('Name must be between 1 and 255 characters'),
    
    body('price')
        .optional()
        .isFloat({ min: 0 })
        .withMessage('Price must be a positive number')
        .toFloat(),
    
    body('restaurantId')
        .optional()
        .isInt({ min: 1 })
        .withMessage('Restaurant ID must be a positive integer')
        .toInt(),
    
    body('categoryId')
        .optional()
        .isInt({ min: 1 })
        .withMessage('Category ID must be a positive integer')
        .toInt(),
    
    body('description')
        .optional()
        .isString()
        .withMessage('Description must be a string'),
    
    body('imageUrl')
        .optional()
        .isURL()
        .withMessage('Image URL must be a valid URL'),
    
    validate
];

// ID parameter validation
const validateId = [
    param('id')
        .isInt({ min: 1 })
        .withMessage('ID must be a positive integer')
        .toInt(),
    
    validate
];

// Category validation rules
const validateCategory = [
    body('name')
        .trim()
        .notEmpty()
        .withMessage('Name is required')
        .isLength({ min: 1, max: 255 })
        .withMessage('Name must be between 1 and 255 characters'),
    
    body('description')
        .optional()
        .isString()
        .withMessage('Description must be a string'),
    
    body('imageUrl')
        .optional()
        .isURL()
        .withMessage('Image URL must be a valid URL'),
    
    validate
];

const validateCategoryUpdate = [
    body('name')
        .optional()
        .trim()
        .notEmpty()
        .withMessage('Name cannot be empty')
        .isLength({ min: 1, max: 255 })
        .withMessage('Name must be between 1 and 255 characters'),
    
    body('description')
        .optional()
        .isString()
        .withMessage('Description must be a string'),
    
    body('imageUrl')
        .optional()
        .isURL()
        .withMessage('Image URL must be a valid URL'),
    
    validate
];

// FoodReview validation rules
const validateFoodReview = [
    body('foodId')
        .notEmpty()
        .withMessage('Food ID is required')
        .isInt({ min: 1 })
        .withMessage('Food ID must be a positive integer')
        .toInt(),
    
    body('userId')
        .notEmpty()
        .withMessage('User ID is required')
        .isInt({ min: 1 })
        .withMessage('User ID must be a positive integer')
        .toInt(),
    
    body('rating')
        .notEmpty()
        .withMessage('Rating is required')
        .isInt({ min: 1, max: 5 })
        .withMessage('Rating must be between 1 and 5')
        .toInt(),
    
    body('comment')
        .optional()
        .isString()
        .withMessage('Comment must be a string'),
    
    body('isVerified')
        .optional()
        .isBoolean()
        .withMessage('isVerified must be a boolean')
        .toBoolean(),
    
    validate
];

const validateFoodReviewUpdate = [
    body('rating')
        .optional()
        .isInt({ min: 1, max: 5 })
        .withMessage('Rating must be between 1 and 5')
        .toInt(),
    
    body('comment')
        .optional()
        .isString()
        .withMessage('Comment must be a string'),
    
    body('isVerified')
        .optional()
        .isBoolean()
        .withMessage('isVerified must be a boolean')
        .toBoolean(),
    
    validate
];

module.exports = {
    validateFood,
    validateFoodUpdate,
    validateCategory,
    validateCategoryUpdate,
    validateFoodReview,
    validateFoodReviewUpdate,
    validateId,
    validate
};
