const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/payment.controller');

router.get('/:orderId', paymentController.getPaymentStatus);
router.post('/initiate', paymentController.initiatePayment);

module.exports = router;
