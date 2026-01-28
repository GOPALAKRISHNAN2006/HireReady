/**
 * Aptitude Test Routes
 */

const express = require('express');
const router = express.Router();
const { AptitudeQuestion, AptitudeTest } = require('../models/Aptitude.model');
const { protect, authorize } = require('../middleware/auth.middleware');
const { asyncHandler } = require('../middleware/errorHandler');

// Get aptitude test categories with stats
router.get('/categories', protect, asyncHandler(async (req, res) => {
  const categories = [
    { id: 'quantitative', name: 'Quantitative Aptitude', icon: 'Calculator', description: 'Math, arithmetic, algebra' },
    { id: 'logical', name: 'Logical Reasoning', icon: 'Brain', description: 'Patterns, sequences, puzzles' },
    { id: 'verbal', name: 'Verbal Ability', icon: 'BookOpen', description: 'Grammar, vocabulary, comprehension' },
    { id: 'data-interpretation', name: 'Data Interpretation', icon: 'BarChart', description: 'Charts, graphs, tables' },
    { id: 'general-knowledge', name: 'General Knowledge', icon: 'Globe', description: 'Current affairs, facts' }
  ];

  const stats = await Promise.all(
    categories.map(async (cat) => {
      const count = await AptitudeQuestion.countDocuments({ category: cat.id });
      const userTests = await AptitudeTest.countDocuments({ 
        user: req.user._id, 
        category: cat.id,
        status: 'completed'
      });
      return { ...cat, questionCount: count, testsCompleted: userTests };
    })
  );

  res.json({
    success: true,
    data: stats
  });
}));

// Get questions for a test
router.get('/questions/:category', protect, asyncHandler(async (req, res) => {
  const { category } = req.params;
  const { difficulty = 'medium', limit = 10 } = req.query;

  const query = category === 'mixed' ? {} : { category };
  if (difficulty !== 'all') query.difficulty = difficulty;

  const questions = await AptitudeQuestion.aggregate([
    { $match: query },
    { $sample: { size: parseInt(limit) } }
  ]);

  res.json({
    success: true,
    data: questions
  });
}));

// Start aptitude test
router.post('/start', protect, asyncHandler(async (req, res) => {
  const { category, difficulty = 'medium', totalQuestions = 10 } = req.body;

  const query = category === 'mixed' ? {} : { category };
  if (difficulty !== 'all') query.difficulty = difficulty;

  const questions = await AptitudeQuestion.aggregate([
    { $match: query },
    { $sample: { size: parseInt(totalQuestions) } }
  ]);

  if (questions.length === 0) {
    return res.status(400).json({
      success: false,
      message: 'No questions available for the selected category'
    });
  }

  const test = await AptitudeTest.create({
    user: req.user._id,
    category,
    totalQuestions: questions.length,
    responses: questions.map(q => ({
      question: q._id,
      questionText: q.question,
      options: q.options
    })),
    status: 'in-progress',
    startedAt: new Date()
  });

  res.status(201).json({
    success: true,
    message: 'Test started',
    data: {
      testId: test._id,
      totalQuestions: test.totalQuestions,
      questions: test.responses.map((r, idx) => ({
        index: idx,
        question: r.questionText,
        options: r.options.map(o => o.text)
      }))
    }
  });
}));

// Submit answer
router.post('/:testId/submit-answer', protect, asyncHandler(async (req, res) => {
  const { questionIndex, selectedOption, timeTaken } = req.body;
  
  const test = await AptitudeTest.findOne({
    _id: req.params.testId,
    user: req.user._id,
    status: 'in-progress'
  });

  if (!test) {
    return res.status(404).json({
      success: false,
      message: 'Test not found or already completed'
    });
  }

  if (questionIndex >= test.responses.length) {
    return res.status(400).json({
      success: false,
      message: 'Invalid question index'
    });
  }

  const response = test.responses[questionIndex];
  const isCorrect = response.options[selectedOption]?.isCorrect || false;

  response.selectedOption = selectedOption;
  response.isCorrect = isCorrect;
  response.timeTaken = timeTaken;

  test.questionsAnswered += 1;
  if (isCorrect) test.correctAnswers += 1;

  await test.save();

  res.json({
    success: true,
    data: {
      isCorrect,
      correctAnswer: response.options.findIndex(o => o.isCorrect),
      questionsAnswered: test.questionsAnswered,
      correctAnswers: test.correctAnswers
    }
  });
}));

// Complete test
router.post('/:testId/complete', protect, asyncHandler(async (req, res) => {
  const test = await AptitudeTest.findOne({
    _id: req.params.testId,
    user: req.user._id
  });

  if (!test) {
    return res.status(404).json({
      success: false,
      message: 'Test not found'
    });
  }

  test.status = 'completed';
  test.completedAt = new Date();
  test.totalTime = Math.round((test.completedAt - test.startedAt) / 1000);
  test.score = test.correctAnswers;
  test.percentage = Math.round((test.correctAnswers / test.totalQuestions) * 100);

  await test.save();

  res.json({
    success: true,
    message: 'Test completed',
    data: {
      score: test.score,
      totalQuestions: test.totalQuestions,
      percentage: test.percentage,
      correctAnswers: test.correctAnswers,
      timeTaken: test.totalTime,
      responses: test.responses.map(r => ({
        question: r.questionText,
        selectedOption: r.selectedOption,
        isCorrect: r.isCorrect,
        correctAnswer: r.options.findIndex(o => o.isCorrect)
      }))
    }
  });
}));

// Admin: Add question
router.post('/questions', protect, authorize('admin'), asyncHandler(async (req, res) => {
  const question = await AptitudeQuestion.create(req.body);

  res.status(201).json({
    success: true,
    message: 'Question added successfully',
    data: question
  });
}));

// Admin: Bulk add questions
router.post('/questions/bulk', protect, authorize('admin'), asyncHandler(async (req, res) => {
  const { questions } = req.body;
  
  const result = await AptitudeQuestion.insertMany(questions);

  res.status(201).json({
    success: true,
    message: `${result.length} questions added successfully`,
    data: { count: result.length }
  });
}));

// Get test history
router.get('/history', protect, asyncHandler(async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const skip = (page - 1) * limit;

  const [tests, total] = await Promise.all([
    AptitudeTest.find({ user: req.user._id, status: 'completed' })
      .sort({ completedAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .select('category totalQuestions correctAnswers percentage completedAt totalTime')
      .lean(),
    AptitudeTest.countDocuments({ user: req.user._id, status: 'completed' })
  ]);

  res.json({
    success: true,
    data: {
      tests,
      pagination: { page: parseInt(page), limit: parseInt(limit), total, pages: Math.ceil(total / limit) }
    }
  });
}));

// Get single test result
router.get('/:testId', protect, asyncHandler(async (req, res) => {
  const test = await AptitudeTest.findOne({
    _id: req.params.testId,
    user: req.user._id
  });

  if (!test) {
    return res.status(404).json({
      success: false,
      message: 'Test not found'
    });
  }

  res.json({
    success: true,
    data: test
  });
}));

module.exports = router;
