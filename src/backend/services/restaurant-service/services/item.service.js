const itemRepository = require('../repositories/item.repository');
const categoryRepository = require('../repositories/category.repository');

// Service cho MenuItem - Xử lý business logic cho món ăn
class ItemService {
    // Tạo món ăn mới cho danh mục
    async createItem(categoryId, data) {
        // Kiểm tra danh mục tồn tại
        const category = await categoryRepository.findById(categoryId);
        if (!category) {
            throw new Error('Không tìm thấy danh mục');
        }

        // DEBUG: Log dữ liệu nhận được
        console.log('=== DEBUG createItem ===');
        console.log('categoryId:', categoryId);
        console.log('data received:', data);
        console.log('data.name:', data.name);
        console.log('typeof data:', typeof data);
        console.log('========================');

        // Validate dữ liệu
        if (!data.name || data.name.trim() === '') {
            throw new Error('Tên món ăn là bắt buộc');
        }
        if (data.basePrice === undefined || data.basePrice < 0) {
            throw new Error('Giá món ăn phải >= 0');
        }

        return await itemRepository.create({
            ...data,
            categoryId
        });
    }

    // Lấy tất cả món ăn của danh mục
    async getItemsByCategoryId(categoryId) {
        // Kiểm tra danh mục tồn tại
        const category = await categoryRepository.findById(categoryId);
        if (!category) {
            throw new Error('Không tìm thấy danh mục');
        }

        return await itemRepository.findByCategoryId(categoryId);
    }

    // Lấy món ăn theo ID
    async getItemById(id) {
        const item = await itemRepository.findById(id);
        if (!item) {
            throw new Error('Không tìm thấy món ăn');
        }
        return item;
    }

    // Lấy món ăn với đầy đủ options
    async getItemWithOptions(id) {
        const item = await itemRepository.findByIdWithOptions(id);
        if (!item) {
            throw new Error('Không tìm thấy món ăn');
        }
        return item;
    }

    // Cập nhật món ăn
    async updateItem(id, data) {
        delete data.id;
        delete data.categoryId; // Không cho phép thay đổi danh mục

        // Validate giá nếu có
        if (data.basePrice !== undefined && data.basePrice < 0) {
            throw new Error('Giá món ăn phải >= 0');
        }

        const item = await itemRepository.update(id, data);
        if (!item) {
            throw new Error('Không tìm thấy món ăn');
        }
        return item;
    }

    // Xóa món ăn
    async deleteItem(id) {
        const success = await itemRepository.delete(id);
        if (!success) {
            throw new Error('Không tìm thấy món ăn');
        }
        return true;
    }
}

module.exports = new ItemService();
