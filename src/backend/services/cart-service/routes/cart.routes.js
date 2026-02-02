/**
 * Định nghĩa endpoint chi tiết cho Cart Service.
 * Base path được gắn tại app.js: /api/carts
 *
 * Endpoints (full URL = baseUrl + path):
 *
 * 1. Tạo giỏ hàng (4.1)
 *    POST   /api/carts
 *    Body:  { "userId": "string" }
 *    Response 201: { cartId, userId, status, totalAmount, totalItems, createdAt, updatedAt, items: [] }
 *
 * 2. Thêm món vào giỏ (4.2)
 *    POST   /api/carts/items
 *    Body:  { "userId": "string", "foodId": number, "quantity": number }
 *    Response 200: giỏ hàng mới nhất (Cart-service gọi Food-service lấy thông tin món)
 *
 * 3. Xem giỏ hàng (4.5)
 *    GET    /api/carts/user/:userId
 *    Response 200: { cartId, userId, status, totalAmount, totalItems, items: [{ ..., isAvailable }] }
 *
 * 4. Cập nhật số lượng món (4.3)
 *    PUT    /api/carts/items/:foodId
 *    Body:  { "userId": "string", "quantity": number }
 *    Response 200: giỏ hàng đã cập nhật
 *
 * 5. Xoá món khỏi giỏ (4.4)
 *    DELETE /api/carts/items/:foodId
 *    Body:  { "userId": "string" }
 *    Response 200: giỏ hàng mới nhất
 *
 * 6. Kiểm tra giỏ trước khi đặt hàng (4.6 Validate Cart)
 *    POST   /api/carts/validate
 *    Body:  { "userId": "string" }
 *    Response 200: { valid: boolean, itemsToFix?: [...] } (Order-service gọi)
 *
 * 7. Đóng giỏ sau khi checkout (4.7)
 *    POST   /api/carts/checkout
 *    Body:  { "userId": "string" }
 *    Response 200: cart đã cập nhật status = checked_out (Order-service thông báo thành công)
 */
const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cart.controller');

router.post('/', cartController.createCart);
router.post('/items', cartController.addItemToCart);
router.post('/validate', cartController.validateCart);
router.post('/checkout', cartController.checkoutCart);
router.get('/user/:userId', cartController.getCartByUserId);
router.put('/items/:foodId', cartController.updateItemQuantity);
router.delete('/items/:foodId', cartController.removeItemFromCart);

module.exports = router;
