const Food = require('./food.sequelize');
const Category = require('./category.sequelize');
const FoodReview = require('./foodReview.sequelize');

// Define associations
// Food belongs to Category
Food.belongsTo(Category, {
    foreignKey: 'categoryId',
    as: 'category'
});

// Category has many Foods
Category.hasMany(Food, {
    foreignKey: 'categoryId',
    as: 'foods'
});

// Food has many FoodReviews
Food.hasMany(FoodReview, {
    foreignKey: 'foodId',
    as: 'reviews'
});

// FoodReview belongs to Food
FoodReview.belongsTo(Food, {
    foreignKey: 'foodId',
    as: 'food'
});

module.exports = {
    Food,
    Category,
    FoodReview
};
