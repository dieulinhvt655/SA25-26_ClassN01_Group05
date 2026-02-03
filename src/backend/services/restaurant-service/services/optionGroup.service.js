const optionGroupRepository = require('../repositories/optionGroup.repository');
const itemRepository = require('../repositories/item.repository');

// Service cho OptionGroup - Xử lý business logic cho nhóm tùy chọn
class OptionGroupService {
    // Tạo nhóm tùy chọn mới cho món ăn
    async createOptionGroup(itemId, data) {
        // Kiểm tra món ăn tồn tại
        const item = await itemRepository.findById(itemId);
        if (!item) {
            throw new Error('Không tìm thấy món ăn');
        }

        // Validate dữ liệu
        if (!data.name || data.name.trim() === '') {
            throw new Error('Tên nhóm tùy chọn là bắt buộc');
        }

        // Validate minSelect và maxSelect
        const minSelect = data.minSelect || 0;
        const maxSelect = data.maxSelect || 1;
        if (minSelect < 0) {
            throw new Error('minSelect phải >= 0');
        }
        if (maxSelect < 1) {
            throw new Error('maxSelect phải >= 1');
        }
        if (minSelect > maxSelect) {
            throw new Error('minSelect không được lớn hơn maxSelect');
        }

        return await optionGroupRepository.create({
            ...data,
            itemId
        });
    }

    // Lấy tất cả nhóm tùy chọn của món ăn
    async getOptionGroupsByItemId(itemId) {
        // Kiểm tra món ăn tồn tại
        const item = await itemRepository.findById(itemId);
        if (!item) {
            throw new Error('Không tìm thấy món ăn');
        }

        return await optionGroupRepository.findByItemId(itemId);
    }

    // Lấy nhóm tùy chọn theo ID
    async getOptionGroupById(id) {
        const optionGroup = await optionGroupRepository.findById(id);
        if (!optionGroup) {
            throw new Error('Không tìm thấy nhóm tùy chọn');
        }
        return optionGroup;
    }

    // Lấy nhóm tùy chọn với các options
    async getOptionGroupWithOptions(id) {
        const optionGroup = await optionGroupRepository.findByIdWithOptions(id);
        if (!optionGroup) {
            throw new Error('Không tìm thấy nhóm tùy chọn');
        }
        return optionGroup;
    }

    // Cập nhật nhóm tùy chọn
    async updateOptionGroup(id, data) {
        delete data.id;
        delete data.itemId; // Không cho phép thay đổi món ăn

        // Validate minSelect và maxSelect nếu có
        if (data.minSelect !== undefined && data.minSelect < 0) {
            throw new Error('minSelect phải >= 0');
        }
        if (data.maxSelect !== undefined && data.maxSelect < 1) {
            throw new Error('maxSelect phải >= 1');
        }

        const optionGroup = await optionGroupRepository.update(id, data);
        if (!optionGroup) {
            throw new Error('Không tìm thấy nhóm tùy chọn');
        }
        return optionGroup;
    }

    // Xóa nhóm tùy chọn
    async deleteOptionGroup(id) {
        const success = await optionGroupRepository.delete(id);
        if (!success) {
            throw new Error('Không tìm thấy nhóm tùy chọn');
        }
        return true;
    }
}

module.exports = new OptionGroupService();
