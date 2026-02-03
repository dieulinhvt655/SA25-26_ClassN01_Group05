const restaurantService = require('../services/restaurant.service');

// Controller cho Restaurant - Xử lý HTTP requests
class RestaurantController {
    // POST /restaurants - Tạo nhà hàng mới
    async createRestaurant(req, res) {
        try {
            const restaurant = await restaurantService.createRestaurant(req.body);
            res.status(201).json({
                success: true,
                message: 'Tạo nhà hàng thành công',
                data: restaurant
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    // GET /restaurants - Lấy danh sách nhà hàng
    async getAllRestaurants(req, res) {
        try {
            const { page, limit, status } = req.query;
            const result = await restaurantService.getAllRestaurants({ page, limit, status });
            res.status(200).json({
                success: true,
                ...result
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    // GET /restaurants/:id - Lấy chi tiết nhà hàng
    async getRestaurantById(req, res) {
        try {
            const { id } = req.params;
            const includeMenu = req.query.includeMenu === 'true';

            let restaurant;
            if (includeMenu) {
                restaurant = await restaurantService.getRestaurantWithMenu(id);
            } else {
                restaurant = await restaurantService.getRestaurantById(id);
            }

            res.status(200).json({
                success: true,
                data: restaurant
            });
        } catch (error) {
            res.status(404).json({
                success: false,
                message: error.message
            });
        }
    }

    // PUT /restaurants/:id - Cập nhật nhà hàng
    async updateRestaurant(req, res) {
        try {
            const { id } = req.params;
            const restaurant = await restaurantService.updateRestaurant(id, req.body);
            res.status(200).json({
                success: true,
                message: 'Cập nhật nhà hàng thành công',
                data: restaurant
            });
        } catch (error) {
            res.status(404).json({
                success: false,
                message: error.message
            });
        }
    }

    // DELETE /restaurants/:id - Xóa nhà hàng
    async deleteRestaurant(req, res) {
        try {
            const { id } = req.params;
            await restaurantService.deleteRestaurant(id);
            res.status(200).json({
                success: true,
                message: 'Xóa nhà hàng thành công'
            });
        } catch (error) {
            res.status(404).json({
                success: false,
                message: error.message
            });
        }
    }
}

module.exports = new RestaurantController();
