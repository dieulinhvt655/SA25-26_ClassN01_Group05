const express = require('express');
const router = express.Router();
const optionController = require('../controllers/option.controller');

// Routes cho Option
// GET /option-groups/:groupId/options - Lấy tùy chọn theo nhóm
router.get('/option-groups/:groupId/options', optionController.getOptionsByOptionGroupId);

// POST /option-groups/:groupId/options - Tạo tùy chọn mới
router.post('/option-groups/:groupId/options', optionController.createOption);

// PUT /options/:id - Cập nhật tùy chọn
router.put('/options/:id', optionController.updateOption);

// DELETE /options/:id - Xóa tùy chọn
router.delete('/options/:id', optionController.deleteOption);

module.exports = router;
