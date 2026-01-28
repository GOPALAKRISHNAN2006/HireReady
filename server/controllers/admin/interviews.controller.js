/**
 * ===========================================
 * Admin Interviews Controller
 * ===========================================
 * 
 * Handles all interview review operations including:
 * - List interviews with pagination and filtering
 * - View detailed interview results
 * - Export interview data
 * - Analytics aggregation
 */

const Interview = require('../../models/Interview.model');
const User = require('../../models/User.model');

/**
 * Get all interviews with filtering and pagination
 */
const getInterviews = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      status = '',
      category = '',
      difficulty = '',
      userId = '',
      dateFrom = '',
      dateTo = '',
      minScore = '',
      maxScore = '',
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    // Build query object
    const query = {};

    // Status filter
    if (status) query.status = status;

    // Category filter
    if (category) query.category = category;

    // Difficulty filter
    if (difficulty) query.difficulty = difficulty;

    // User filter
    if (userId) query.user = userId;

    // Date range filter
    if (dateFrom || dateTo) {
      query.createdAt = {};
      if (dateFrom) query.createdAt.$gte = new Date(dateFrom);
      if (dateTo) query.createdAt.$lte = new Date(dateTo);
    }

    // Score range filter
    if (minScore || maxScore) {
      query.overallScore = {};
      if (minScore) query.overallScore.$gte = parseInt(minScore);
      if (maxScore) query.overallScore.$lte = parseInt(maxScore);
    }

    // Build sort object
    const sort = {};
    const validSortFields = ['createdAt', 'overallScore', 'category', 'difficulty', 'status'];
    sort[validSortFields.includes(sortBy) ? sortBy : 'createdAt'] = sortOrder === 'asc' ? 1 : -1;

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const limitNum = parseInt(limit);

    // Execute query
    const [interviews, total] = await Promise.all([
      Interview.find(query)
        .sort(sort)
        .skip(skip)
        .limit(limitNum)
        .populate('user', 'firstName lastName email avatar')
        .select('user category difficulty totalQuestions questionsAnswered overallScore status createdAt completedAt'),
      Interview.countDocuments(query)
    ]);

    res.status(200).json({
      success: true,
      data: {
        interviews,
        pagination: {
          page: parseInt(page),
          limit: limitNum,
          total,
          pages: Math.ceil(total / limitNum),
          hasNext: skip + limitNum < total,
          hasPrev: page > 1
        }
      }
    });
  } catch (error) {
    console.error('Get interviews error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch interviews',
      error: error.message
    });
  }
};

/**
 * Get detailed interview by ID
 */
const getInterviewById = async (req, res) => {
  try {
    const { id } = req.params;

    const interview = await Interview.findById(id)
      .populate('user', 'firstName lastName email avatar jobTitle company')
      .populate({
        path: 'responses.question',
        select: 'text category difficulty expectedAnswer keyPoints'
      });

    if (!interview) {
      return res.status(404).json({
        success: false,
        message: 'Interview not found'
      });
    }

    res.status(200).json({
      success: true,
      data: { interview }
    });
  } catch (error) {
    console.error('Get interview by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch interview',
      error: error.message
    });
  }
};

/**
 * Get interview statistics and analytics
 */
