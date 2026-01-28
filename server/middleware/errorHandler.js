/**
 * ===========================================
 * Global Error Handler Middleware
 * ===========================================
 * 
 * Centralized error handling for the application.
 * Catches all errors and sends appropriate responses.
 */

/**
 * Custom Error Class
 */
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Error Handler Middleware
 */
const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log error for development
  if (process.env.NODE_ENV === 'development') {
    console.error('Error:', err);
  }

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    const message = `Resource not found with ID: ${err.value}`;
    error = new AppError(message, 404);
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    const message = `Duplicate field value entered for: ${field}. Please use another value.`;
    error = new AppError(message, 400);
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map(val => val.message);
    const message = `Validation Error: ${messages.join('. ')}`;
    error = new AppError(message, 400);
  }

  // JWT error
  if (err.name === 'JsonWebTokenError') {
    const message = 'Invalid token. Please log in again.';
    error = new AppError(message, 401);
  }

  // JWT expired error
  if (err.name === 'TokenExpiredError') {
    const message = 'Your token has expired. Please log in again.';
    error = new AppError(message, 401);
  }

  // Multer file size error
  if (err.code === 'LIMIT_FILE_SIZE') {
    const message = 'File size exceeds the maximum allowed limit.';
    error = new AppError(message, 400);
  }

  // Multer file type error
  if (err.code === 'LIMIT_UNEXPECTED_FILE') {
    const message = 'Invalid file type. Please upload a valid file.';
    error = new AppError(message, 400);
  }

  // Rate limit error
  if (err.statusCode === 429) {
    error = new AppError('Too many requests. Please try again later.', 429);
  }

  // Send response
  res.status(error.statusCode || 500).json({
    success: false,
    message: error.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && {
      stack: err.stack,
      error: err
    })
  });
};

/**
 * Async Handler - Wrap async functions to catch errors
 * @param {Function} fn - Async function to wrap
 * @returns {Function} - Wrapped function
 */
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

/**
 * Not Found Handler
 */
const notFound = (req, res, next) => {
  const error = new AppError(`Not Found - ${req.originalUrl}`, 404);
  next(error);
};

module.exports = errorHandler;
module.exports.AppError = AppError;
module.exports.asyncHandler = asyncHandler;
module.exports.notFound = notFound;
