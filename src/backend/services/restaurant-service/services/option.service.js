const optionRepository = require('../repositories/option.repository');
const optionGroupRepository = require('../repositories/optionGroup.repository');

// Service cho Option - Xử lý business logic cho tùy chọn
class OptionService {
    // Tạo tùy chọn mới cho nhóm tùy chọn
    async createOption(optionGroupId, data) {
        // Kiểm tra nhóm tùy chọn tồn tại
        const optionGroup = await optionGroupRepository.findById(optionGroupId);
        if (!optionGroup) {
            throw new Error('Không tìm thấy nhóm tùy chọn');
        }

        // Validate dữ liệu
        if (!data.name || data.name.trim() === '') {
            throw new Error('Tên tùy chọn là bắt buộc');
        }
        if (data.extraPrice !== undefined && data.extraPrice < 0) {
            throw new Error('Giá thêm phải >= 0');
        }

        return await optionRepository.create({
            ...data,
            optionGroupId
        });
    }

    // Lấy tất cả tùy chọn của nhóm
    async getOptionsByOptionGroupId(optionGroupId) {
        // Kiểm tra nhóm tùy chọn tồn tại
        const optionGroup = await optionGroupRepository.findById(optionGroupId);
        if (!optionGroup) {
            throw new Error('Không tìm thấy nhóm tùy chọn');
        }

        return await optionRepository.findByOptionGroupId(optionGroupId);
    }

    // Lấy tùy chọn theo ID
    async getOptionById(id) {
        const option = await optionRepository.findById(id);
        if (!option) {
            throw new Error('Không tìm thấy tùy chọn');
        }
        return option;
    }

    // Cập nhật tùy chọn
    async updateOption(id, data) {
        delete data.id;
        delete data.optionGroupId; // Không cho phép thay đổi nhóm tùy chọn

        // Validate giá nếu có
        if (data.extraPrice !== undefined && data.extraPrice < 0) {
            throw new Error('Giá thêm phải >= 0');
        }

        const option = await optionRepository.update(id, data);
        if (!option) {
            throw new Error('Không tìm thấy tùy chọn');
        }
        return option;
    }

    // Xóa tùy chọn
    async deleteOption(id) {
        const success = await optionRepository.delete(id);
        if (!success) {
            throw new Error('Không tìm thấy tùy chọn');
        }
        return true;
    }
}

module.exports = new OptionService();
