const restaurantRepository = require('../repositories/restaurant.repository');

// Service cho Restaurant - Xử lý business logic
class RestaurantService {
    // Tạo nhà hàng mới
    async createRestaurant(data) {
        // Validate dữ liệu đầu vào
        if (!data.name || data.name.trim() === '') {
            throw new Error('Tên nhà hàng là bắt buộc');
        }

        return await restaurantRepository.create(data);
    }

    // Lấy danh sách nhà hàng với phân trang
    async getAllRestaurants(options) {
        return await restaurantRepository.findAll(options);
    }

    // Lấy thông tin chi tiết nhà hàng
    async getRestaurantById(id) {
        const restaurant = await restaurantRepository.findById(id);
        if (!restaurant) {
            throw new Error('Không tìm thấy nhà hàng');
        }
        return restaurant;
    }

    // Lấy nhà hàng với đầy đủ menu
    async getRestaurantWithMenu(id) {
        const restaurant = await restaurantRepository.findByIdWithMenu(id);
        if (!restaurant) {
            throw new Error('Không tìm thấy nhà hàng');
        }
        return restaurant;
    }

    // Cập nhật thông tin nhà hàng
    async updateRestaurant(id, data) {
        // Không cho phép thay đổi id
        delete data.id;

        const restaurant = await restaurantRepository.update(id, data);
        if (!restaurant) {
            throw new Error('Không tìm thấy nhà hàng');
        }
        return restaurant;
    }

    // Xóa nhà hàng
    async deleteRestaurant(id) {
        const success = await restaurantRepository.delete(id);
        if (!success) {
            throw new Error('Không tìm thấy nhà hàng');
        }
        return true;
    }
}

module.exports = new RestaurantService();
