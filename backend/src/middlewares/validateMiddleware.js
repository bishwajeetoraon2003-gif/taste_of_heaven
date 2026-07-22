const { validationResult } = require('express-validator');
const AppError = require('../utils/appError');

module.exports = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map(err => err.msg).join('; ');
    return next(new AppError(`Validation Error: ${errorMessages}`, 400));
  }
  next();
};
