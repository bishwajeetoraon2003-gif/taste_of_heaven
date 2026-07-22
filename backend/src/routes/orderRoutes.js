const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { protect, restrictTo } = require('../middlewares/authMiddleware');
const validate = require('../middlewares/validateMiddleware');
const { createOrderRules } = require('../validators/orderValidator');

router.post('/', createOrderRules, validate, orderController.createOrder);
router.post('/create-razorpay-order', orderController.createRazorpayOrder);
router.post('/verify-razorpay-payment', orderController.verifyRazorpayPayment);

// Protected Admin / Staff routes
router.use(protect, restrictTo('admin', 'staff'));
router.get('/', orderController.getAllOrders);
router.patch('/:id/status', orderController.updateOrderStatus);

module.exports = router;
