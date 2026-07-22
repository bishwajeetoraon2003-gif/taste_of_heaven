const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const reservationController = require('../controllers/reservationController');
const orderController = require('../controllers/orderController');
const { protect, restrictTo } = require('../middlewares/authMiddleware');

router.use(protect, restrictTo('admin'));
router.get('/stats', adminController.getDashboardStats);
router.get('/reservations', reservationController.getAllReservations);
router.get('/orders', orderController.getAllOrders);

module.exports = router;
