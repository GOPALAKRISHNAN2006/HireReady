/**
 * ===========================================
 * Question Routes
 * ===========================================
 *
 * Handles question management and retrieval.
 *
 * Routes:
 * GET /api/questions - Get all questions (with filters)
 * GET /api/questions/:id - Get question by ID
 * POST /api/questions - Create new question (admin)
 * PUT /api/questions/:id - Update question (admin)
 * DELETE /api/questions/:id - Delete question (admin)
 * GET /api/questions/random - Get random questions
 * GET /api/questions/categories - Get question categories
 */

const express = require('express');
const router = express.Router();
const Question = require('../models/Question.model');
const User = require('../models/User.model');
const { protect, authorize, optionalAuth } = require('../middleware/auth.middleware');
const { asyncHandler } = require('../middleware/errorHandler');
const {
  validateQuestion,
  validateObjectId,
  validatePagination,
} = require('../middleware/validation.middleware');
const { findCuratedAnswer } = require('../data/curatedAnswers');

/**
 * @route   GET /api/questions
 * @desc    Get all questions with filters and pagination
 * @access  Public (with optional auth for personalization)
 */
router.get(
  '/',
  optionalAuth,
  validatePagination,
  asyncHandler(async (req, res) => {
    const {
      page = 1,
      limit = 20,
      category,
      difficulty,
      type,
      tags,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = req.query;

    // Build query - match active and approved questions
    const query = {};
    if (req.query.isActive !== undefined) {
      query.isActive = req.query.isActive === 'true';
    } else {
      query.isActive = { $ne: false };
    }

    if (req.query.isApproved !== undefined) {
      query.isApproved = req.query.isApproved === 'true';
    } else {
      query.isApproved = { $ne: false };
    }

    if (category) {
      if (category === 'web-development' || category === 'web') {
        query.category = { $in: ['web', 'web-development'] };
      } else if (category === 'machine-learning' || category === 'ml') {
        query.category = { $in: ['ml', 'machine-learning'] };
      } else {
        query.category = category;
      }
    }
    if (difficulty) query.difficulty = difficulty;
    if (type) query.type = type;
    if (tags) query.tags = { $in: tags.split(',') };

    // Text search using regex on text and tags (consistent with admin controller)
    if (search) {
      query.$or = [
        { text: { $regex: search, $options: 'i' } },
        { tags: { $regex: search, $options: 'i' } },
      ];
    }

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

    // Execute query with pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [questions, total] = await Promise.all([
      Question.find(query).sort(sort).skip(skip).limit(parseInt(limit)).lean(),
      Question.countDocuments(query),
    ]);

    const enrichedQuestions = questions.map(q => {
      if (q.expectedAnswer && String(q.expectedAnswer).trim().length > 0) {
        return q;
      }
      const curated = findCuratedAnswer(q.text);
      if (!curated) return q;
      return {
        ...q,
        expectedAnswer: curated.expectedAnswer,
        keyPoints: q.keyPoints && q.keyPoints.length > 0 ? q.keyPoints : curated.keyPoints,
        hints: q.hints && q.hints.length > 0 ? q.hints : curated.hints,
        followUpQuestions:
          q.followUpQuestions && q.followUpQuestions.length > 0
            ? q.followUpQuestions
            : curated.followUpQuestions,
      };
    });

    res.status(200).json({
      success: true,
      data: {
        questions: enrichedQuestions,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / parseInt(limit)),
        },
      },
    });
  })
);

/**
 * @route   GET /api/questions/random
 * @desc    Get random questions for interview
 * @access  Private
 */
router.get(
  '/random',
  protect,
  asyncHandler(async (req, res) => {
    const { category, difficulty, count = 5, excludeIds } = req.query;

    const query = { isActive: true, isApproved: true };

    if (category && category !== 'mixed') {
      query.category = category;
    }
    if (difficulty) {
      query.difficulty = difficulty;
    }
    if (excludeIds) {
      query._id = { $nin: excludeIds.split(',') };
    }

    const questions = await Question.aggregate([
      { $match: query },
      { $sample: { size: parseInt(count) } },
      { $project: { expectedAnswer: 0 } }, // Hide expected answers
    ]);

    res.status(200).json({
      success: true,
      data: { questions },
    });
  })
);

