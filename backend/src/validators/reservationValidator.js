const { body } = require('express-validator');

exports.createReservationRules = [
  body('guestName').trim().notEmpty().withMessage('Guest name is required'),
  body('guestEmail').isEmail().withMessage('Valid email address is required'),
  body('guestPhone').notEmpty().withMessage('Phone number is required'),
  body('guestsCount').isInt({ min: 1, max: 20 }).withMessage('Guest count must be between 1 and 20'),
  body('reservationDate').notEmpty().withMessage('Reservation date is required'),
  body('reservationTime').notEmpty().withMessage('Reservation time is required')
];
