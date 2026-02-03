const express = require('express');

// Import tất cả route files
const restaurantRoutes = require('./restaurant.routes');
const categoryRoutes = require('./category.routes');
const itemRoutes = require('./item.routes');
const optionGroupRoutes = require('./optionGroup.routes');
const optionRoutes = require('./option.routes');

// Hàm setup tất cả routes cho service
const setupRoutes = (app) => {
    // Restaurant routes: /restaurants/*
    app.use('/restaurants', restaurantRoutes);

    // Category routes: /restaurants/:restaurantId/categories, /categories/:id
    app.use('/', categoryRoutes);

    // Item routes: /categories/:categoryId/items, /items/:id
    app.use('/', itemRoutes);

    // OptionGroup routes: /items/:itemId/option-groups, /option-groups/:id
    app.use('/', optionGroupRoutes);

    // Option routes: /option-groups/:groupId/options, /options/:id
    app.use('/', optionRoutes);

    // Health check endpoint
    app.get('/health', (req, res) => {
        res.status(200).json({
            success: true,
            service: 'restaurant-service',
            status: 'healthy',
            timestamp: new Date().toISOString()
        });
    });
};

module.exports = setupRoutes;
