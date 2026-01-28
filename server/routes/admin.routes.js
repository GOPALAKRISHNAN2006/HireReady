/**
 * ===========================================
 * Admin Routes
 * ===========================================
 * 
 * Comprehensive admin API routes for managing users, questions, interviews,
 * aptitude tests, and group discussion topics.
 * 
 * All routes require authentication and admin role.
 * Includes rate limiting, validation, and audit logging.
 * 
 * Route Groups:
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
const User = require('../models/User.model');
const Question = require('../models/Question.model');
const Interview = require('../models/Interview.model');
const Analytics = require('../models/Analytics.model');
const Feedback = require('../models/Feedback.model');
const { protect, authorize } = require('../middleware/auth.middleware');
const { asyncHandler } = require('../middleware/errorHandler');
const { validateObjectId } = require('../middleware/validation.middleware');

// Import controllers
const dashboardController = require('../controllers/admin/dashboard.controller');
const usersController = require('../controllers/admin/users.controller');
const questionsController = require('../controllers/admin/questions.controller');
const interviewsController = require('../controllers/admin/interviews.controller');

// All admin routes require authentication and admin role
router.use(protect);
router.use(authorize('admin'));

// ===========================================
// New Controller-based Routes
// ===========================================

// Dashboard & Stats
router.get('/stats', asyncHandler(dashboardController.getStats));
router.get('/activity', asyncHandler(dashboardController.getActivity));

// Users (using controllers)
router.get('/users', asyncHandler(usersController.getUsers));
router.get('/users/:id', validateObjectId('id'), asyncHandler(usersController.getUserById));
router.put('/users/:id/role', validateObjectId('id'), asyncHandler(usersController.updateUserRole));
router.put('/users/:id/ban', validateObjectId('id'), asyncHandler(usersController.toggleUserStatus));
router.get('/users/:id/interviews', validateObjectId('id'), asyncHandler(usersController.getUserInterviews));

// Questions (using controllers)  
router.get('/questions/stats', asyncHandler(questionsController.getQuestionStats));
router.post('/questions', asyncHandler(questionsController.createQuestion));
router.post('/questions/bulk', asyncHandler(questionsController.bulkImportQuestions));

// Interviews (using controllers)
router.get('/interviews', asyncHandler(interviewsController.getInterviews));
router.get('/interviews/stats', asyncHandler(interviewsController.getInterviewStats));
router.get('/interviews/export', asyncHandler(interviewsController.exportInterviews));
router.get('/interviews/:id', validateObjectId('id'), asyncHandler(interviewsController.getInterviewById));
router.delete('/interviews/:id', validateObjectId('id'), asyncHandler(interviewsController.deleteInterview));

// ===========================================
// Legacy Routes (maintained for backwards compatibility)
// ===========================================

/**
 * @route   GET /api/admin/dashboard
 * @desc    Get admin dashboard statistics
 * @access  Private/Admin
 */
