const orderService = require('../services/order.service');

/**
 * POST /orders - Tạo đơn hàng. Body: { userId }.
 */
exports.createOrder = async (req, res) => {
    try {
        const userId = req.body.userId;
        const order = await orderService.createOrder(userId);
        res.status(201).json(order);
    } catch (err) {
        if (err.code === 'CART_INVALID') {
            return res.status(400).json({
                error: err.message,
                itemsToFix: err.itemsToFix || []
            });
        }
        if (err.message && (err.message.includes('Cart not found') || err.message.includes('Cart is empty'))) {
            return res.status(400).json({ error: err.message });
        }
        res.status(500).json({ error: err.message });
    }
};

/**
 * GET /orders/:orderId - Xem chi tiết đơn hàng (2.1).
 */
exports.getOrderById = async (req, res) => {
    try {
        const orderId = parseInt(req.params.orderId, 10);
        const order = await orderService.getOrderById(orderId);
        res.json(order);
    } catch (err) {
        if (err.message === 'Order not found') {
            return res.status(404).json({ error: err.message });
        }
        res.status(500).json({ error: err.message });
    }
};

/**
 * GET /orders - Danh sách đơn hàng (2.2). Query: userId (bắt buộc), status (tùy chọn).
 */
exports.listOrders = async (req, res) => {
    try {
        const userId = req.query.userId;
        const status = req.query.status || null;
        const limit = parseInt(req.query.limit, 10) || 50;
        const orders = await orderService.getOrders(userId, status, limit);
        res.json(orders);
    } catch (err) {
        if (err.message === 'UserId is required') {
            return res.status(400).json({ error: err.message });
        }
        res.status(500).json({ error: err.message });
    }
};

/**
 * GET /orders/user/:userId - Danh sách đơn theo userId (tương thích).
 */
exports.getOrdersByUserId = async (req, res) => {
    try {
        const userId = req.params.userId;
        const orders = await orderService.getOrdersByUserId(userId);
        res.json(orders);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

/**
 * POST /orders/:orderId/pay - Thanh toán đơn hàng (3).
 */
exports.payOrder = async (req, res) => {
    try {
        const orderId = parseInt(req.params.orderId, 10);
        const order = await orderService.payOrder(orderId);
        res.json(order);
    } catch (err) {
        if (err.message === 'Order not found') {
            return res.status(404).json({ error: err.message });
        }
        if (err.code === 'PAYMENT_FAILED') {
            return res.status(402).json({ error: err.message, code: 'PAYMENT_FAILED' });
        }
        if (err.message && err.message.includes('cannot be paid')) {
            return res.status(400).json({ error: err.message });
        }
        res.status(500).json({ error: err.message });
    }
};

/**
 * POST /orders/:orderId/confirm - Xác nhận đơn hàng (4).
 */
exports.confirmOrder = async (req, res) => {
    try {
        const orderId = parseInt(req.params.orderId, 10);
        const order = await orderService.confirmOrder(orderId);
        res.json(order);
    } catch (err) {
        if (err.message === 'Order not found') {
            return res.status(404).json({ error: err.message });
        }
        if (err.message && err.message.includes('can only be confirmed')) {
            return res.status(400).json({ error: err.message });
        }
        res.status(500).json({ error: err.message });
    }
};

/**
 * PUT /orders/:orderId/status - Cập nhật trạng thái (5). Body: { status }.
 */
exports.updateOrderStatus = async (req, res) => {
    try {
        const orderId = parseInt(req.params.orderId, 10);
        const { status } = req.body;
        if (!status) {
            return res.status(400).json({ error: 'status is required' });
        }
        const order = await orderService.updateOrderStatus(orderId, status);
        res.json(order);
    } catch (err) {
        if (err.message === 'Order not found') {
            return res.status(404).json({ error: err.message });
        }
        if (err.message && err.message.includes('Invalid status transition')) {
            return res.status(400).json({ error: err.message });
        }
        res.status(500).json({ error: err.message });
    }
};

/**
 * POST /orders/:orderId/cancel - Huỷ đơn hàng (6).
 */
exports.cancelOrder = async (req, res) => {
    try {
        const orderId = parseInt(req.params.orderId, 10);
        const order = await orderService.cancelOrder(orderId);
        res.json(order);
    } catch (err) {
        if (err.message === 'Order not found') {
            return res.status(404).json({ error: err.message });
        }
        if (err.message && err.message.includes('cannot be cancelled')) {
            return res.status(400).json({ error: err.message });
        }
        res.status(500).json({ error: err.message });
    }
};
