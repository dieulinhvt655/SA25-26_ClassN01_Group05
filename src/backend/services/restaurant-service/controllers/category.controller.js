const categoryService = require('../services/category.service');

// Controller cho MenuCategory - Xử lý HTTP requests
class CategoryController {
    // POST /restaurants/:restaurantId/categories - Tạo danh mục mới
    async createCategory(req, res) {
        try {
            const { restaurantId } = req.params;
            const category = await categoryService.createCategory(restaurantId, req.body);
            res.status(201).json({
                success: true,
                message: 'Tạo danh mục thành công',
                data: category
            });
        } catch (error) {
            const statusCode = error.message.includes('Không tìm thấy') ? 404 : 400;
            res.status(statusCode).json({
                success: false,
                message: error.message
            });
        }
    }

    // GET /restaurants/:restaurantId/categories - Lấy danh mục theo nhà hàng
    async getCategoriesByRestaurantId(req, res) {
        try {
            const { restaurantId } = req.params;
            const categories = await categoryService.getCategoriesByRestaurantId(restaurantId);
            res.status(200).json({
                success: true,
                data: categories
            });
        } catch (error) {
            res.status(404).json({
                success: false,
                message: error.message
            });
        }
    }

    // PUT /categories/:id - Cập nhật danh mục
    async updateCategory(req, res) {
        try {
            const { id } = req.params;
            const category = await categoryService.updateCategory(id, req.body);
            res.status(200).json({
                success: true,
                message: 'Cập nhật danh mục thành công',
                data: category
            });
        } catch (error) {
            res.status(404).json({
                success: false,
                message: error.message
            });
        }
    }

    // DELETE /categories/:id - Xóa danh mục
    async deleteCategory(req, res) {
        try {
            const { id } = req.params;
            await categoryService.deleteCategory(id);
            res.status(200).json({
                success: true,
                message: 'Xóa danh mục thành công'
            });
        } catch (error) {
            res.status(404).json({
                success: false,
                message: error.message
            });
        }
    }
}

module.exports = new CategoryController();
