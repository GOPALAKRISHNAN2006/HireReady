/**
 * ===========================================
 * Daily Challenge Routes
 * ===========================================
 * 
 * Handles daily challenge functionality.
 * 
 * Routes:
 * GET /api/challenges/today - Get today's challenge
 * GET /api/challenges/streak - Get user streak info
 * POST /api/challenges/:id/submit - Submit challenge answer
 * GET /api/challenges/history - Get challenge history
 * GET /api/challenges/leaderboard - Get streak leaderboard
 */

const express = require('express');
const router = express.Router();
const { DailyChallenge, UserChallenge, UserStreak } = require('../models/DailyChallenge.model');
const { protect, optionalAuth } = require('../middleware/auth.middleware');
const { asyncHandler } = require('../middleware/errorHandler');

/**
 * @route   GET /api/challenges/today
 * @desc    Get today's challenge
 * @access  Private
 */
router.get('/today', protect, asyncHandler(async (req, res) => {
  let challenge = await DailyChallenge.getTodaysChallenge();
  
  // If no challenge for today, get a random active one
  if (!challenge) {
    challenge = await DailyChallenge.findOne({ isActive: true }).sort({ activeDate: -1 });
  }
  
  if (!challenge) {
    return res.status(404).json({
      success: false,
      message: 'No challenge available today'
    });
  }
  
  // Check if user has already attempted
  const attempt = await UserChallenge.findOne({
    user: req.user._id,
    challenge: challenge._id
  });
  
  // Count today's attempts for the 3-attempt limit
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  const todayAttemptCount = await UserChallenge.countDocuments({
    user: req.user._id,
    attemptDate: { $gte: today, $lt: tomorrow }
  });
  
  // Get user streak
  const streak = await UserStreak.getOrCreate(req.user._id);
  
  res.status(200).json({
    success: true,
    data: {
      challenge: {
        _id: challenge._id,
        title: challenge.title,
        description: challenge.description,
        category: challenge.category,
        difficulty: challenge.difficulty,
        points: challenge.points,
        timeLimit: challenge.timeLimit,
        question: challenge.question,
        hints: challenge.hints,
        sampleInput: challenge.sampleInput,
        sampleOutput: challenge.sampleOutput,
        tags: challenge.tags
      },
      userAttempt: attempt ? {
        isCompleted: attempt.isCompleted,
        score: attempt.score,
        pointsEarned: attempt.pointsEarned,
        timeSpent: attempt.timeSpent
      } : null,
      todayAttemptCount,
      maxDailyAttempts: 3,
      canAttempt: todayAttemptCount < 3 && !(attempt?.isCompleted),
      streak: {
        currentStreak: streak.currentStreak,
        longestStreak: streak.longestStreak,
        totalPoints: streak.totalPoints
      }
    }
  });
}));

/**
 * @route   GET /api/challenges/streak
 * @desc    Get user streak information
 * @access  Private
 */
router.get('/streak', protect, asyncHandler(async (req, res) => {
  const streak = await UserStreak.getOrCreate(req.user._id);
  
  res.status(200).json({
    success: true,
    data: {
      currentStreak: streak.currentStreak,
      longestStreak: streak.longestStreak,
      totalPoints: streak.totalPoints,
      totalChallengesCompleted: streak.totalChallengesCompleted,
      lastChallengeDate: streak.lastChallengeDate,
      achievements: streak.achievements,
      recentHistory: streak.streakHistory.slice(-7)
    }
  });
}));

/**
 * @route   GET /api/challenges/history
 * @desc    Get user's challenge history
 * @access  Private
 */
router.get('/history', protect, asyncHandler(async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const skip = (page - 1) * limit;
  
  const attempts = await UserChallenge.find({ user: req.user._id })
    .populate('challenge', 'title category difficulty points activeDate')
    .sort({ attemptDate: -1 })
    .skip(skip)
    .limit(parseInt(limit));
  
  const total = await UserChallenge.countDocuments({ user: req.user._id });
  
  res.status(200).json({
    success: true,
    data: {
      attempts,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    }
  });
}));

/**
 * @route   GET /api/challenges/leaderboard
 * @desc    Get streak leaderboard
 * @access  Private
 */
router.get('/leaderboard', protect, asyncHandler(async (req, res) => {
  const { type = 'points', limit = 20 } = req.query;
  
  let sortField = 'totalPoints';
  if (type === 'streak') sortField = 'currentStreak';
  if (type === 'longest') sortField = 'longestStreak';
  
  const leaderboard = await UserStreak.find()
    .populate('user', 'firstName lastName avatar')
    .sort({ [sortField]: -1 })
    .limit(parseInt(limit));
  
  // Get user's rank
  const userStreak = await UserStreak.findOne({ user: req.user._id });
  let userRank = null;
  if (userStreak) {
    userRank = await UserStreak.countDocuments({ [sortField]: { $gt: userStreak[sortField] } }) + 1;
  }
  
  res.status(200).json({
    success: true,
    data: {
      leaderboard: leaderboard.map((s, idx) => ({
        rank: idx + 1,
        user: s.user,
        currentStreak: s.currentStreak,
        longestStreak: s.longestStreak,
        totalPoints: s.totalPoints,
        totalChallengesCompleted: s.totalChallengesCompleted
      })),
      userRank,
      total: await UserStreak.countDocuments()
    }
  });
}));

/**
 * @route   GET /api/challenges/all
 * @desc    Get all available challenges (for browsing)
 * @access  Private
 */
