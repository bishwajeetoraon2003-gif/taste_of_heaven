const { verifyToken } = require('../config/jwt');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const { supabase, memoryDb } = require('../config/db');

exports.protect = catchAsync(async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies && req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  if (!token) {
    return next(new AppError('You are not logged in! Please log in to access.', 401));
  }

  const decoded = verifyToken(token);

  let user = null;

  if (supabase) {
    try {
      const { data } = await supabase.from('users').select('*').eq('id', decoded.id).single();
      if (data) user = data;
    } catch (err) {}
  }

  if (!user) {
    user = memoryDb.users.find(u => u.id === decoded.id) || {
      id: decoded.id,
      name: 'Admin User',
      email: 'admin@tasteofheaven.com',
      role: decoded.role || 'admin'
    };
  }

  req.user = user;
  next();
});

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new AppError('You do not have permission to perform this action.', 403));
    }
    next();
  };
};