/**
 * @route   GET /api/questions/categories
 * @desc    Get all question categories with stats
 * @access  Public
 */
router.get(
  '/categories',
  asyncHandler(async (req, res) => {
    const categories = await Question.getCategoryStats();

    const categoryDetails = {
      dsa: { name: 'Data Structures & Algorithms', icon: 'code', color: '#3B82F6' },
      web: { name: 'Web Development', icon: 'globe', color: '#10B981' },
      ml: { name: 'Machine Learning', icon: 'cpu', color: '#8B5CF6' },
      'system-design': { name: 'System Design', icon: 'layers', color: '#F59E0B' },
      behavioral: { name: 'Behavioral/HR', icon: 'users', color: '#EC4899' },
      database: { name: 'Database', icon: 'database', color: '#6366F1' },
      devops: { name: 'DevOps', icon: 'server', color: '#14B8A6' },
      mobile: { name: 'Mobile Development', icon: 'smartphone', color: '#F97316' },
    };

    const enrichedCategories = categories.map(cat => ({
      id: cat._id,
      ...categoryDetails[cat._id],
      questionCount: cat.count,
      averageScore: Math.round(cat.avgScore || 0),
      totalAttempts: cat.totalAttempts,
    }));

    res.status(200).json({
      success: true,
      data: { categories: enrichedCategories },
    });
  })
);

/**
 * @route   GET /api/questions/difficulty-levels
 * @desc    Get difficulty levels with descriptions
 * @access  Public
 */
router.get(
  '/difficulty-levels',
  asyncHandler(async (req, res) => {
    const levels = [
      {
        id: 'easy',
        name: 'Easy',
        description: 'Basic concepts and fundamentals',
        color: '#10B981',
        icon: 'smile',
      },
      {
        id: 'medium',
        name: 'Medium',
        description: 'Intermediate concepts requiring good understanding',
        color: '#F59E0B',
        icon: 'meh',
      },
      {
        id: 'hard',
        name: 'Hard',
        description: 'Advanced concepts and complex problem-solving',
        color: '#EF4444',
        icon: 'frown',
      },
      {
        id: 'expert',
        name: 'Expert',
        description: 'Expert-level questions for senior positions',
        color: '#7C3AED',
        icon: 'zap',
      },
    ];

    res.status(200).json({
      success: true,
      data: { levels },
    });
  })
);

/**
 * @route   GET /api/questions/search/advanced
 * @desc    Advanced question search
 * @access  Private
 */
router.get(
  '/search/advanced',
  protect,
  asyncHandler(async (req, res) => {
    const {
      query: searchQuery,
      categories,
      difficulties,
      targetRoles,
      minScore,
      maxScore,
    } = req.query;

    const matchStage = { isActive: true, isApproved: true };

    if (searchQuery) {
      matchStage.$text = { $search: searchQuery };
    }
    if (categories) {
      matchStage.category = { $in: categories.split(',') };
    }
    if (difficulties) {
      matchStage.difficulty = { $in: difficulties.split(',') };
    }
    if (targetRoles) {
      matchStage.targetRoles = { $in: targetRoles.split(',') };
    }
    if (minScore || maxScore) {
      matchStage.averageScore = {};
      if (minScore) matchStage.averageScore.$gte = parseInt(minScore);
      if (maxScore) matchStage.averageScore.$lte = parseInt(maxScore);
    }

    const questions = await Question.find(matchStage)
      .sort(searchQuery ? { score: { $meta: 'textScore' } } : { createdAt: -1 })
      .limit(50)
      .select('-expectedAnswer');

    res.status(200).json({
      success: true,
      data: {
        questions,
        count: questions.length,
      },
    });
  })
);