router.get('/all', protect, asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, category, difficulty } = req.query;
  const skip = (page - 1) * limit;
  
  const query = { isActive: true };
  if (category) query.category = category;
  if (difficulty) query.difficulty = difficulty;
  
  const challenges = await DailyChallenge.find(query)
    .select('title description category difficulty points timeLimit tags activeDate')
    .sort({ activeDate: -1 })
    .skip(skip)
    .limit(parseInt(limit));
  
  const total = await DailyChallenge.countDocuments(query);
  
  res.status(200).json({
    success: true,
    data: {
      challenges,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    }
  });
}));

/**
 * @route   POST /api/challenges/:id/submit
 * @desc    Submit challenge answer
 * @access  Private
 */
router.post('/:id/submit', protect, asyncHandler(async (req, res) => {
  const { answer, code, timeSpent, hintsUsed } = req.body;
  
  const challenge = await DailyChallenge.findById(req.params.id);
  
  if (!challenge) {
    return res.status(404).json({
      success: false,
      message: 'Challenge not found'
    });
  }
  
  // Check if already completed
  let attempt = await UserChallenge.findOne({
    user: req.user._id,
    challenge: challenge._id
  });
  
  if (attempt && attempt.isCompleted) {
    return res.status(400).json({
      success: false,
      message: 'You have already completed this challenge'
    });
  }
  
  // Check 3-attempt daily limit
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  const todayAttemptCount = await UserChallenge.countDocuments({
    user: req.user._id,
    attemptDate: { $gte: today, $lt: tomorrow }
  });
  
  if (todayAttemptCount >= 3 && !attempt) {
    return res.status(400).json({
      success: false,
      message: 'You have reached the maximum of 3 attempts for today. Come back tomorrow!'
    });
  }
  
  // Calculate score based on answer correctness
  let score = 0;
  let pointsEarned = 0;
  let isCompleted = false;
  let feedback = '';
  
  // Validate answer against expected answer
  if (answer || code) {
    const submittedAnswer = (answer || code || '').toLowerCase().trim();
    const expectedAnswer = (challenge.expectedAnswer || '').toLowerCase().trim();
    
    // Check if answer matches expected answer
    if (expectedAnswer && submittedAnswer) {
      // Exact match or contains expected keywords
      if (submittedAnswer === expectedAnswer) {
        score = 100;
        isCompleted = true;
        feedback = 'Perfect! Your answer is correct.';
      } else if (submittedAnswer.includes(expectedAnswer) || expectedAnswer.includes(submittedAnswer)) {
        score = 85;
        isCompleted = true;
        feedback = 'Great job! Your answer is mostly correct.';
      } else {
        // Check for partial matches using keywords
        const expectedWords = expectedAnswer.split(/\s+/).filter(w => w.length > 3);
        const submittedWords = submittedAnswer.split(/\s+/);
        const matchedWords = expectedWords.filter(w => submittedWords.some(sw => sw.includes(w)));
        const matchRatio = expectedWords.length > 0 ? matchedWords.length / expectedWords.length : 0;
        
        if (matchRatio >= 0.7) {
          score = 75;
          isCompleted = true;
          feedback = 'Good effort! Your answer captures the main concepts.';
        } else if (matchRatio >= 0.4) {
          score = 50;
          isCompleted = false;
          feedback = 'Partially correct. Review the key concepts and try again.';
        } else {
          score = 25;
          isCompleted = false;
          feedback = 'Your answer needs improvement. Check the hints for guidance.';
        }
      }
    } else if (!expectedAnswer) {
      // No expected answer defined - mark as completed if response is substantial
      if (submittedAnswer.length >= 20) {
        score = 70;
        isCompleted = true;
        feedback = 'Answer submitted successfully!';
      } else {
        score = 30;
        isCompleted = false;
        feedback = 'Please provide a more detailed answer.';
      }
    }
    
    // Calculate points only if completed
    if (isCompleted) {
      pointsEarned = Math.floor(challenge.points * (score / 100));
      pointsEarned -= (hintsUsed || 0) * 10; // -10 points per hint
      if (timeSpent > challenge.timeLimit * 60) {
        pointsEarned = Math.floor(pointsEarned * 0.8); // 20% penalty for overtime
      }
      pointsEarned = Math.max(pointsEarned, 10); // Minimum 10 points
    }
  } else {
    feedback = 'Please provide an answer before submitting.';
  }
  
  // Create or update attempt
  if (attempt) {
    attempt.answer = answer;
    attempt.code = code;
    attempt.isCompleted = isCompleted;
    attempt.score = score;
    attempt.pointsEarned = pointsEarned;
    attempt.timeSpent = timeSpent;
    attempt.hintsUsed = hintsUsed || 0;
    await attempt.save();
  } else {
    attempt = await UserChallenge.create({
      user: req.user._id,
      challenge: challenge._id,
      answer,
      code,
      isCompleted,
      score,
      pointsEarned,
      timeSpent,
      hintsUsed: hintsUsed || 0
    });
  }
  
  // Update streak if completed
  let streak = null;
  if (isCompleted) {
    streak = await UserStreak.getOrCreate(req.user._id);
    await streak.updateStreak(challenge._id, pointsEarned);
  }
  
  res.status(200).json({
    success: true,
    data: {
      attempt: {
        isCompleted,
        score,
        pointsEarned,
        timeSpent,
        feedback
      },
      streak: streak ? {
        currentStreak: streak.currentStreak,
        longestStreak: streak.longestStreak,
        totalPoints: streak.totalPoints,
        newAchievements: streak.achievements.filter(
          a => new Date(a.earnedAt).getTime() > Date.now() - 60000
        )
      } : null,
      solution: isCompleted ? challenge.solution : null
    }
  });
}));

module.exports = router;