const getInterviewStats = async (req, res) => {
  try {
    const { period = 'month' } = req.query;

    // Calculate date range
    const now = new Date();
    let startDate;
    switch (period) {
      case 'week':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'month':
        startDate = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
        break;
      case 'year':
        startDate = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
        break;
      default:
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    }

    const [
      totalInterviews,
      completedInterviews,
      statusDistribution,
      categoryPerformance,
      difficultyPerformance,
      dailyInterviews,
      avgScoreByCategory,
      topPerformers
    ] = await Promise.all([
      Interview.countDocuments(),
      Interview.countDocuments({ status: 'completed' }),
      // Status distribution
      Interview.aggregate([
        { $group: { _id: '$status', count: { $sum: 1 } } }
      ]),
      // Category performance
      Interview.aggregate([
        { $match: { status: 'completed', createdAt: { $gte: startDate } } },
        {
          $group: {
            _id: '$category',
            totalInterviews: { $sum: 1 },
            avgScore: { $avg: '$overallScore' },
            maxScore: { $max: '$overallScore' },
            minScore: { $min: '$overallScore' }
          }
        },
        { $sort: { totalInterviews: -1 } }
      ]),
      // Difficulty performance
      Interview.aggregate([
        { $match: { status: 'completed' } },
        {
          $group: {
            _id: '$difficulty',
            count: { $sum: 1 },
            avgScore: { $avg: '$overallScore' }
          }
        }
      ]),
      // Daily interviews
      Interview.aggregate([
        { $match: { createdAt: { $gte: startDate } } },
        {
          $group: {
            _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
            count: { $sum: 1 },
            completed: {
              $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] }
            },
            avgScore: {
              $avg: { $cond: [{ $eq: ['$status', 'completed'] }, '$overallScore', null] }
            }
          }
        },
        { $sort: { _id: 1 } }
      ]),
      // Average score by category
      Interview.aggregate([
        { $match: { status: 'completed' } },
        {
          $group: {
            _id: '$category',
            avgScore: { $avg: '$overallScore' }
          }
        },
        { $sort: { avgScore: -1 } }
      ]),
      // Top performers
      Interview.aggregate([
        { $match: { status: 'completed', overallScore: { $gte: 80 } } },
        { $sort: { overallScore: -1 } },
        { $limit: 10 },
        {
          $lookup: {
            from: 'users',
            localField: 'user',
            foreignField: '_id',
            as: 'userInfo'
          }
        },
        { $unwind: '$userInfo' },
        {
          $project: {
            category: 1,
            difficulty: 1,
            overallScore: 1,
            createdAt: 1,
            userName: { $concat: ['$userInfo.firstName', ' ', '$userInfo.lastName'] },
            userEmail: '$userInfo.email'
          }
        }
      ])
    ]);

    res.status(200).json({
      success: true,
      data: {
        period,
        summary: {
          total: totalInterviews,
          completed: completedInterviews,
          completionRate: totalInterviews > 0 
            ? Math.round((completedInterviews / totalInterviews) * 100) 
            : 0
        },
        statusDistribution,
        categoryPerformance,
        difficultyPerformance,
        dailyInterviews,
        avgScoreByCategory,
        topPerformers
      }
    });
  } catch (error) {
    console.error('Get interview stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch interview statistics',
      error: error.message
    });
  }
};

/**
 * Export interviews data
 */
const exportInterviews = async (req, res) => {
  try {
    const {
      format = 'json',
      status = '',
      category = '',
      dateFrom = '',
      dateTo = ''
    } = req.query;

    // Build query
    const query = {};
    if (status) query.status = status;
    if (category) query.category = category;
    if (dateFrom || dateTo) {
      query.createdAt = {};
      if (dateFrom) query.createdAt.$gte = new Date(dateFrom);
      if (dateTo) query.createdAt.$lte = new Date(dateTo);
    }

    const interviews = await Interview.find(query)
      .populate('user', 'firstName lastName email')
      .select('user category difficulty totalQuestions questionsAnswered overallScore status createdAt completedAt')
      .lean();

    if (format === 'csv') {
      // Generate CSV
      const csvHeaders = [
        'ID', 'User Name', 'Email', 'Category', 'Difficulty',
        'Total Questions', 'Answered', 'Score', 'Status', 'Created At', 'Completed At'
      ];

      const csvRows = interviews.map(i => [
        i._id,
        `${i.user?.firstName || ''} ${i.user?.lastName || ''}`.trim(),
        i.user?.email || '',
        i.category,
        i.difficulty,
        i.totalQuestions,
        i.questionsAnswered,
        i.overallScore,
        i.status,
        i.createdAt?.toISOString(),
        i.completedAt?.toISOString() || ''
      ]);

      const csvContent = [csvHeaders, ...csvRows]
        .map(row => row.map(cell => `"${cell}"`).join(','))
        .join('\n');

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename=interviews-export.csv');
      return res.send(csvContent);
    }

    // Default JSON format
    res.status(200).json({
      success: true,
      data: {
        count: interviews.length,
        interviews
      }
    });
  } catch (error) {
    console.error('Export interviews error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to export interviews',
      error: error.message
    });
  }
};

/**
 * Delete an interview (admin only)
 */
const deleteInterview = async (req, res) => {
  try {
    const { id } = req.params;
    const adminUser = req.user;

    const interview = await Interview.findByIdAndDelete(id);

    if (!interview) {
      return res.status(404).json({
        success: false,
        message: 'Interview not found'
      });
    }

    console.log(`[AUDIT] Admin ${adminUser.email} deleted interview: ${id}`);

    res.status(200).json({
      success: true,
      message: 'Interview deleted successfully'
    });
  } catch (error) {
    console.error('Delete interview error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete interview',
      error: error.message
    });
  }
};

module.exports = {
  getInterviews,
  getInterviewById,
  getInterviewStats,
  exportInterviews,
  deleteInterview
};
