/**
 * ===========================================
 * Analytics Routes
 * ===========================================
 * 
 * Handles user analytics and performance tracking.
 * 
 * Routes:
 * GET /api/analytics - Get user analytics
 * GET /api/analytics/summary - Get analytics summary
 * GET /api/analytics/progress - Get progress over time
 * GET /api/analytics/leaderboard - Get leaderboard
 */

const express = require('express');
const router = express.Router();
const Analytics = require('../models/Analytics.model');
const Interview = require('../models/Interview.model');
const Feedback = require('../models/Feedback.model');
const { protect } = require('../middleware/auth.middleware');
const { asyncHandler } = require('../middleware/errorHandler');

/**
 * @route   GET /api/analytics
 * @desc    Get full user analytics
 * @access  Private
 */
router.get('/', protect, asyncHandler(async (req, res) => {
  const analytics = await Analytics.getOrCreate(req.user._id);

  res.status(200).json({
    success: true,
    data: { analytics }
  });
}));

/**
 * @route   GET /api/analytics/summary
 * @desc    Get analytics summary for dashboard
 * @access  Private
 */
router.get('/summary', protect, asyncHandler(async (req, res) => {
  const analytics = await Analytics.getOrCreate(req.user._id);

  // Get recent activity
  const recentInterviews = await Interview.find({ 
    user: req.user._id, 
    status: 'completed' 
  })
    .sort({ completedAt: -1 })
    .limit(5)
    .select('title category overallScore completedAt');

  // Get unread feedback count
  const unreadFeedback = await Feedback.getUnreadCount(req.user._id);

  // Calculate improvement percentage
  let improvementPercentage = 0;
  if (analytics.recentScores.length >= 2) {
    const recent = analytics.recentScores.slice(0, 3);
    const older = analytics.recentScores.slice(-3);
    const recentAvg = recent.reduce((a, b) => a + b.score, 0) / recent.length;
    const olderAvg = older.reduce((a, b) => a + b.score, 0) / older.length;
    improvementPercentage = Math.round(((recentAvg - olderAvg) / olderAvg) * 100);
  }

  res.status(200).json({
    success: true,
    data: {
      stats: {
        totalInterviews: analytics.overallStats.totalInterviews,
        completedInterviews: analytics.overallStats.completedInterviews,
        averageScore: Math.round(analytics.overallStats.averageScore),
        highestScore: analytics.overallStats.highestScore,
        totalPracticeTime: analytics.overallStats.totalPracticeTimeMinutes,
        currentStreak: analytics.overallStats.currentStreak,
        longestStreak: analytics.overallStats.longestStreak,
        improvementPercentage
      },
      scoreDistribution: analytics.scoreDistribution,
      recentScores: analytics.recentScores,
      recentInterviews,
      unreadFeedback,
      achievements: analytics.achievements.slice(0, 5)
    }
  });
}));

/**
 * @route   GET /api/analytics/progress
 * @desc    Get progress over time
 * @access  Private
 */
router.get('/progress', protect, asyncHandler(async (req, res) => {
  const { period = 'weekly' } = req.query;
  
  const analytics = await Analytics.findOne({ user: req.user._id });

  if (!analytics) {
    return res.status(200).json({
      success: true,
      data: { progress: [] }
    });
  }

  let progress;

  switch (period) {
    case 'daily':
      // Get last 30 days
      progress = analytics.dailySnapshots.slice(-30);
      break;
    case 'weekly':
      // Get last 12 weeks
      progress = analytics.weeklyStats.slice(-12);
      break;
    case 'monthly':
      // Get last 12 months
      progress = analytics.monthlyStats.slice(-12);
      break;
    default:
      progress = analytics.dailySnapshots.slice(-30);
  }

  res.status(200).json({
    success: true,
    data: { 
      progress,
      period
    }
  });
}));

/**
 * @route   GET /api/analytics/category-performance
 * @desc    Get performance by category
 * @access  Private
 */
router.get('/category-performance', protect, asyncHandler(async (req, res) => {
  const analytics = await Analytics.findOne({ user: req.user._id });

  if (!analytics) {
    return res.status(200).json({
      success: true,
      data: { categoryPerformance: [] }
    });
  }

  const categoryDetails = {
    dsa: { name: 'Data Structures & Algorithms', color: '#3B82F6' },
    web: { name: 'Web Development', color: '#10B981' },
    ml: { name: 'Machine Learning', color: '#8B5CF6' },
    'system-design': { name: 'System Design', color: '#F59E0B' },
    behavioral: { name: 'Behavioral/HR', color: '#EC4899' },
    database: { name: 'Database', color: '#6366F1' },
    devops: { name: 'DevOps', color: '#14B8A6' },
    mobile: { name: 'Mobile Development', color: '#F97316' }
  };

  const categoryPerformance = analytics.categoryPerformance.map(cat => ({
    ...cat.toObject(),
    ...categoryDetails[cat.category]
  }));

  res.status(200).json({
    success: true,
    data: { categoryPerformance }
  });
}));

/**
 * @route   GET /api/analytics/skill-progress
 * @desc    Get skill progress
 * @access  Private
 */
router.get('/skill-progress', protect, asyncHandler(async (req, res) => {
  const analytics = await Analytics.findOne({ user: req.user._id });

  if (!analytics) {
    return res.status(200).json({
      success: true,
      data: { skillProgress: [] }
    });
  }

  res.status(200).json({
    success: true,
    data: { 
      skillProgress: analytics.skillProgress,
      learningPath: analytics.learningPath
    }
  });
}));

/**
 * @route   GET /api/analytics/achievements
 * @desc    Get user achievements
 * @access  Private
 */