router.get('/dashboard', asyncHandler(async (req, res) => {
  // Get date ranges
  const today = new Date();
  const startOfToday = new Date(today.setHours(0, 0, 0, 0));
  const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay()));
  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

  // User statistics
  const [
    totalUsers,
    activeUsers,
    newUsersToday,
    newUsersThisWeek,
    newUsersThisMonth
  ] = await Promise.all([
    User.countDocuments(),
    User.countDocuments({ isActive: true }),
    User.countDocuments({ createdAt: { $gte: startOfToday } }),
    User.countDocuments({ createdAt: { $gte: startOfWeek } }),
    User.countDocuments({ createdAt: { $gte: startOfMonth } })
  ]);

  // Interview statistics
  const [
    totalInterviews,
    completedInterviews,
    interviewsToday,
    interviewsThisWeek
  ] = await Promise.all([
    Interview.countDocuments(),
    Interview.countDocuments({ status: 'completed' }),
    Interview.countDocuments({ createdAt: { $gte: startOfToday } }),
    Interview.countDocuments({ createdAt: { $gte: startOfWeek } })
  ]);

  // Question statistics
  const [
    totalQuestions,
    pendingQuestions,
    aiGeneratedQuestions
  ] = await Promise.all([
    Question.countDocuments({ isActive: true }),
    Question.countDocuments({ isApproved: false, isActive: true }),
    Question.countDocuments({ isAIGenerated: true, isActive: true })
  ]);

  // Average scores
  const avgScoreResult = await Interview.aggregate([
    { $match: { status: 'completed', overallScore: { $gt: 0 } } },
    { $group: { _id: null, avgScore: { $avg: '$overallScore' } } }
  ]);
  const averageScore = avgScoreResult[0]?.avgScore || 0;

  // User role distribution
  const roleDistribution = await User.aggregate([
    { $group: { _id: '$role', count: { $sum: 1 } } }
  ]);

  // Plan distribution
  const planDistribution = await User.aggregate([
    { $group: { _id: '$plan', count: { $sum: 1 } } }
  ]);

  // Category popularity
  const categoryPopularity = await Interview.aggregate([
    { $group: { _id: '$category', count: { $sum: 1 } } },
    { $sort: { count: -1 } }
  ]);

  // Recent activity
  const recentInterviews = await Interview.find()
    .sort({ createdAt: -1 })
    .limit(10)
    .populate('user', 'firstName lastName email')
    .select('user category overallScore status createdAt');

  const recentUsers = await User.find()
    .sort({ createdAt: -1 })
    .limit(10)
    .select('firstName lastName email role createdAt');

  res.status(200).json({
    success: true,
    data: {
      users: {
        total: totalUsers,
        active: activeUsers,
        newToday: newUsersToday,
        newThisWeek: newUsersThisWeek,
        newThisMonth: newUsersThisMonth,
        roleDistribution,
        planDistribution
      },
      interviews: {
        total: totalInterviews,
        completed: completedInterviews,
        today: interviewsToday,
        thisWeek: interviewsThisWeek,
        averageScore: Math.round(averageScore),
        categoryPopularity
      },
      questions: {
        total: totalQuestions,
        pending: pendingQuestions,
        aiGenerated: aiGeneratedQuestions
      },
      recentActivity: {
        interviews: recentInterviews,
        users: recentUsers
      }
    }
  });
}));

/**
 * @route   GET /api/admin/users
 * @desc    Get all users with pagination and filters
 * @access  Private/Admin
 */
router.get('/users', asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 20,
    search,
    role,
    isActive,
    plan,
    sortBy = 'createdAt',
    sortOrder = 'desc'
  } = req.query;

  const query = {};

  if (search) {
    query.$or = [
      { firstName: { $regex: search, $options: 'i' } },
      { lastName: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } }
    ];
  }
  if (role) query.role = role;
  if (isActive !== undefined) query.isActive = isActive === 'true';
  if (plan) query.plan = plan;

  const sort = {};
  sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

  const skip = (parseInt(page) - 1) * parseInt(limit);

  const [users, total] = await Promise.all([
    User.find(query)
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit))
      .select('-refreshToken -password'),
    User.countDocuments(query)
  ]);

  res.status(200).json({
    success: true,
    data: {
      users,
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
 * @route   GET /api/admin/users/:id
 * @desc    Get user details with analytics
 * @access  Private/Admin
 */
router.get('/users/:id', validateObjectId('id'), asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id)
    .select('-refreshToken -password');

  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found.'
    });
  }

  // Get user analytics
  const analytics = await Analytics.findOne({ user: req.params.id });

  // Get all interviews for the user
  const interviews = await Interview.find({ user: req.params.id })
    .sort({ createdAt: -1 })
    .select('category difficulty overallScore status createdAt completedAt responses totalQuestions questionsAnswered');

  // Get user resumes
  const Resume = require('../models/Resume.model');
  const resumes = await Resume.find({ user: req.params.id })
    .sort({ createdAt: -1 })
    .select('title template personalInfo createdAt updatedAt');

  res.status(200).json({
    success: true,
    data: {
      user,
      analytics: analytics?.overallStats,
      interviews,
      resumes
    }
  });
}));

