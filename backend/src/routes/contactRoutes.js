const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contactController');
const { protect, restrictTo } = require('../middlewares/authMiddleware');
const validate = require('../middlewares/validateMiddleware');
const { createContactRules } = require('../validators/contactValidator');

router.post('/', createContactRules, validate, contactController.submitContactInquiry);

// Admin protected route
router.use(protect, restrictTo('admin'));
router.get('/', contactController.getAllInquiries);

module.exports = router;
