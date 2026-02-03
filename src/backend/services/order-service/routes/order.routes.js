/**
 * Order Service routes. Base path tại app.js: /api/orders
 *
 * API tối thiểu:
 * POST   /api/orders              - Tạo đơn
 * GET    /api/orders              - Danh sách đơn (query: userId, status?)
 * GET    /api/orders/:orderId     - Xem đơn
 * POST   /api/orders/:orderId/pay     - Thanh toán
 * POST   /api/orders/:orderId/confirm - Xác nhận
 * POST   /api/orders/:orderId/cancel   - Huỷ
 * PUT    /api/orders/:orderId/status  - Cập nhật trạng thái
 */
const express = require('express');
const router = express.Router();
const orderController = require('../controllers/order.controller');

//Tạo đơn hàng
router.post('/', orderController.createOrder);
//Lấy danh sách các đơn hàng
router.get('/', orderController.listOrders);
//Xem chi tiết đơn hàng
router.get('/:orderId', orderController.getOrderById);
//Lấy danh sách các đơn hàng của user
router.get('/user/:userId', orderController.getOrdersByUserId);

router.post('/:orderId/pay', orderController.payOrder);
router.post('/:orderId/confirm', orderController.confirmOrder);
router.post('/:orderId/cancel', orderController.cancelOrder);
router.put('/:orderId/status', orderController.updateOrderStatus);


module.exports = router;
