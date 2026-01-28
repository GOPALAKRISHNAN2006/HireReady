/**
 * ===========================================
 * Enhanced Admin Routes (v2)
 * ===========================================
 * 
 * Comprehensive admin API routes with full CRUD operations,
 * proper validation, rate limiting, and audit logging.
 * 
 * Route Structure:
 * - /api/admin/stats - Dashboard statistics
 * - /api/admin/activity - Recent activity feed
 * - /api/admin/analytics - System analytics
 * - /api/admin/users/* - User management
 * - /api/admin/questions/* - Question management
 * - /api/admin/interviews/* - Interview management
 * - /api/admin/aptitude/* - Aptitude question management
 * - /api/admin/gd-topics/* - Group discussion topic management
 */

const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');

// Import controllers
const dashboardController = require('../controllers/admin/dashboard.controller');
const usersController = require('../controllers/admin/users.controller');
const questionsController = require('../controllers/admin/questions.controller');
const interviewsController = require('../controllers/admin/interviews.controller');

// Import middleware
const { protect, authorize } = require('../middleware/auth.middleware');
const { asyncHandler } = require('../middleware/errorHandler');
const { validateObjectId } = require('../middleware/validation.middleware');

// Import models for routes not yet using controllers
const { AptitudeQuestion, AptitudeTest } = require('../models/Aptitude.model');
const { GDTopic, GDSession } = require('../models/GroupDiscussion.model');

// ===========================================
// Rate Limiting for Admin Routes
// ===========================================

/**
 * Stricter rate limiting for admin routes to prevent abuse
 */
const adminLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200, // 200 requests per window
  message: {
    success: false,
    message: 'Too many admin requests, please try again later.'
  }
});

/**
 * Even stricter rate limiting for sensitive operations
 */
const sensitiveOpLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 50, // 50 sensitive operations per hour
  message: {
    success: false,
    message: 'Too many sensitive operations, please try again later.'
  }
});

// ===========================================
// Middleware - Apply to all admin routes
// ===========================================

router.use(adminLimiter);
router.use(protect);
router.use(authorize('admin'));

// ===========================================
// Dashboard Routes
// ===========================================

/**
 * @route   GET /api/admin/stats
 * @desc    Get comprehensive dashboard statistics
 * @access  Private/Admin
 */
router.get('/stats', asyncHandler(dashboardController.getStats));

/**
 * @route   GET /api/admin/activity
 * @desc    Get recent activity feed
 * @access  Private/Admin
 */
router.get('/activity', asyncHandler(dashboardController.getActivity));

/**
 * @route   GET /api/admin/analytics
 * @desc    Get system analytics data
 * @access  Private/Admin
 */
router.get('/analytics', asyncHandler(dashboardController.getAnalytics));

// ===========================================
// User Management Routes
// ===========================================

/**
 * @route   GET /api/admin/users
 * @desc    Get all users with pagination and filtering
 * @access  Private/Admin
 */
router.get('/users', asyncHandler(usersController.getUsers));

/**
 * @route   GET /api/admin/users/:id
 * @desc    Get user details with analytics
 * @access  Private/Admin
 */
router.get('/users/:id', validateObjectId('id'), asyncHandler(usersController.getUserById));

/**
 * @route   GET /api/admin/users/:id/interviews
 * @desc    Get all interviews for a specific user
 * @access  Private/Admin
 */
router.get('/users/:id/interviews', validateObjectId('id'), asyncHandler(usersController.getUserInterviews));

/**
 * @route   PUT /api/admin/users/:id
 * @desc    Update user details
 * @access  Private/Admin
 */
router.put('/users/:id', validateObjectId('id'), asyncHandler(usersController.updateUser));

/**
 * @route   PUT /api/admin/users/:id/role
 * @desc    Update user role
 * @access  Private/Admin
 */
router.put('/users/:id/role', sensitiveOpLimiter, validateObjectId('id'), asyncHandler(usersController.updateUserRole));

/**
 * @route   PUT /api/admin/users/:id/ban
 * @desc    Toggle user ban status (block/unblock)
 * @access  Private/Admin
 */
router.put('/users/:id/ban', sensitiveOpLimiter, validateObjectId('id'), asyncHandler(usersController.toggleUserStatus));

/**
 * @route   DELETE /api/admin/users/:id
 * @desc    Delete user (soft or hard delete)
 * @access  Private/Admin
 * @query   permanent=true for hard delete
 */
router.delete('/users/:id', sensitiveOpLimiter, validateObjectId('id'), asyncHandler(usersController.deleteUser));

// ===========================================
// Question Management Routes
// ===========================================

/**
 * @route   GET /api/admin/questions
 * @desc    Get all questions with filtering
 * @access  Private/Admin
 */
router.get('/questions', asyncHandler(questionsController.getQuestions));

/**
 * @route   GET /api/admin/questions/stats
 * @desc    Get question statistics
 * @access  Private/Admin
 */
router.get('/questions/stats', asyncHandler(questionsController.getQuestionStats));

/**
 * @route   GET /api/admin/questions/pending
 * @desc    Get pending questions for approval
 * @access  Private/Admin
 */
