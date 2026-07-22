const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { protect } = require('../middlewares/authMiddleware');
const validate = require('../middlewares/validateMiddleware');
const { authLimiter } = require('../middlewares/rateLimiter');
const { registerRules, loginRules, forgotPasswordRules, resetPasswordRules } = require('../validators/authValidator');

router.post('/register', authLimiter, registerRules, validate, authController.register);
router.post('/login', authLimiter, loginRules, validate, authController.login);
router.get('/profile', protect, authController.getProfile);
router.post('/forgot-password', forgotPasswordRules, validate, authController.forgotPassword);
router.post('/reset-password', resetPasswordRules, validate, authController.resetPassword);

module.exports = router;
