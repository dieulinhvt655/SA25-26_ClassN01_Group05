const cartService = require('../services/cart.service');

/**
 * Tạo giỏ hàng. Chỉ nhận request, gọi service, trả response.
 */
exports.createCart = async (req, res) => {
    try {
        const userId = req.body.userId;
        const cart = await cartService.createCart(userId);
        res.status(201).json(cart);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

/**
 * 4.2 Thêm món vào giỏ. Chỉ nhận request, gọi service, trả response.
 */
exports.addItemToCart = async (req, res) => {
    try {
        const userId = req.body.userId;
        // foodId là UUID (string) từ restaurant-service, không ép kiểu số
        const foodId = req.body.foodId;
        const quantity = parseInt(req.body.quantity, 10) || 1;
        const cart = await cartService.addItemToCart(userId, foodId, quantity);
        res.status(201).json(cart);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

/**
 * 4.5 Xem giỏ hàng. Chỉ nhận request, gọi service, trả response.
 */
exports.getCartByUserId = async (req, res) => {
    try {
        const userId = req.params.userId;
        const cart = await cartService.getCartByUserId(userId);
        res.json(cart);
    } catch (err) {
        res.status(404).json({ error: err.message });
    }
};

/**
 * 4.3 Cập nhật số lượng món. Chỉ nhận request, gọi service, trả response.
 */
exports.updateItemQuantity = async (req, res) => {
    try {
        const userId = req.body.userId;
        // foodId là UUID (string) từ restaurant-service
        const foodId = req.params.foodId;
        const quantity = parseInt(req.body.quantity, 10);
        const cart = await cartService.updateItemQuantity(userId, foodId, quantity);
        res.json(cart);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

/**
 * 4.4 Xoá món khỏi giỏ. Chỉ nhận request, gọi service, trả response.
 */
exports.removeItemFromCart = async (req, res) => {
    try {
        const userId = req.body.userId;
        // foodId là UUID (string) từ restaurant-service
        const foodId = req.params.foodId;
        const cart = await cartService.removeItemFromCart(userId, foodId);
        res.json(cart);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

/**
 * 4.6 Kiểm tra giỏ trước khi đặt hàng (Validate Cart). Chỉ nhận request, gọi service, trả response.
 */
exports.validateCart = async (req, res) => {
    try {
        const userId = req.body.userId;
        const result = await cartService.validateCart(userId);
        res.json(result);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

/**
 * 4.7 Đóng giỏ sau khi checkout. Chỉ nhận request, gọi service, trả response.
 */
exports.checkoutCart = async (req, res) => {
    try {
        const userId = req.body.userId;
        const cart = await cartService.checkoutCart(userId);
        res.json(cart);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};
