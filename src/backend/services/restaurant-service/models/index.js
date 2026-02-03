// File index.js - Tập trung định nghĩa và export tất cả models với associations
const { sequelize } = require('../config/database');

// Import tất cả models
const Restaurant = require('./restaurant.model');
const MenuCategory = require('./menuCategory.model');
const MenuItem = require('./menuItem.model');
const OptionGroup = require('./optionGroup.model');
const Option = require('./option.model');

// ==========================================
// ĐỊNH NGHĨA CÁC QUAN HỆ GIỮA CÁC MODELS
// ==========================================

// Restaurant có nhiều MenuCategory (1:N)
Restaurant.hasMany(MenuCategory, {
    foreignKey: 'restaurantId',
    as: 'categories',
    onDelete: 'CASCADE'  // Xóa restaurant sẽ xóa luôn các categories
});
MenuCategory.belongsTo(Restaurant, {
    foreignKey: 'restaurantId',
    as: 'restaurant'
});

// MenuCategory có nhiều MenuItem (1:N)
MenuCategory.hasMany(MenuItem, {
    foreignKey: 'categoryId',
    as: 'items',
    onDelete: 'CASCADE'  // Xóa category sẽ xóa luôn các items
});
MenuItem.belongsTo(MenuCategory, {
    foreignKey: 'categoryId',
    as: 'category'
});

// MenuItem có nhiều OptionGroup (1:N)
MenuItem.hasMany(OptionGroup, {
    foreignKey: 'itemId',
    as: 'optionGroups',
    onDelete: 'CASCADE'  // Xóa item sẽ xóa luôn các option groups
});
OptionGroup.belongsTo(MenuItem, {
    foreignKey: 'itemId',
    as: 'item'
});

// OptionGroup có nhiều Option (1:N)
OptionGroup.hasMany(Option, {
    foreignKey: 'optionGroupId',
    as: 'options',
    onDelete: 'CASCADE'  // Xóa option group sẽ xóa luôn các options
});
Option.belongsTo(OptionGroup, {
    foreignKey: 'optionGroupId',
    as: 'optionGroup'
});

// Export tất cả models và sequelize instance
module.exports = {
    sequelize,
    Restaurant,
    MenuCategory,
    MenuItem,
    OptionGroup,
    Option
};
