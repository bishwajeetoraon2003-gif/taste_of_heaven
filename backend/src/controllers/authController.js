const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const { supabase, memoryDb } = require('../config/db');
const { signToken } = require('../config/jwt');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const sendEmail = require('../utils/email');

const createSendToken = (user, statusCode, res, source = 'local') => {
  const token = signToken(user.id, user.role);
  user.password_hash = undefined;

  res.status(statusCode).json({
    status: 'success',
    source,
    token,
    data: { user }
  });
};

exports.register = catchAsync(async (req, res, next) => {
  const { name, email, password, role } = req.body;

  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(password, salt);
  const userRole = role === 'admin' ? 'admin' : (role === 'staff' ? 'staff' : 'customer');

  // Supabase Table Integration
  if (supabase) {
    // Check existing
    const { data: existingUser } = await supabase.from('users').select('id').eq('email', email).single();
    if (existingUser) {
      return next(new AppError('Email is already registered!', 400));
    }

    const { data, error } = await supabase.from('users').insert([{
      name,
      email,
      password_hash: passwordHash,
      role: userRole,
      is_confirmed: true
    }]).select().single();

    if (!error && data) {
      sendEmail({
        email,
        subject: 'Welcome to Taste of Heaven',
        message: `Dear ${name}, welcome to Taste of Heaven.`
      }).catch(() => {});

      return createSendToken(data, 201, res, 'supabase');
    }
  }

  // Memory Fallback
  const existing = memoryDb.users.find(u => u.email === email);
  if (existing) {
    return next(new AppError('Email is already registered!', 400));
  }

  const newUser = {
    id: `user-${Date.now()}`,
    name,
    email,
    password_hash: passwordHash,
    role: userRole,
    is_confirmed: true,
    created_at: new Date().toISOString()
  };

  memoryDb.users.push(newUser);

  sendEmail({
    email,
    subject: 'Welcome to Taste of Heaven',
    message: `Dear ${name}, welcome to Taste of Heaven.`
  }).catch(() => {});

  createSendToken(newUser, 201, res, 'memory');
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // Default Admin bypass for demo testing
  if (email === 'admin@tasteofheaven.com' && password === 'admin123') {
    const adminUser = {
      id: 'admin-001',
      name: 'Executive Admin Antoine',
      email: 'admin@tasteofheaven.com',
      role: 'admin'
    };
    return createSendToken(adminUser, 200, res, 'system');
  }

  if (supabase) {
    const { data: user, error } = await supabase.from('users').select('*').eq('email', email).single();
    if (user && (await bcrypt.compare(password, user.password_hash))) {
      return createSendToken(user, 200, res, 'supabase');
    }
  }

  const user = memoryDb.users.find(u => u.email === email);
  if (!user || !(await bcrypt.compare(password, user.password_hash))) {
    return next(new AppError('Incorrect email or password', 401));
  }

  createSendToken(user, 200, res, 'memory');
});

exports.getProfile = catchAsync(async (req, res, next) => {
  res.status(200).json({
    status: 'success',
    data: { user: req.user }
  });
});

exports.forgotPassword = catchAsync(async (req, res, next) => {
  const { email } = req.body;
  let user = null;

  if (supabase) {
    const { data } = await supabase.from('users').select('*').eq('email', email).single();
    user = data;
  }
  if (!user) user = memoryDb.users.find(u => u.email === email);

  if (!user) return next(new AppError('There is no user with that email address.', 404));

  const resetToken = crypto.randomBytes(32).toString('hex');
  const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

  if (supabase) {
    await supabase.from('users').update({
      reset_password_token: hashedToken,
      reset_password_expires: new Date(Date.now() + 10 * 60 * 1000).toISOString()
    }).eq('id', user.id);
  } else {
    user.reset_password_token = hashedToken;
    user.reset_password_expires = Date.now() + 10 * 60 * 1000;
  }

  await sendEmail({
    email: user.email,
    subject: 'Taste of Heaven - Password Reset Request',
    message: `You requested a password reset. Please use token: ${resetToken}`
  });

  res.status(200).json({
    status: 'success',
    message: 'Password reset token sent to email!'
  });
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  const { token, password } = req.body;
  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
  const salt = await bcrypt.genSalt(10);
  const newHash = await bcrypt.hash(password, salt);

  if (supabase) {
    const { data: user } = await supabase.from('users').select('*').eq('reset_password_token', hashedToken).single();
    if (user) {
      const { data: updatedUser } = await supabase.from('users').update({
        password_hash: newHash,
        reset_password_token: null,
        reset_password_expires: null
      }).eq('id', user.id).select().single();

      return createSendToken(updatedUser, 200, res, 'supabase');
    }
  }

  const user = memoryDb.users.find(u => u.reset_password_token === hashedToken);
  if (!user) return next(new AppError('Token is invalid or has expired', 400));

  user.password_hash = newHash;
  user.reset_password_token = undefined;
  user.reset_password_expires = undefined;

  createSendToken(user, 200, res, 'memory');
});