/**
 * @route   GET /api/admin/users/:id/interviews
 * @desc    Get all interviews for a specific user
 * @access  Private/Admin
 */
router.get('/users/:id/interviews', validateObjectId('id'), asyncHandler(async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const skip = (parseInt(page) - 1) * parseInt(limit);

  const [interviews, total] = await Promise.all([
    Interview.find({ user: req.params.id })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .select('category difficulty overallScore status createdAt completedAt responses totalQuestions questionsAnswered'),
    Interview.countDocuments({ user: req.params.id })
  ]);

  res.status(200).json({
    success: true,
    data: {
      interviews,
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
 * @route   GET /api/admin/users/:id/resumes
 * @desc    Get all resumes for a specific user
 * @access  Private/Admin
 */
router.get('/users/:id/resumes', validateObjectId('id'), asyncHandler(async (req, res) => {
  const Resume = require('../models/Resume.model');
  const resumes = await Resume.find({ user: req.params.id })
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    data: { resumes }
  });
}));

// Note: GET /interviews/:id is now handled by interviewsController.getInterviewById above

/**
 * @route   PUT /api/admin/users/:id
 * @desc    Update user (role, status, etc.)
 * @access  Private/Admin
 */
router.put('/users/:id', validateObjectId('id'), asyncHandler(async (req, res) => {
  const { role, isActive, plan, planExpiresAt } = req.body;

  const updateData = {};
  if (role) updateData.role = role;
  if (isActive !== undefined) updateData.isActive = isActive;
  if (plan) updateData.plan = plan;
  if (planExpiresAt) updateData.planExpiresAt = new Date(planExpiresAt);

  const user = await User.findByIdAndUpdate(
    req.params.id,
    updateData,
    { new: true, runValidators: true }
  ).select('-refreshToken -password');

  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found.'
    });
  }

  res.status(200).json({
    success: true,
    message: 'User updated successfully.',
    data: { user }
  });
}));

/**
 * @route   DELETE /api/admin/users/:id
 * @desc    Delete user
 * @access  Private/Admin
 */
router.delete('/users/:id', validateObjectId('id'), asyncHandler(async (req, res) => {
  const { permanent = false } = req.query;

  const user = await User.findById(req.params.id);

  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found.'
    });
  }

  if (user.role === 'admin') {
    return res.status(400).json({
      success: false,
      message: 'Cannot delete admin users.'
    });
  }

  if (permanent === 'true') {
    // Hard delete
    await User.findByIdAndDelete(req.params.id);
    await Analytics.deleteOne({ user: req.params.id });
    await Interview.deleteMany({ user: req.params.id });
    await Feedback.deleteMany({ user: req.params.id });
  } else {
    // Soft delete
    user.isActive = false;
    user.email = `deleted_${Date.now()}_${user.email}`;
    await user.save();
  }

  res.status(200).json({
    success: true,
    message: `User ${permanent === 'true' ? 'permanently deleted' : 'deactivated'} successfully.`
  });
}));

/**
 * @route   GET /api/admin/questions
 * @desc    Get all questions (including inactive)
 * @access  Private/Admin
 */
