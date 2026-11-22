const { body, param, query, validationResult } = require('express-validator');
const { errorResponse } = require('../utils/response');

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map(err => ({
      field: err.path,
      message: err.msg,
    }));
    return errorResponse(res, 'Validation failed', 400, errorMessages);
  }
  return next();
};

const authValidations = {
  register: [
    body('name').trim().isLength({ min: 2, max: 100 }).withMessage('Name must be between 2 and 100 characters'),
    body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('phone').optional().trim(),
    body('role').optional().isIn(['customer', 'student', 'instructor', 'technician', 'content_editor']),
    validate,
  ],
  login: [
    body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
    body('password').notEmpty().withMessage('Password is required'),
    validate,
  ],
  forgotPassword: [
    body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
    validate,
  ],
  resetPassword: [
    body('token').notEmpty().withMessage('Reset token is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    validate,
  ],
};

const customerValidations = {
  create: [
    body('customerType').isIn(['individual', 'company', 'institution', 'organization']).withMessage('Invalid customer type'),
    body('name').trim().isLength({ min: 2, max: 200 }).withMessage('Name is required'),
    body('phone').trim().notEmpty().withMessage('Phone is required'),
    body('email').optional().isEmail().normalizeEmail(),
    validate,
  ],
  update: [
    body('customerType').optional().isIn(['individual', 'company', 'institution', 'organization']),
    body('name').optional().trim().isLength({ min: 2, max: 200 }),
    body('phone').optional().trim(),
    body('email').optional().isEmail().normalizeEmail(),
    validate,
  ],
};

const trainingValidations = {
  create: [
    body('name').trim().isLength({ min: 2, max: 200 }).withMessage('Course name is required'),
    body('category').isMongoId().withMessage('Valid category is required'),
    body('description').trim().isLength({ min: 10, max: 2000 }).withMessage('Description is required'),
    body('fee').isFloat({ min: 0 }).withMessage('Fee must be a positive number'),
    body('startDate').isISO8601().withMessage('Start date is required'),
    body('endDate').isISO8601().withMessage('End date is required'),
    validate,
  ],
  update: [
    body('name').optional().trim().isLength({ min: 2, max: 200 }),
    body('fee').optional().isFloat({ min: 0 }),
    body('startDate').optional().isISO8601(),
    body('endDate').optional().isISO8601(),
    validate,
  ],
};

const productValidations = {
  create: [
    body('name').trim().isLength({ min: 2, max: 200 }).withMessage('Product name is required'),
    body('category').isMongoId().withMessage('Valid category is required'),
    body('description').trim().isLength({ min: 10, max: 2000 }).withMessage('Description is required'),
    body('purchasePrice').isFloat({ min: 0 }).withMessage('Purchase price must be a positive number'),
    body('sellingPrice').isFloat({ min: 0 }).withMessage('Selling price must be a positive number'),
    validate,
  ],
  update: [
    body('name').optional().trim().isLength({ min: 2, max: 200 }),
    body('purchasePrice').optional().isFloat({ min: 0 }),
    body('sellingPrice').optional().isFloat({ min: 0 }),
    validate,
  ],
};

const paginationValidations = [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  query('search').optional().trim(),
  query('status').optional().trim(),
  query('sort').optional().trim(),
  validate,
];

const mongoIdValidation = (param = 'id') => [
  param(param).isMongoId().withMessage(`Invalid ${param} ID`),
  validate,
];

module.exports = {
  validate,
  authValidations,
  customerValidations,
  trainingValidations,
  productValidations,
  paginationValidations,
  mongoIdValidation,
};