/**
 * @route   GET /api/questions/saved
 * @desc    Get user's saved questions
 * @access  Private
 */
router.get(
  '/saved',
  protect,
  asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id).populate({
      path: 'savedQuestions.question',
      select: 'text category difficulty type tags hints',
    });

    const savedQuestions = (user?.savedQuestions || [])
      .filter(sq => sq.question) // Filter out any null references
      .map(sq => ({
        _id: sq.question._id,
        id: sq.question._id,
        question: sq.question.text,
        text: sq.question.text,
        category: sq.question.category,
        difficulty: sq.question.difficulty,
        type: sq.question.type,
        tags: sq.question.tags || [],
        hints: sq.question.hints || [],
        savedAt: sq.savedAt,
        notes: sq.notes || '',
        starred: sq.starred || false,
      }));

    res.status(200).json({
      success: true,
      data: { questions: savedQuestions },
    });
  })
);

/**
 * @route   POST /api/questions/saved
 * @desc    Save a question (alternate route accepting questionId in body)
 * @access  Private
 */
router.post(
  '/saved',
  protect,
  asyncHandler(async (req, res) => {
    const { questionId, id, notes } = req.body;
    const targetId = questionId || id;
    if (!targetId) {
      return res.status(400).json({ success: false, message: 'Question ID is required' });
    }

    const question = await Question.findById(targetId);
    if (!question) {
      return res.status(404).json({ success: false, message: 'Question not found.' });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    const existingIndex = user.savedQuestions?.findIndex(
      sq => sq.question?.toString() === targetId.toString()
    );

    if (existingIndex >= 0) {
      user.savedQuestions[existingIndex].notes = notes || user.savedQuestions[existingIndex].notes;
    } else {
      if (!user.savedQuestions) user.savedQuestions = [];
      user.savedQuestions.push({
        question: targetId,
        savedAt: new Date(),
        notes: notes || '',
        starred: false,
      });
    }

    await user.save({ validateBeforeSave: false });

    res.status(200).json({
      success: true,
      message: 'Question saved successfully.',
    });
  })
);

/**
 * @route   POST /api/questions
 * @desc    Create new question
 * @access  Private/Admin
 */
router.post(
  '/',
  protect,
  authorize('admin', 'moderator'),
  validateQuestion,
  asyncHandler(async (req, res) => {
    const questionData = {
      ...req.body,
      createdBy: req.user._id,
      isApproved: req.user.role === 'admin', // Auto-approve for admins
      aiProvider: 'manual',
    };

    const question = await Question.create(questionData);

    res.status(201).json({
      success: true,
      message: 'Question created successfully.',
      data: { question },
    });
  })
);

/**
 * @route   POST /api/questions/:id/save
 * @desc    Save a question
 * @access  Private
 */
router.post(
  '/:id/save',
  protect,
  validateObjectId('id'),
  asyncHandler(async (req, res) => {
    const questionId = req.params.id;
    const { notes } = req.body;

    // Check if question exists
    const question = await Question.findById(questionId);
    if (!question) {
      return res.status(404).json({
        success: false,
        message: 'Question not found.',
      });
    }

    // Add to saved questions
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found.',
      });
    }

    // Check if already saved
    const existingIndex = user.savedQuestions?.findIndex(
      sq => sq.question?.toString() === questionId
    );

    if (existingIndex >= 0) {
      // Update existing
      user.savedQuestions[existingIndex].notes = notes || user.savedQuestions[existingIndex].notes;
    } else {
      // Add new
      if (!user.savedQuestions) user.savedQuestions = [];
      user.savedQuestions.push({
        question: questionId,
        savedAt: new Date(),
        notes: notes || '',
        starred: false,
      });
    }

    await user.save({ validateBeforeSave: false });

    res.status(200).json({
      success: true,
      message: 'Question saved successfully.',
    });
  })
);

/**
 * @route   GET /api/questions/:id
 * @desc    Get question by ID
 * @access  Private
 */
