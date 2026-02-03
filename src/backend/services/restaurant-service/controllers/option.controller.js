const optionService = require('../services/option.service');

// Controller cho Option - Xử lý HTTP requests
class OptionController {
    // POST /option-groups/:groupId/options - Tạo tùy chọn mới
    async createOption(req, res) {
        try {
            const { groupId } = req.params;
            const option = await optionService.createOption(groupId, req.body);
            res.status(201).json({
                success: true,
                message: 'Tạo tùy chọn thành công',
                data: option
            });
        } catch (error) {
            const statusCode = error.message.includes('Không tìm thấy') ? 404 : 400;
            res.status(statusCode).json({
                success: false,
                message: error.message
            });
        }
    }

    // GET /option-groups/:groupId/options - Lấy tùy chọn theo nhóm
    async getOptionsByOptionGroupId(req, res) {
        try {
            const { groupId } = req.params;
            const options = await optionService.getOptionsByOptionGroupId(groupId);
            res.status(200).json({
                success: true,
                data: options
            });
        } catch (error) {
            res.status(404).json({
                success: false,
                message: error.message
            });
        }
    }

    // PUT /options/:id - Cập nhật tùy chọn
    async updateOption(req, res) {
        try {
            const { id } = req.params;
            const option = await optionService.updateOption(id, req.body);
            res.status(200).json({
                success: true,
                message: 'Cập nhật tùy chọn thành công',
                data: option
            });
        } catch (error) {
            const statusCode = error.message.includes('Không tìm thấy') ? 404 : 400;
            res.status(statusCode).json({
                success: false,
                message: error.message
            });
        }
    }

    // DELETE /options/:id - Xóa tùy chọn
    async deleteOption(req, res) {
        try {
            const { id } = req.params;
            await optionService.deleteOption(id);
            res.status(200).json({
                success: true,
                message: 'Xóa tùy chọn thành công'
            });
        } catch (error) {
            res.status(404).json({
                success: false,
                message: error.message
            });
        }
    }
}

module.exports = new OptionController();
