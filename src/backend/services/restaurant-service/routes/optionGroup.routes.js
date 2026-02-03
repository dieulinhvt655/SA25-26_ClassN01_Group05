const express = require('express');
const router = express.Router();
const optionGroupController = require('../controllers/optionGroup.controller');

// Routes cho OptionGroup
// GET /items/:itemId/option-groups - Lấy nhóm tùy chọn theo món ăn
router.get('/items/:itemId/option-groups', optionGroupController.getOptionGroupsByItemId);

// POST /items/:itemId/option-groups - Tạo nhóm tùy chọn mới
router.post('/items/:itemId/option-groups', optionGroupController.createOptionGroup);

// PUT /option-groups/:id - Cập nhật nhóm tùy chọn
router.put('/option-groups/:id', optionGroupController.updateOptionGroup);

// DELETE /option-groups/:id - Xóa nhóm tùy chọn
router.delete('/option-groups/:id', optionGroupController.deleteOptionGroup);

module.exports = router;