router.get('/questions', asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 50,
    category,
    difficulty,
    isApproved,
    isActive,
    isAIGenerated,
    search
  } = req.query;

  const query = {};

  if (category) query.category = category;
  if (difficulty) query.difficulty = difficulty;
  if (isApproved !== undefined) query.isApproved = isApproved === 'true';
  if (isActive !== undefined) query.isActive = isActive === 'true';
  if (isAIGenerated !== undefined) query.isAIGenerated = isAIGenerated === 'true';
  
  // Use regex search for text instead of $text index
  if (search) {
    query.text = { $regex: search, $options: 'i' };
  }

  const skip = (parseInt(page) - 1) * parseInt(limit);

  const [questions, total] = await Promise.all([
    Question.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .populate('createdBy', 'firstName lastName'),
    Question.countDocuments(query)
  ]);

  res.status(200).json({
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
 * @route   GET /api/admin/questions/pending
 * @desc    Get pending questions for approval
 * @access  Private/Admin
 */
router.get('/questions/pending', asyncHandler(async (req, res) => {
  const questions = await Question.find({ isApproved: false, isActive: true })
    .sort({ createdAt: -1 })
    .populate('createdBy', 'firstName lastName email');

  res.status(200).json({
    success: true,
    data: { 
      questions,
      count: questions.length
    }
  });
}));

/**
 * @route   PUT /api/admin/questions/:id/approve
 * @desc    Approve a question
 * @access  Private/Admin
 */
router.put('/questions/:id/approve', validateObjectId('id'), asyncHandler(async (req, res) => {
  const question = await Question.findByIdAndUpdate(
    req.params.id,
    { 
      isApproved: true,
      approvedBy: req.user._id
    },
    { new: true }
  );

  if (!question) {
    return res.status(404).json({
      success: false,
      message: 'Question not found.'
    });
  }

  res.status(200).json({
    success: true,
    message: 'Question approved successfully.',
    data: { question }
  });
}));

/**
 * @route   PUT /api/admin/questions/:id/reject
 * @desc    Reject a question
 * @access  Private/Admin
 */
router.put('/questions/:id/reject', validateObjectId('id'), asyncHandler(async (req, res) => {
  const { reason } = req.body;

  const question = await Question.findByIdAndUpdate(
    req.params.id,
    { isActive: false },
    { new: true }
  );

  if (!question) {
    return res.status(404).json({
      success: false,
      message: 'Question not found.'
    });
  }

  res.status(200).json({
    success: true,
    message: 'Question rejected.',
    data: { question }
  });
}));

/**
 * @route   GET /api/admin/analytics
 * @desc    Get system-wide analytics
 * @access  Private/Admin
 */
router.get('/analytics', asyncHandler(async (req, res) => {
  const { period = 'week' } = req.query;

  // Calculate date range
  let startDate;
  const now = new Date();
  switch (period) {
    case 'day':
      startDate = new Date(now.setDate(now.getDate() - 1));
      break;
    case 'week':
      startDate = new Date(now.setDate(now.getDate() - 7));
      break;
    case 'month':
      startDate = new Date(now.setMonth(now.getMonth() - 1));
      break;
    case 'year':
      startDate = new Date(now.setFullYear(now.getFullYear() - 1));
      break;
    default:
      startDate = new Date(now.setDate(now.getDate() - 7));
  }

  // Daily interview counts
  const dailyInterviews = await Interview.aggregate([
    { $match: { createdAt: { $gte: startDate } } },
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
        count: { $sum: 1 },
        avgScore: { $avg: '$overallScore' }
      }
    },
    { $sort: { _id: 1 } }
  ]);

  // Daily user registrations
  const dailyRegistrations = await User.aggregate([
    { $match: { createdAt: { $gte: startDate } } },
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
        count: { $sum: 1 }
      }
    },
    { $sort: { _id: 1 } }
  ]);

  // Category performance
  const categoryPerformance = await Interview.aggregate([
    { $match: { status: 'completed', createdAt: { $gte: startDate } } },
    {
      $group: {
        _id: '$category',
        totalInterviews: { $sum: 1 },
        avgScore: { $avg: '$overallScore' }
      }
    },
    { $sort: { totalInterviews: -1 } }
  ]);

  // Difficulty distribution
  const difficultyDistribution = await Interview.aggregate([
    { $match: { createdAt: { $gte: startDate } } },
    {
      $group: {
        _id: '$difficulty',
        count: { $sum: 1 }
      }
    }
  ]);

  // Feedback ratings
  const feedbackStats = await Feedback.aggregate([
    { $match: { userRating: { $exists: true } } },
    {
      $group: {
        _id: null,
        avgRating: { $avg: '$userRating' },
        totalRatings: { $sum: 1 },
        helpfulCount: { $sum: { $cond: ['$isHelpful', 1, 0] } }
      }
    }
  ]);

  res.status(200).json({
    success: true,
    data: {
      period,
      dailyInterviews,
      dailyRegistrations,
      categoryPerformance,
      difficultyDistribution,
      feedbackStats: feedbackStats[0] || { avgRating: 0, totalRatings: 0, helpfulCount: 0 }
    }
  });
}));