router.get('/questions/pending', asyncHandler(questionsController.getPendingQuestions));

/**
 * @route   GET /api/admin/questions/:id
 * @desc    Get single question by ID
 * @access  Private/Admin
 */
router.get('/questions/:id', validateObjectId('id'), asyncHandler(questionsController.getQuestionById));

/**
 * @route   POST /api/admin/questions
 * @desc    Create a new question
 * @access  Private/Admin
 */
router.post('/questions', asyncHandler(questionsController.createQuestion));

/**
 * @route   POST /api/admin/questions/bulk
 * @desc    Bulk import questions
 * @access  Private/Admin
 */
router.post('/questions/bulk', asyncHandler(questionsController.bulkImportQuestions));

/**
 * @route   PUT /api/admin/questions/:id
 * @desc    Update a question
 * @access  Private/Admin
 */
router.put('/questions/:id', validateObjectId('id'), asyncHandler(questionsController.updateQuestion));

/**
 * @route   PUT /api/admin/questions/:id/approve
 * @desc    Approve a pending question
 * @access  Private/Admin
 */
router.put('/questions/:id/approve', validateObjectId('id'), asyncHandler(questionsController.approveQuestion));

/**
 * @route   PUT /api/admin/questions/:id/reject
 * @desc    Reject a pending question
 * @access  Private/Admin
 */
router.put('/questions/:id/reject', validateObjectId('id'), asyncHandler(questionsController.rejectQuestion));

/**
 * @route   DELETE /api/admin/questions/:id
 * @desc    Delete a question
 * @access  Private/Admin
 */
router.delete('/questions/:id', validateObjectId('id'), asyncHandler(questionsController.deleteQuestion));

// ===========================================
// Interview Management Routes
// ===========================================

/**
 * @route   GET /api/admin/interviews
 * @desc    Get all interviews with filtering
 * @access  Private/Admin
 */
router.get('/interviews', asyncHandler(interviewsController.getInterviews));

/**
 * @route   GET /api/admin/interviews/stats
 * @desc    Get interview statistics and analytics
 * @access  Private/Admin
 */
router.get('/interviews/stats', asyncHandler(interviewsController.getInterviewStats));

/**
 * @route   GET /api/admin/interviews/export
 * @desc    Export interviews data (JSON or CSV)
 * @access  Private/Admin
 */
router.get('/interviews/export', asyncHandler(interviewsController.exportInterviews));

/**
 * @route   GET /api/admin/interviews/:id
 * @desc    Get interview details
 * @access  Private/Admin
 */
router.get('/interviews/:id', validateObjectId('id'), asyncHandler(interviewsController.getInterviewById));

/**
 * @route   DELETE /api/admin/interviews/:id
 * @desc    Delete an interview
 * @access  Private/Admin
 */
router.delete('/interviews/:id', sensitiveOpLimiter, validateObjectId('id'), asyncHandler(interviewsController.deleteInterview));

// ===========================================
// Aptitude Questions Management
// ===========================================

/**
 * @route   GET /api/admin/aptitude
 * @desc    Get all aptitude questions
 * @access  Private/Admin
 */
router.get('/aptitude', asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, category, difficulty, search } = req.query;
  
  const query = {};
  if (category) query.category = category;
  if (difficulty) query.difficulty = difficulty;
  if (search) {
    query.$or = [
      { question: { $regex: search, $options: 'i' } },
      { explanation: { $regex: search, $options: 'i' } }
    ];
  }

  const skip = (parseInt(page) - 1) * parseInt(limit);

  const [questions, total] = await Promise.all([
    AptitudeQuestion.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit)),
    AptitudeQuestion.countDocuments(query)
  ]);

  res.json({
    success: true,
    data: {
      questions,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    }
  });
}));

/**
 * @route   GET /api/admin/aptitude/:id
 * @desc    Get single aptitude question
 * @access  Private/Admin
 */
router.get('/aptitude/:id', validateObjectId('id'), asyncHandler(async (req, res) => {
  const question = await AptitudeQuestion.findById(req.params.id);

  if (!question) {
    return res.status(404).json({
      success: false,
      message: 'Question not found.'
    });
  }

  res.json({
    success: true,
    data: { question }
  });
}));

/**
 * @route   POST /api/admin/aptitude
 * @desc    Create aptitude question
 * @access  Private/Admin
 */
router.post('/aptitude', asyncHandler(async (req, res) => {
  const { category, question, options, explanation, difficulty, timeLimit, points } = req.body;

  // Validation
  if (!category || !question || !options || options.length < 2) {
    return res.status(400).json({
      success: false,
      message: 'Category, question, and at least 2 options are required.'
    });
  }

  // Ensure at least one correct answer
  const hasCorrectAnswer = options.some(opt => opt.isCorrect);
  if (!hasCorrectAnswer) {
    return res.status(400).json({
      success: false,
      message: 'At least one option must be marked as correct.'
    });
  }

  const aptitudeQuestion = await AptitudeQuestion.create({
    category,
    question,
    options,
    explanation,
    difficulty: difficulty || 'medium',
    timeLimit: timeLimit || 60,
    points: points || 1,
    isActive: true
  });

  console.log(`[AUDIT] Admin ${req.user.email} created aptitude question: ${aptitudeQuestion._id}`);

  res.status(201).json({
    success: true,
    message: 'Aptitude question created successfully.',
    data: { question: aptitudeQuestion }
  });
}));

