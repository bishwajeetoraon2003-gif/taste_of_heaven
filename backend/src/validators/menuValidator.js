const { body } = require('express-validator');

exports.createMenuRules = [
  body('title').trim().notEmpty().withMessage('Menu title is required'),
  body('category').isIn(['starters', 'mains', 'specials', 'desserts', 'cocktails']).withMessage('Category must be starters, mains, specials, desserts, or cocktails'),
  body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('description').trim().notEmpty().withMessage('Description is required')
];
