const { body } = require('express-validator');

exports.registerRules = [
  body('name').trim().notEmpty().withMessage('Full name is required'),
  body('email').isEmail().withMessage('Please provide a valid email address'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
];

exports.loginRules = [
  body('email').isEmail().withMessage('Please provide a valid email address'),
  body('password').notEmpty().withMessage('Password is required')
];

exports.forgotPasswordRules = [
  body('email').isEmail().withMessage('Please provide a valid email address')
];

exports.resetPasswordRules = [
  body('token').notEmpty().withMessage('Reset token is required'),
  body('password').isLength({ min: 6 }).withMessage('New password must be at least 6 characters long')
];
