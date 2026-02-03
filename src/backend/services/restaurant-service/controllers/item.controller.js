const itemService = require('../services/item.service');

// Controller cho MenuItem - Xử lý HTTP requests
class ItemController {
    // POST /categories/:categoryId/items - Tạo món ăn mới
    async createItem(req, res) {
        try {
            const { categoryId } = req.params;
            const item = await itemService.createItem(categoryId, req.body);
            res.status(201).json({
                success: true,
                message: 'Tạo món ăn thành công',
                data: item
            });
        } catch (error) {
            const statusCode = error.message.includes('Không tìm thấy') ? 404 : 400;
            res.status(statusCode).json({
                success: false,
                message: error.message
            });
        }
    }

    // GET /categories/:categoryId/items - Lấy món ăn theo danh mục
    async getItemsByCategoryId(req, res) {
        try {
            const { categoryId } = req.params;
            const items = await itemService.getItemsByCategoryId(categoryId);
            res.status(200).json({
                success: true,
                data: items
            });
        } catch (error) {
            res.status(404).json({
                success: false,
                message: error.message
            });
        }
    }

    // GET /items/:id - Lấy chi tiết món ăn
    async getItemById(req, res) {
        try {
            const { id } = req.params;
            const includeOptions = req.query.includeOptions !== 'false';

            let item;
            if (includeOptions) {
                item = await itemService.getItemWithOptions(id);
            } else {
                item = await itemService.getItemById(id);
            }

            res.status(200).json({
                success: true,
                data: item
            });
        } catch (error) {
            res.status(404).json({
                success: false,
                message: error.message
            });
        }
    }

    // PUT /items/:id - Cập nhật món ăn
    async updateItem(req, res) {
        try {
            const { id } = req.params;
            const item = await itemService.updateItem(id, req.body);
            res.status(200).json({
                success: true,
                message: 'Cập nhật món ăn thành công',
                data: item
            });
        } catch (error) {
            const statusCode = error.message.includes('Không tìm thấy') ? 404 : 400;
            res.status(statusCode).json({
                success: false,
                message: error.message
            });
        }
    }

    // DELETE /items/:id - Xóa món ăn
    async deleteItem(req, res) {
        try {
            const { id } = req.params;
            await itemService.deleteItem(id);
            res.status(200).json({
                success: true,
                message: 'Xóa món ăn thành công'
            });
        } catch (error) {
            res.status(404).json({
                success: false,
                message: error.message
            });
        }
    }
}

module.exports = new ItemController();
