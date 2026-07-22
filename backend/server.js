const dotenv = require('dotenv');
dotenv.config();

const logger = require('./src/utils/logger');

// Catch Uncaught Exceptions
process.on('uncaughtException', err => {
  logger.error('UNCAUGHT EXCEPTION! 💥 Shutting down...', err);
  process.exit(1);
});

const app = require('./src/app');

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  logger.info(`✨ Taste of Heaven Server running in [${process.env.NODE_ENV || 'development'}] mode on port ${PORT}`);
  logger.info(`🚀 API Health Check available at http://localhost:${PORT}/health`);
  logger.info(`📋 REST Endpoints mounted under http://localhost:${PORT}/api/v1`);
});

// Catch Unhandled Rejections
process.on('unhandledRejection', err => {
  logger.error('UNHANDLED REJECTION! 💥 Shutting down gracefully...', err);
  server.close(() => {
    process.exit(1);
  });
});
