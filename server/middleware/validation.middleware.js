/**
 * ===========================================
 * Validation Middleware
 * ===========================================
 * 
 * Request validation using express-validator
 */

const { body, param, query, validationResult } = require('express-validator');

/**
 * Handle validation errors
 */
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map(err => ({
        field: err.path,
        message: err.msg
      }))
    });
  }
  
  next();
};

/**
 * User Registration Validation
 */
const validateRegistration = [
  body('firstName')
    .trim()
    .notEmpty().withMessage('First name is required')
    .isLength({ min: 2, max: 50 }).withMessage('First name must be 2-50 characters'),
  
  body('lastName')
    .trim()
    .notEmpty().withMessage('Last name is required')
    .isLength({ min: 2, max: 50 }).withMessage('Last name must be 2-50 characters'),
  
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please provide a valid email')
    .normalizeEmail(),
  
  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/).withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number'),
  
  body('confirmPassword')
    .notEmpty().withMessage('Please confirm your password')
    .custom((value, { req }) => value === req.body.password).withMessage('Passwords do not match'),
  
  handleValidationErrors
];

/**
 * User Login Validation
 */
const validateLogin = [
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please provide a valid email'),
  
  body('password')
    .notEmpty().withMessage('Password is required'),
  
  handleValidationErrors
];

/**
 * Update Profile Validation
 */
const validateProfileUpdate = [
  body('firstName')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 }).withMessage('First name must be 2-50 characters'),
  
  body('lastName')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 }).withMessage('Last name must be 2-50 characters'),
  
  body('phone')
    .optional({ checkFalsy: true })
    .trim()
    .custom((value) => {
      if (!value || value === '') return true;
      if (!/^[\d\s\-+()]+$/.test(value)) {
        throw new Error('Please provide a valid phone number');
      }
      return true;
    }),
  
  body('bio')
    .optional()
    .trim()
    .isLength({ max: 500 }).withMessage('Bio cannot exceed 500 characters'),
  
  body('experience')
    .optional()
    .customSanitizer(value => {
      // Convert string to number if possible, or extract number from string like "3 years"
      if (typeof value === 'string') {
        const num = parseInt(value.replace(/[^0-9]/g, ''), 10);
        return isNaN(num) ? value : num;
      }
      return value;
    })
    .custom((value) => {
      if (value === undefined || value === '' || value === null) return true;
      const num = typeof value === 'number' ? value : parseInt(value, 10);
      if (isNaN(num) || num < 0 || num > 50) {
        throw new Error('Experience must be between 0 and 50 years');
      }
      return true;
    }),
  
  handleValidationErrors
];

/**
 * Password Change Validation
 */
const validatePasswordChange = [
  body('currentPassword')
    .notEmpty().withMessage('Current password is required'),
  
  body('newPassword')
    .notEmpty().withMessage('New password is required')
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/).withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number')
    .custom((value, { req }) => value !== req.body.currentPassword).withMessage('New password must be different from current password'),
  
  body('confirmPassword')
    .notEmpty().withMessage('Please confirm your new password')
    .custom((value, { req }) => value === req.body.newPassword).withMessage('Passwords do not match'),
  
  handleValidationErrors
];

/**
 * Question Validation
 */
const validateQuestion = [
  body('text')
    .trim()
    .notEmpty().withMessage('Question text is required')
    .isLength({ min: 10, max: 2000 }).withMessage('Question must be 10-2000 characters'),
  
  body('category')
    .notEmpty().withMessage('Category is required')
    .isIn(['dsa', 'web', 'ml', 'system-design', 'behavioral', 'database', 'devops', 'mobile'])
    .withMessage('Invalid category'),
  
  body('difficulty')
    .notEmpty().withMessage('Difficulty is required')
    .isIn(['easy', 'medium', 'hard', 'expert']).withMessage('Invalid difficulty level'),
  
  body('expectedAnswer')
    .optional()
    .trim()
    .isLength({ max: 5000 }).withMessage('Expected answer cannot exceed 5000 characters'),
  
  handleValidationErrors
];

/**
 * Interview Creation Validation
 */
const validateInterviewCreation = [
  body('category')
    .notEmpty().withMessage('Interview category is required')
    .isIn(['general', 'dsa', 'web', 'web-development', 'ml', 'machine-learning', 'system-design', 'behavioral', 'database', 'devops', 'mobile', 'mixed'])
    .withMessage('Invalid category'),
  
  body('difficulty')
    .optional()
    .isIn(['easy', 'medium', 'hard', 'expert']).withMessage('Invalid difficulty level'),
  
  body('totalQuestions')
    .optional()
    .isInt({ min: 1, max: 50 }).withMessage('Total questions must be between 1 and 50'),
  
  body('type')
    .optional()
    .isIn(['practice', 'timed', 'simulation', 'custom']).withMessage('Invalid interview type'),
  
  body('timeLimitMinutes')
    .optional()
    .isInt({ min: 5, max: 180 }).withMessage('Time limit must be between 5 and 180 minutes'),
  
  handleValidationErrors
];

/**
 * Answer Submission Validation
 */
const validateAnswerSubmission = [
  body('questionId')
    .notEmpty().withMessage('Question ID is required'),
  
  body('answer')
    .optional()
    .trim()
    .isLength({ max: 10000 }).withMessage('Answer cannot exceed 10000 characters'),
  
  body('answerType')
    .optional()
    .isIn(['text', 'voice', 'code']).withMessage('Invalid answer type'),
  
  body('questionIndex')
    .optional()
    .isInt({ min: 0 }).withMessage('Question index must be a non-negative integer'),
  
  handleValidationErrors
];

/**
 * MongoDB ObjectId Validation
 */
const validateObjectId = (paramName) => [
  param(paramName)
    .isMongoId().withMessage(`Invalid ${paramName} format`),
  
  handleValidationErrors
];

/**
 * Pagination Validation
 */
const validatePagination = [
  query('page')
    .optional()
    .isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  
  handleValidationErrors
];

module.exports = {
  handleValidationErrors,
  validateRegistration,
  validateLogin,
  validateProfileUpdate,
  validatePasswordChange,
  validateQuestion,
  validateInterviewCreation,
  validateAnswerSubmission,
  validateObjectId,
  validatePagination
};