/**
 * @route   PUT /api/admin/aptitude/:id
 * @desc    Update aptitude question
 * @access  Private/Admin
 */
router.put('/aptitude/:id', validateObjectId('id'), asyncHandler(async (req, res) => {
  const question = await AptitudeQuestion.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  );

  if (!question) {
    return res.status(404).json({
      success: false,
      message: 'Question not found.'
    });
  }

  console.log(`[AUDIT] Admin ${req.user.email} updated aptitude question: ${question._id}`);

  res.json({
    success: true,
    message: 'Question updated successfully.',
    data: { question }
  });
}));

/**
 * @route   DELETE /api/admin/aptitude/:id
 * @desc    Delete aptitude question
 * @access  Private/Admin
 */
router.delete('/aptitude/:id', validateObjectId('id'), asyncHandler(async (req, res) => {
  const question = await AptitudeQuestion.findByIdAndDelete(req.params.id);

  if (!question) {
    return res.status(404).json({
      success: false,
      message: 'Question not found.'
    });
  }

  console.log(`[AUDIT] Admin ${req.user.email} deleted aptitude question: ${req.params.id}`);

  res.json({
    success: true,
    message: 'Question deleted successfully.'
  });
}));

// ===========================================
// GD Topics Management
// ===========================================

/**
 * @route   GET /api/admin/gd-topics
 * @desc    Get all GD topics
 * @access  Private/Admin
 */
router.get('/gd-topics', asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, category, difficulty, search } = req.query;
  
  const query = {};
  if (category) query.category = category;
  if (difficulty) query.difficulty = difficulty;
  if (search) {
    query.$or = [
      { title: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } }
    ];
  }

  const skip = (parseInt(page) - 1) * parseInt(limit);

  const [topics, total] = await Promise.all([
    GDTopic.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit)),
    GDTopic.countDocuments(query)
  ]);

  res.json({
    success: true,
    data: {
      topics,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    }
  });
}));

/**
 * @route   GET /api/admin/gd-topics/:id
 * @desc    Get single GD topic
 * @access  Private/Admin
 */
router.get('/gd-topics/:id', validateObjectId('id'), asyncHandler(async (req, res) => {
  const topic = await GDTopic.findById(req.params.id);

  if (!topic) {
    return res.status(404).json({
      success: false,
      message: 'Topic not found.'
    });
  }

  res.json({
    success: true,
    data: { topic }
  });
}));

/**
 * @route   POST /api/admin/gd-topics
 * @desc    Create GD topic
 * @access  Private/Admin
 */
router.post('/gd-topics', asyncHandler(async (req, res) => {
  const { title, description, category, difficulty, keyPoints, forArguments, againstArguments } = req.body;

  if (!title || !category) {
    return res.status(400).json({
      success: false,
      message: 'Title and category are required.'
    });
  }

  const topic = await GDTopic.create({
    title,
    description,
    category,
    difficulty: difficulty || 'medium',
    keyPoints: keyPoints || [],
    forArguments: forArguments || [],
    againstArguments: againstArguments || [],
    isActive: true
  });

  console.log(`[AUDIT] Admin ${req.user.email} created GD topic: ${topic._id}`);

  res.status(201).json({
    success: true,
    message: 'GD topic created successfully.',
    data: { topic }
  });
}));

/**
 * @route   PUT /api/admin/gd-topics/:id
 * @desc    Update GD topic
 * @access  Private/Admin
 */
router.put('/gd-topics/:id', validateObjectId('id'), asyncHandler(async (req, res) => {
  const topic = await GDTopic.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  );

  if (!topic) {
    return res.status(404).json({
      success: false,
      message: 'Topic not found.'
    });
  }

  console.log(`[AUDIT] Admin ${req.user.email} updated GD topic: ${topic._id}`);

  res.json({
    success: true,
    message: 'Topic updated successfully.',
    data: { topic }
  });
}));

/**
 * @route   DELETE /api/admin/gd-topics/:id
 * @desc    Delete GD topic
 * @access  Private/Admin
 */
router.delete('/gd-topics/:id', validateObjectId('id'), asyncHandler(async (req, res) => {
  const topic = await GDTopic.findByIdAndDelete(req.params.id);

  if (!topic) {
    return res.status(404).json({
      success: false,
      message: 'Topic not found.'
    });
  }

  console.log(`[AUDIT] Admin ${req.user.email} deleted GD topic: ${req.params.id}`);

  res.json({
    success: true,
    message: 'Topic deleted successfully.'
  });
}));

// ===========================================
// Legacy Dashboard Route (backwards compatibility)
// ===========================================

/**
 * @route   GET /api/admin/dashboard
 * @desc    Get dashboard stats (legacy endpoint)
 * @access  Private/Admin
 * @deprecated Use /api/admin/stats instead
 */
router.get('/dashboard', asyncHandler(dashboardController.getStats));

module.exports = router;
