const optionGroupService = require('../services/optionGroup.service');

// Controller cho OptionGroup - Xử lý HTTP requests
class OptionGroupController {
    // POST /items/:itemId/option-groups - Tạo nhóm tùy chọn mới
    async createOptionGroup(req, res) {
        try {
            const { itemId } = req.params;
            const optionGroup = await optionGroupService.createOptionGroup(itemId, req.body);
            res.status(201).json({
                success: true,
                message: 'Tạo nhóm tùy chọn thành công',
                data: optionGroup
            });
        } catch (error) {
            const statusCode = error.message.includes('Không tìm thấy') ? 404 : 400;
            res.status(statusCode).json({
                success: false,
                message: error.message
            });
        }
    }

    // GET /items/:itemId/option-groups - Lấy nhóm tùy chọn theo món ăn
    async getOptionGroupsByItemId(req, res) {
        try {
            const { itemId } = req.params;
            const optionGroups = await optionGroupService.getOptionGroupsByItemId(itemId);
            res.status(200).json({
                success: true,
                data: optionGroups
            });
        } catch (error) {
            res.status(404).json({
                success: false,
                message: error.message
            });
        }
    }

    // PUT /option-groups/:id - Cập nhật nhóm tùy chọn
    async updateOptionGroup(req, res) {
        try {
            const { id } = req.params;
            const optionGroup = await optionGroupService.updateOptionGroup(id, req.body);
            res.status(200).json({
                success: true,
                message: 'Cập nhật nhóm tùy chọn thành công',
                data: optionGroup
            });
        } catch (error) {
            const statusCode = error.message.includes('Không tìm thấy') ? 404 : 400;
            res.status(statusCode).json({
                success: false,
                message: error.message
            });
        }
    }

    // DELETE /option-groups/:id - Xóa nhóm tùy chọn
    async deleteOptionGroup(req, res) {
        try {
            const { id } = req.params;
            await optionGroupService.deleteOptionGroup(id);
            res.status(200).json({
                success: true,
                message: 'Xóa nhóm tùy chọn thành công'
            });
        } catch (error) {
            res.status(404).json({
                success: false,
                message: error.message
            });
        }
    }
}

module.exports = new OptionGroupController();
