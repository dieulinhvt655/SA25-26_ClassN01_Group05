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

module.exports = {
    validateFood,
    validateFoodUpdate,
    validateId,
    validate
};
