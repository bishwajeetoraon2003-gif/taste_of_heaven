const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');

const authRoutes = require('./routes/authRoutes');
const menuRoutes = require('./routes/menuRoutes');
const reservationRoutes = require('./routes/reservationRoutes');
const orderRoutes = require('./routes/orderRoutes');
const contactRoutes = require('./routes/contactRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const adminRoutes = require('./routes/adminRoutes');

const { globalLimiter } = require('./middlewares/rateLimiter');
const errorMiddleware = require('./middlewares/errorMiddleware');
const AppError = require('./utils/appError');

const app = express();

// Security HTTP headers
app.use(helmet());

// CORS configuration
app.use(cors({
  origin: '*',
  credentials: true
}));

// Request Logger
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Global Rate Limiter
app.use('/api', globalLimiter);

// Body Parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health Check Endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'Taste of Heaven Backend API'
  });
});

// API Routes Mount
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/menu', menuRoutes);
app.use('/api/v1/reservations', reservationRoutes);
app.use('/api/v1/orders', orderRoutes);
app.use('/api/v1/contact', contactRoutes);
app.use('/api/v1/upload', uploadRoutes);
app.use('/api/v1/admin', adminRoutes);

// Unhandled Route Handler
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// Global Error Handling Middleware
app.use(errorMiddleware);

module.exports = app;
