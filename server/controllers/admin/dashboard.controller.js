/**
 * ===========================================
 * Admin Dashboard Controller
 * ===========================================
 * 
 * Handles all dashboard-related operations including:
 * - Aggregate statistics
 * - Recent activity feeds
 * - System health metrics
 * - Analytics data
 */

const User = require('../../models/User.model');
const Question = require('../../models/Question.model');
const Interview = require('../../models/Interview.model');
const Analytics = require('../../models/Analytics.model');
const Feedback = require('../../models/Feedback.model');
const { AptitudeQuestion, AptitudeTest } = require('../../models/Aptitude.model');
const { GDTopic, GDSession } = require('../../models/GroupDiscussion.model');

/**
 * Get comprehensive admin dashboard statistics
 * Aggregates data from multiple collections for overview display
 */
const getStats = async (req, res) => {
  try {
    // Calculate date ranges for time-based metrics
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const thisWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

    // Fetch all statistics in parallel for performance
    const [
      totalUsers,
      activeUsers,
      newUsersToday,
      newUsersThisWeek,
      newUsersThisMonth,
      totalQuestions,
      approvedQuestions,
      pendingQuestions,
      totalInterviews,
      completedInterviews,
      interviewsToday,
      interviewsThisWeek,
      totalAptitudeQuestions,
      totalAptitudeTests,
      totalGDTopics,
      totalGDSessions,
      avgScoreResult,
      avgAptitudeResult,
      avgGDResult,
      scoreDistributionData,
      userGrowthData,
      categoryStatsData
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ isActive: true }),
      User.countDocuments({ createdAt: { $gte: today } }),
      User.countDocuments({ createdAt: { $gte: thisWeek } }),
      User.countDocuments({ createdAt: { $gte: thisMonth } }),
      Question.countDocuments(),
      Question.countDocuments({ isApproved: true, isActive: true }),
      Question.countDocuments({ isApproved: false, isActive: true }),
      Interview.countDocuments(),
      Interview.countDocuments({ status: 'completed' }),
      Interview.countDocuments({ createdAt: { $gte: today } }),
      Interview.countDocuments({ createdAt: { $gte: thisWeek } }),
      AptitudeQuestion.countDocuments(),
      AptitudeTest.countDocuments(),
      GDTopic.countDocuments({ isActive: true }),
      GDSession.countDocuments(),
      // Average interview score
      Interview.aggregate([
        { $match: { status: 'completed', overallScore: { $gt: 0 } } },
        { $group: { _id: null, avgScore: { $avg: '$overallScore' } } }
      ]),
      // Average aptitude score
      AptitudeTest.aggregate([
        { $match: { status: 'completed', percentage: { $gt: 0 } } },
        { $group: { _id: null, avgScore: { $avg: '$percentage' } } }
      ]),
      // Average GD score
      GDSession.aggregate([
        { $match: { status: 'completed', 'feedback.overallScore': { $gt: 0 } } },
        { $group: { _id: null, avgScore: { $avg: '$feedback.overallScore' } } }
      ]),
      // Score distribution for interviews
      Interview.aggregate([
        { $match: { status: 'completed', overallScore: { $gt: 0 } } },
        {
          $bucket: {
            groupBy: '$overallScore',
            boundaries: [0, 40, 60, 80, 101],
            default: 'other',
            output: { count: { $sum: 1 } }
          }
        }
      ]),
      // User growth over last 6 months
      User.aggregate([
        {
          $match: {
            createdAt: { $gte: new Date(now.getFullYear(), now.getMonth() - 5, 1) }
          }
        },
        {
          $group: {
            _id: {
              year: { $year: '$createdAt' },
              month: { $month: '$createdAt' }
            },
            count: { $sum: 1 }
          }
        },
        { $sort: { '_id.year': 1, '_id.month': 1 } }
      ]),
      // Interviews by category
      Interview.aggregate([
        { $match: { status: 'completed' } },
        {
          $group: {
            _id: '$category',
            count: { $sum: 1 },
            avgScore: { $avg: '$overallScore' }
          }
        },
        { $sort: { count: -1 } }
      ])
    ]);

    // Process average scores
    const averageScore = avgScoreResult.length > 0 
      ? Math.round(avgScoreResult[0].avgScore) 
      : 0;
    
    const averageAptitudeScore = avgAptitudeResult.length > 0 
      ? Math.round(avgAptitudeResult[0].avgScore) 
      : 0;
    
    const averageGDScore = avgGDResult.length > 0 
      ? Math.round(avgGDResult[0].avgScore) 
      : 0;

    // Process score distribution
    const scoreDistribution = [];
    const distributionLabels = {
      0: { name: 'Needs Improvement (<40%)', color: '#ef4444' },
      40: { name: 'Average (40-59%)', color: '#f59e0b' },
      60: { name: 'Good (60-79%)', color: '#3b82f6' },
      80: { name: 'Excellent (80-100%)', color: '#22c55e' }
    };
    
    scoreDistributionData.forEach(bucket => {
      if (bucket._id !== 'other' && distributionLabels[bucket._id]) {
        scoreDistribution.push({
          ...distributionLabels[bucket._id],
          value: bucket.count
        });
      }
    });

    // If no data, show empty distribution
    if (scoreDistribution.length === 0) {
      scoreDistribution.push(
        { name: 'Excellent (80-100%)', value: 0, color: '#22c55e' },
        { name: 'Good (60-79%)', value: 0, color: '#3b82f6' },
        { name: 'Average (40-59%)', value: 0, color: '#f59e0b' },
        { name: 'Needs Improvement (<40%)', value: 0, color: '#ef4444' }
      );
    }

    // Format user growth data for charts
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const userGrowth = userGrowthData.map(item => ({
      month: monthNames[item._id.month - 1],
      users: item.count
    }));

    // Format category data with proper names
    const categoryNames = {
      'dsa': 'DSA',
      'web': 'Web Dev',
      'web-development': 'Web Dev',
      'ml': 'ML/AI',
      'machine-learning': 'ML/AI',
      'system-design': 'System Design',
      'behavioral': 'Behavioral',
      'database': 'Database',
      'devops': 'DevOps',
      'mobile': 'Mobile',
      'general': 'General',
      'mixed': 'Mixed'
    };

    const interviewsByCategory = categoryStatsData.map(item => ({
      name: categoryNames[item._id] || item._id,
      count: item.count,
      avgScore: Math.round(item.avgScore || 0)
    }));

    // Calculate growth percentages
    const lastMonthUsers = await User.countDocuments({
      createdAt: { $gte: lastMonth, $lt: thisMonth }
    });
    const userGrowthPercent = lastMonthUsers > 0 
      ? Math.round(((newUsersThisMonth - lastMonthUsers) / lastMonthUsers) * 100)
      : 100;

    res.status(200).json({
      success: true,
      data: {
        totalUsers,
        activeUsers,
        inactiveUsers: totalUsers - activeUsers,
        newUsersToday,
        newUsersThisWeek,
        newUsersThisMonth,
        userGrowthPercent,
        totalQuestions,
        approvedQuestions,
        pendingQuestions,
        totalInterviews,
        completedInterviews,
        inProgressInterviews: totalInterviews - completedInterviews,
        interviewsToday,
        interviewsThisWeek,
        totalAptitudeQuestions,
        totalAptitudeTests,
        totalGDTopics,
        totalGDSessions,
        activeToday: interviewsToday + newUsersToday,
        averageScore,
        averageAptitudeScore,
        averageGDScore,
        scoreDistribution,
        userGrowth,
        interviewsByCategory
      }
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch dashboard statistics',
      error: error.message
    });
  }
};

