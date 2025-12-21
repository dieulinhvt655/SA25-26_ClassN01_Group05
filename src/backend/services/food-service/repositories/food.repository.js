const Food = require('../models/food.model');

let foods = [];
let nextId = 1;

class FoodRepository {

    create(name, price, restaurantId) {
        const food = new Food(nextId++, name, price, restaurantId);
        foods.push(food);
        return food;
    }

    findAll() {
        return foods;
    }

    findById(id) {
        return foods.find(f => f.id === id);
    }

    update(id, name, price, restaurantId) {
        const food = this.findById(id);
        if (!food) return null;

        if (name !== undefined) food.name = name;
        if (price !== undefined) food.price = price;
        if (restaurantId !== undefined) food.restaurantId = restaurantId;
        return food;
    }

    delete(id) {
        const index = foods.findIndex(f => f.id === id);
        if (index === -1) return false;

        foods.splice(index, 1);
        return true;
    }
}

module.exports = new FoodRepository();
