const express = require('express');
const router = express.Router();
const reservationController = require('../controllers/reservationController');
const { protect, restrictTo } = require('../middlewares/authMiddleware');
const validate = require('../middlewares/validateMiddleware');
const { createReservationRules } = require('../validators/reservationValidator');

router.post('/', createReservationRules, validate, reservationController.createReservation);

// Admin & Staff protected routes
router.use(protect, restrictTo('admin', 'staff'));
router.get('/', reservationController.getAllReservations);
router.patch('/:id/status', reservationController.updateReservationStatus);

module.exports = router;