/**
 * Get recent activity feed
 * Combines recent users, interviews, and system events
 */
const getActivity = async (req, res) => {
  try {
    const { limit = 20 } = req.query;
    const limitNum = parseInt(limit);

    // Fetch recent data in parallel
    const [recentUsers, recentInterviews, recentQuestions] = await Promise.all([
      User.find()
        .sort({ createdAt: -1 })
        .limit(Math.ceil(limitNum / 3))
        .select('firstName lastName email createdAt'),
      Interview.find()
        .sort({ updatedAt: -1 })
        .limit(Math.ceil(limitNum / 3))
        .populate('user', 'firstName lastName email')
        .select('user category overallScore status createdAt updatedAt completedAt'),
      Question.find()
        .sort({ createdAt: -1 })
        .limit(Math.ceil(limitNum / 3))
        .populate('createdBy', 'firstName lastName')
        .select('text category createdBy createdAt isApproved')
    ]);

    // Convert to activity items with consistent format
    const activities = [];

    // Add user registrations
    recentUsers.forEach(user => {
      activities.push({
        type: 'user_signup',
        message: `New user registered: ${user.firstName} ${user.lastName}`,
        details: user.email,
        timestamp: user.createdAt,
        time: getRelativeTime(user.createdAt)
      });
    });

    // Add interview completions
    recentInterviews.forEach(interview => {
      if (interview.status === 'completed') {
        activities.push({
          type: 'interview_complete',
          message: `Interview completed by ${interview.user?.firstName || 'User'}`,
          details: `Category: ${interview.category}, Score: ${Math.round(interview.overallScore)}%`,
          timestamp: interview.completedAt || interview.updatedAt,
          time: getRelativeTime(interview.completedAt || interview.updatedAt)
        });
      } else if (interview.status === 'in-progress') {
        activities.push({
          type: 'interview_started',
          message: `Interview started by ${interview.user?.firstName || 'User'}`,
          details: `Category: ${interview.category}`,
          timestamp: interview.createdAt,
          time: getRelativeTime(interview.createdAt)
        });
      }
    });

    // Add question additions
    recentQuestions.forEach(question => {
      activities.push({
        type: 'question_added',
        message: `New question added${question.createdBy ? ` by ${question.createdBy.firstName}` : ''}`,
        details: question.text.substring(0, 50) + (question.text.length > 50 ? '...' : ''),
        timestamp: question.createdAt,
        time: getRelativeTime(question.createdAt),
        isApproved: question.isApproved
      });
    });

    // Sort by timestamp and limit
    activities.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    const items = activities.slice(0, limitNum);

    res.status(200).json({
      success: true,
      data: { items }
    });
  } catch (error) {
    console.error('Activity feed error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch activity feed',
      error: error.message
    });
  }
};

