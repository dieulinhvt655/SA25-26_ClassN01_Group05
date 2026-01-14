const categoryRepository = require('../repositories/category.repository');
const { NotFoundError, DatabaseError, ValidationError, ConflictError } = require('../utils/errors');

class CategoryService {
    async createCategory(name, description, imageUrl) {
        try {
            // Check for duplicate name
            const existing = await categoryRepository.findByName(name);
            if (existing) {
                throw new ConflictError('Danh mục với tên này đã tồn tại');
            }

            return await categoryRepository.create(name, description, imageUrl);
        } catch (error) {
            if (error.isOperational) {
                throw error;
            }
            if (error.name === 'SequelizeValidationError') {
                const details = error.errors.map(err => ({
                    field: err.path,
                    message: err.message,
                    value: err.value
                }));
                throw new ValidationError('Validation failed', details);
            }
            if (error.name && error.name.startsWith('Sequelize')) {
                throw new DatabaseError('Database operation failed: ' + error.message);
            }
            throw new DatabaseError('Failed to create category: ' + error.message);
        }
    }

    async getAllCategories() {
        try {
            return await categoryRepository.findAll();
        } catch (error) {
            throw new DatabaseError('Failed to retrieve categories: ' + error.message);
        }
    }

    async getCategoryById(id) {
        try {
            const category = await categoryRepository.findById(id);
            if (!category) {
                throw new NotFoundError('Category');
            }
            return category;
        } catch (error) {
            if (error instanceof NotFoundError) {
                throw error;
            }
            throw new DatabaseError('Failed to retrieve category: ' + error.message);
        }
    }

    async updateCategory(id, name, description, imageUrl) {
        try {
            // Check if category exists
            const existing = await categoryRepository.findById(id);
            if (!existing) {
                throw new NotFoundError('Category');
            }

            // Check for duplicate name if name is being updated
            if (name !== undefined && name !== existing.name) {
                const duplicate = await categoryRepository.findByName(name);
                if (duplicate) {
                    throw new ConflictError('Danh mục với tên này đã tồn tại');
                }
            }

            const category = await categoryRepository.update(id, name, description, imageUrl);
            return category;
        } catch (error) {
            if (error instanceof NotFoundError || error instanceof ConflictError) {
                throw error;
            }
            if (error.name === 'SequelizeValidationError') {
                const details = error.errors.map(err => ({
                    field: err.path,
                    message: err.message,
                    value: err.value
                }));
                throw new ValidationError('Validation failed', details);
            }
            if (error.isOperational) {
                throw error;
            }
            if (error.name && error.name.startsWith('Sequelize')) {
                throw new DatabaseError('Database operation failed: ' + error.message);
            }
            throw new DatabaseError('Failed to update category: ' + error.message);
        }
    }

    async deleteCategory(id) {
        try {
            const success = await categoryRepository.delete(id);
            if (!success) {
                throw new NotFoundError('Category');
            }
            return success;
        } catch (error) {
            if (error instanceof NotFoundError) {
                throw error;
            }
            throw new DatabaseError('Failed to delete category: ' + error.message);
        }
    }
}

module.exports = new CategoryService();