router.get(
  '/:id',
  protect,
  validateObjectId('id'),
  asyncHandler(async (req, res) => {
    const question = await Question.findById(req.params.id);

    if (!question || !question.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Question not found.',
      });
    }

    // Increment times asked
    await question.incrementAskedCount();

    const qObj = question.toObject ? question.toObject() : question;
    if (!qObj.expectedAnswer || String(qObj.expectedAnswer).trim().length === 0) {
      const curated = findCuratedAnswer(qObj.text);
      if (curated) {
        qObj.expectedAnswer = curated.expectedAnswer;
        qObj.keyPoints = qObj.keyPoints?.length > 0 ? qObj.keyPoints : curated.keyPoints;
        qObj.hints = qObj.hints?.length > 0 ? qObj.hints : curated.hints;
        qObj.followUpQuestions =
          qObj.followUpQuestions?.length > 0 ? qObj.followUpQuestions : curated.followUpQuestions;
      }
    }

    res.status(200).json({
      success: true,
      data: { question: qObj },
    });
  })
);

/**
 * @route   DELETE /api/questions/:id/save
 * @desc    Remove a saved question
 * @access  Private
 */
router.delete(
  '/:id/save',
  protect,
  validateObjectId('id'),
  asyncHandler(async (req, res) => {
    const questionId = req.params.id;

    await User.findByIdAndUpdate(req.user._id, {
      $pull: { savedQuestions: { question: questionId } },
    });

    res.status(200).json({
      success: true,
      message: 'Question removed from saved.',
    });
  })
);

/**
 * @route   PUT /api/questions/:id/star
 * @desc    Toggle star on a saved question
 * @access  Private
 */
router.put(
  '/:id/star',
  protect,
  validateObjectId('id'),
  asyncHandler(async (req, res) => {
    const questionId = req.params.id;
    const { starred } = req.body;

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    const savedQuestion = user.savedQuestions?.find(sq => sq.question?.toString() === questionId);

    if (savedQuestion) {
      savedQuestion.starred = starred !== undefined ? starred : !savedQuestion.starred;
      await user.save({ validateBeforeSave: false });
    }

    res.status(200).json({
      success: true,
      message: starred ? 'Question starred.' : 'Question unstarred.',
    });
  })
);

/**
 * @route   PUT /api/questions/:id
 * @desc    Update question
 * @access  Private/Admin
 */
router.put(
  '/:id',
  protect,
  authorize('admin', 'moderator'),
  validateObjectId('id'),
  asyncHandler(async (req, res) => {
    let question = await Question.findById(req.params.id);

    if (!question) {
      return res.status(404).json({
        success: false,
        message: 'Question not found.',
      });
    }

    // Allowed fields to update
    const allowedFields = [
      'text',
      'category',
      'subcategory',
      'difficulty',
      'type',
      'tags',
      'targetRoles',
      'expectedAnswer',
      'keyPoints',
      'hints',
      'followUpQuestions',
      'resources',
      'recommendedTimeMinutes',
      'isActive',
      'isApproved',
      'company',
    ];

    const updateData = {};
    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        updateData[field] = req.body[field];
      }
    });

    question = await Question.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      message: 'Question updated successfully.',
      data: { question },
    });
  })
);

/**
 * @route   DELETE /api/questions/:id
 * @desc    Delete question (soft delete)
 * @access  Private/Admin
 */
router.delete(
  '/:id',
  protect,
  authorize('admin'),
  validateObjectId('id'),
  asyncHandler(async (req, res) => {
    const question = await Question.findById(req.params.id);

    if (!question) {
      return res.status(404).json({
        success: false,
        message: 'Question not found.',
      });
    }

    // Soft delete
    question.isActive = false;
    await question.save();

    // Alternative: Hard delete
    // await question.remove();

    res.status(200).json({
      success: true,
      message: 'Question deleted successfully.',
    });
  })
);

module.exports = router;
