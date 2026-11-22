const mongoose = require('mongoose');
const { errorResponse } = require('../utils/response');

const errorHandler = (err, req, res, next) => {
  console.error('Error:', err.stack || err);

  if (err.name === 'CastError') {
    return errorResponse(res, 'Resource not found', 404);
  }

  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return errorResponse(res, `${field} already exists`, 400);
  }

  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map(e => e.message);
    return errorResponse(res, 'Validation failed', 400, errors);
  }

  if (err.name === 'JsonWebTokenError') {
    return errorResponse(res, 'Invalid token', 401);
  }

  if (err.name === 'TokenExpiredError') {
    return errorResponse(res, 'Token expired', 401);
  }

  if (err instanceof mongoose.Error) {
    return errorResponse(res, 'Database error', 500, err.message);
  }

  if (err.statusCode) {
    return errorResponse(res, err.message, err.statusCode);
  }

  return errorResponse(res, err.message || 'Internal server error', 500);
};

module.exports = errorHandler;