router.get('/achievements', protect, asyncHandler(async (req, res) => {
  const analytics = await Analytics.findOne({ user: req.user._id });

  // Define all possible achievements
  const allAchievements = [
    { name: 'First Interview', description: 'Complete your first interview', category: 'milestone', icon: '🎯' },
    { name: 'Getting Started', description: 'Complete 5 interviews', category: 'milestone', icon: '🚀' },
    { name: 'Dedicated Learner', description: 'Complete 25 interviews', category: 'milestone', icon: '📚' },
    { name: 'Interview Master', description: 'Complete 100 interviews', category: 'milestone', icon: '👑' },
    { name: 'Perfect Score', description: 'Get 100% on an interview', category: 'score', icon: '💯' },
    { name: 'High Achiever', description: 'Score above 90% on 10 interviews', category: 'score', icon: '⭐' },
    { name: 'Consistent Performer', description: 'Maintain 7-day streak', category: 'streak', icon: '🔥' },
    { name: 'Unstoppable', description: 'Maintain 30-day streak', category: 'streak', icon: '💪' },
    { name: 'All-Rounder', description: 'Practice all categories', category: 'variety', icon: '🌟' },
    { name: 'Speed Demon', description: 'Complete interview under 10 minutes', category: 'speed', icon: '⚡' }
  ];

  const unlockedNames = analytics?.achievements?.map(a => a.name) || [];

  const achievements = allAchievements.map(achievement => ({
    ...achievement,
    unlocked: unlockedNames.includes(achievement.name),
    unlockedAt: analytics?.achievements?.find(a => a.name === achievement.name)?.unlockedAt
  }));

  res.status(200).json({
    success: true,
    data: {
      achievements,
      unlockedCount: unlockedNames.length,
      totalCount: allAchievements.length
    }
  });
}));

/**
 * @route   GET /api/analytics/leaderboard
 * @desc    Get leaderboard
 * @access  Private
 */
router.get('/leaderboard', protect, asyncHandler(async (req, res) => {
  const { category, limit = 10 } = req.query;

  const leaderboard = await Analytics.getLeaderboard({ 
    category, 
    limit: parseInt(limit) 
  });

  // Get current user's rank
  const userAnalytics = await Analytics.findOne({ user: req.user._id });
  let userRank = null;

  if (userAnalytics && userAnalytics.overallStats.completedInterviews >= 5) {
    const higherScores = await Analytics.countDocuments({
      'overallStats.completedInterviews': { $gte: 5 },
      'overallStats.averageScore': { $gt: userAnalytics.overallStats.averageScore }
    });
    userRank = higherScores + 1;
  }

  res.status(200).json({
    success: true,
    data: {
      leaderboard: leaderboard.map((entry, index) => ({
        rank: index + 1,
        user: {
          id: entry.user._id,
          name: `${entry.user.firstName} ${entry.user.lastName}`,
          avatar: entry.user.avatar
        },
        averageScore: Math.round(entry.overallStats.averageScore),
        completedInterviews: entry.overallStats.completedInterviews,
        currentStreak: entry.overallStats.currentStreak
      })),
      userRank,
      userScore: userAnalytics ? Math.round(userAnalytics.overallStats.averageScore) : 0
    }
  });
}));

/**
 * @route   POST /api/analytics/goals
 * @desc    Set a new goal
 * @access  Private
 */
router.post('/goals', protect, asyncHandler(async (req, res) => {
  const { title, description, targetValue, type, deadline } = req.body;

  const analytics = await Analytics.getOrCreate(req.user._id);

  analytics.goals.push({
    title,
    description,
    targetValue,
    currentValue: 0,
    type,
    deadline: deadline ? new Date(deadline) : null,
    status: 'active'
  });

  await analytics.save();

  res.status(201).json({
    success: true,
    message: 'Goal created successfully.',
    data: { goal: analytics.goals[analytics.goals.length - 1] }
  });
}));

/**
 * @route   GET /api/analytics/comparison
 * @desc    Get performance comparison with others
 * @access  Private
 */
router.get('/comparison', protect, asyncHandler(async (req, res) => {
  const userAnalytics = await Analytics.findOne({ user: req.user._id });

  if (!userAnalytics) {
    return res.status(200).json({
      success: true,
      data: { comparison: null }
    });
  }

  // Get average stats of all users
  const globalStats = await Analytics.aggregate([
    { $match: { 'overallStats.completedInterviews': { $gte: 1 } } },
    {
      $group: {
        _id: null,
        avgScore: { $avg: '$overallStats.averageScore' },
        avgInterviews: { $avg: '$overallStats.completedInterviews' },
        avgPracticeTime: { $avg: '$overallStats.totalPracticeTimeMinutes' }
      }
    }
  ]);

  const global = globalStats[0] || { avgScore: 0, avgInterviews: 0, avgPracticeTime: 0 };

  // Calculate percentile
  const totalUsers = await Analytics.countDocuments({ 'overallStats.completedInterviews': { $gte: 1 } });
  const usersBelow = await Analytics.countDocuments({
    'overallStats.completedInterviews': { $gte: 1 },
    'overallStats.averageScore': { $lt: userAnalytics.overallStats.averageScore }
  });

  const percentile = totalUsers > 0 ? Math.round((usersBelow / totalUsers) * 100) : 0;

  res.status(200).json({
    success: true,
    data: {
      comparison: {
        yourScore: Math.round(userAnalytics.overallStats.averageScore),
        globalAvgScore: Math.round(global.avgScore),
        yourInterviews: userAnalytics.overallStats.completedInterviews,
        globalAvgInterviews: Math.round(global.avgInterviews),
        yourPracticeTime: userAnalytics.overallStats.totalPracticeTimeMinutes,
        globalAvgPracticeTime: Math.round(global.avgPracticeTime),
        percentile,
        totalUsers
      }
    }
  });
}));

module.exports = router;
