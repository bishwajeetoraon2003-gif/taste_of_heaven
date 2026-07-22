const { body } = require('express-validator');

exports.createOrderRules = [
  body('customerName').trim().notEmpty().withMessage('Customer name is required'),
  body('customerEmail').isEmail().withMessage('Valid email address is required'),
  body('items').isArray({ min: 1 }).withMessage('Order items list cannot be empty'),
  body('orderType').optional().isIn(['delivery', 'pickup']).withMessage('Order type must be delivery or pickup')
];