/**
 * Get system analytics for charts and graphs
 */
const getAnalytics = async (req, res) => {
  try {
    const { period = 'week' } = req.query;

    // Calculate date range based on period
    const now = new Date();
    let startDate;
    let groupFormat;

    switch (period) {
      case 'day':
        startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        groupFormat = '%H:00';
        break;
      case 'week':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        groupFormat = '%Y-%m-%d';
        break;
      case 'month':
        startDate = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
        groupFormat = '%Y-%m-%d';
        break;
      case 'year':
        startDate = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
        groupFormat = '%Y-%m';
        break;
      default:
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        groupFormat = '%Y-%m-%d';
    }

    // Get daily interview counts and scores
    const dailyInterviews = await Interview.aggregate([
      { $match: { createdAt: { $gte: startDate } } },
      {
        $group: {
          _id: { $dateToString: { format: groupFormat, date: '$createdAt' } },
          count: { $sum: 1 },
          avgScore: { $avg: '$overallScore' },
          completed: {
            $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] }
          }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Get daily user registrations
    const dailyRegistrations = await User.aggregate([
      { $match: { createdAt: { $gte: startDate } } },
      {
        $group: {
          _id: { $dateToString: { format: groupFormat, date: '$createdAt' } },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Get difficulty distribution
    const difficultyDistribution = await Interview.aggregate([
      { $match: { createdAt: { $gte: startDate } } },
      {
        $group: {
          _id: '$difficulty',
          count: { $sum: 1 }
        }
      }
    ]);

    // Get score distribution
    const scoreDistribution = await Interview.aggregate([
      { $match: { status: 'completed', createdAt: { $gte: startDate } } },
      {
        $bucket: {
          groupBy: '$overallScore',
          boundaries: [0, 20, 40, 60, 80, 100],
          default: 'other',
          output: { count: { $sum: 1 } }
        }
      }
    ]);

    res.status(200).json({
      success: true,
      data: {
        period,
        dailyInterviews,
        dailyRegistrations,
        difficultyDistribution,
        scoreDistribution
      }
    });
  } catch (error) {
    console.error('Analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch analytics',
      error: error.message
    });
  }
};

/**
 * Helper function to get relative time string
 */
function getRelativeTime(date) {
  const now = new Date();
  const diff = now - new Date(date);
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes} min ago`;
  if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  if (days < 7) return `${days} day${days > 1 ? 's' : ''} ago`;
  return new Date(date).toLocaleDateString();
}

module.exports = {
  getStats,
  getActivity,
  getAnalytics
};
