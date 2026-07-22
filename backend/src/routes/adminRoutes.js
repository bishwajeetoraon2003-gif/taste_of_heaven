const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { protect, restrictTo } = require('../middlewares/authMiddleware');

router.use(protect, restrictTo('admin'));
router.get('/stats', adminController.getDashboardStats);

module.exports = router;
