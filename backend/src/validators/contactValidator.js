const { body } = require('express-validator');

exports.createContactRules = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email address is required'),
  body('message').trim().notEmpty().withMessage('Inquiry message is required')
];
