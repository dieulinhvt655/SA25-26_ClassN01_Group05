const categoryRepository = require('../repositories/category.repository');
const restaurantRepository = require('../repositories/restaurant.repository');

// Service cho MenuCategory - Xử lý business logic cho danh mục
class CategoryService {
    // Tạo danh mục mới cho nhà hàng
    async createCategory(restaurantId, data) {
        // Kiểm tra nhà hàng tồn tại
        const restaurant = await restaurantRepository.findById(restaurantId);
        if (!restaurant) {
            throw new Error('Không tìm thấy nhà hàng');
        }

        // Validate dữ liệu
        if (!data.name || data.name.trim() === '') {
            throw new Error('Tên danh mục là bắt buộc');
        }

        return await categoryRepository.create({
            ...data,
            restaurantId
        });
    }

    // Lấy tất cả danh mục của nhà hàng
    async getCategoriesByRestaurantId(restaurantId) {
        // Kiểm tra nhà hàng tồn tại
        const restaurant = await restaurantRepository.findById(restaurantId);
        if (!restaurant) {
            throw new Error('Không tìm thấy nhà hàng');
        }

        return await categoryRepository.findByRestaurantId(restaurantId);
    }

    // Lấy danh mục theo ID
    async getCategoryById(id) {
        const category = await categoryRepository.findById(id);
        if (!category) {
            throw new Error('Không tìm thấy danh mục');
        }
        return category;
    }

    // Lấy danh mục với các món ăn
    async getCategoryWithItems(id) {
        const category = await categoryRepository.findByIdWithItems(id);
        if (!category) {
            throw new Error('Không tìm thấy danh mục');
        }
        return category;
    }

    // Cập nhật danh mục
    async updateCategory(id, data) {
        delete data.id;
        delete data.restaurantId; // Không cho phép thay đổi nhà hàng

        const category = await categoryRepository.update(id, data);
        if (!category) {
            throw new Error('Không tìm thấy danh mục');
        }
        return category;
    }

    // Xóa danh mục
    async deleteCategory(id) {
        const success = await categoryRepository.delete(id);
        if (!success) {
            throw new Error('Không tìm thấy danh mục');
        }
        return true;
    }
}

module.exports = new CategoryService();