/**
 * @route   POST /api/admin/bulk-import-questions
 * @desc    Bulk import questions
 * @access  Private/Admin
 */
router.post('/bulk-import-questions', asyncHandler(async (req, res) => {
  const { questions } = req.body;

  if (!Array.isArray(questions) || questions.length === 0) {
    return res.status(400).json({
      success: false,
      message: 'Please provide an array of questions.'
    });
  }

  // Add creator and approval info
  const processedQuestions = questions.map(q => ({
    ...q,
    createdBy: req.user._id,
    isApproved: true,
    approvedBy: req.user._id,
    aiProvider: 'manual'
  }));

  const inserted = await Question.insertMany(processedQuestions, { ordered: false });

  res.status(201).json({
    success: true,
    message: `Successfully imported ${inserted.length} questions.`,
    data: { count: inserted.length }
  });
}));

// ============================================
// APTITUDE QUESTIONS MANAGEMENT
// ============================================

const { AptitudeQuestion, AptitudeTest } = require('../models/Aptitude.model');

/**
 * @route   GET /api/admin/aptitude
 * @desc    Get all aptitude questions
 * @access  Private/Admin
 */
router.get('/aptitude', asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, category, difficulty } = req.query;
  
  const query = {};
  if (category) query.category = category;
  if (difficulty) query.difficulty = difficulty;

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
 * @route   POST /api/admin/aptitude
 * @desc    Create aptitude question
 * @access  Private/Admin
 */
router.post('/aptitude', asyncHandler(async (req, res) => {
  const { category, question, options, explanation, difficulty, timeLimit, points } = req.body;

  if (!category || !question || !options || options.length < 2) {
    return res.status(400).json({
      success: false,
      message: 'Category, question, and at least 2 options are required.'
    });
  }

  const aptitudeQuestion = await AptitudeQuestion.create({
    category,
    question,
    options,
    explanation,
    difficulty: difficulty || 'medium',
    timeLimit: timeLimit || 60,
    points: points || 1
  });

  res.status(201).json({
    success: true,
    message: 'Aptitude question created successfully.',
    data: aptitudeQuestion
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

  res.json({
    success: true,
    message: 'Question updated successfully.',
    data: question
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

  res.json({
    success: true,
    message: 'Question deleted successfully.'
  });
}));

// ============================================
// GD TOPICS MANAGEMENT
// ============================================

const { GDTopic, GDSession } = require('../models/GroupDiscussion.model');

/**
 * @route   GET /api/admin/gd-topics
 * @desc    Get all GD topics
 * @access  Private/Admin
 */
router.get('/gd-topics', asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, category, difficulty } = req.query;
  
  const query = {};
  if (category) query.category = category;
  if (difficulty) query.difficulty = difficulty;

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

  res.status(201).json({
    success: true,
    message: 'GD topic created successfully.',
    data: topic
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

  res.json({
    success: true,
    message: 'Topic updated successfully.',
    data: topic
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

  res.json({
    success: true,
    message: 'Topic deleted successfully.'
  });
}));

// ============================================
// INTERVIEW REVIEWS
// ============================================
// Note: Interview routes are now handled by interviewsController at the top of this file
// - GET /interviews -> interviewsController.getInterviews
// - GET /interviews/:id -> interviewsController.getInterviewById
// - GET /interviews/stats -> interviewsController.getInterviewStats
// - GET /interviews/export -> interviewsController.exportInterviews
// - DELETE /interviews/:id -> interviewsController.deleteInterview

module.exports = router;
