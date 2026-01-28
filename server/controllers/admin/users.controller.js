/**
 * ===========================================
 * Admin Users Controller
 * ===========================================
 * 
 * Handles all user management operations including:
 * - List users with pagination and filtering
 * - User details with analytics
 * - Role management
 * - Block/unblock operations
 * - Delete users (soft and hard)
 * - Audit logging for admin actions
 */

const User = require('../../models/User.model');
const Interview = require('../../models/Interview.model');
const Analytics = require('../../models/Analytics.model');
const Feedback = require('../../models/Feedback.model');
const Resume = require('../../models/Resume.model');
const { AptitudeTest } = require('../../models/Aptitude.model');
const { GDSession } = require('../../models/GroupDiscussion.model');

/**
 * Get all users with pagination, search, and filtering
 * Supports sorting and multiple filter criteria
 */
const getUsers = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      search = '',
      role = '',
      isActive = '',
      plan = '',
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    // Build query object based on filters
    const query = {};

    // Search across name and email
    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    // Role filter
    if (role && ['user', 'admin', 'moderator'].includes(role)) {
      query.role = role;
    }

    // Active status filter
    if (isActive !== '') {
      query.isActive = isActive === 'true';
    }

    // Plan filter
    if (plan && ['free', 'basic', 'premium', 'enterprise'].includes(plan)) {
      query.plan = plan;
    }

    // Build sort object
    const sort = {};
    const validSortFields = ['createdAt', 'firstName', 'lastName', 'email', 'role', 'lastLogin'];
    if (validSortFields.includes(sortBy)) {
      sort[sortBy] = sortOrder === 'asc' ? 1 : -1;
    } else {
      sort.createdAt = -1;
    }

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const limitNum = parseInt(limit);

    // Execute query with pagination
    const [users, total] = await Promise.all([
      User.find(query)
        .sort(sort)
        .skip(skip)
        .limit(limitNum)
        .select('-password -refreshToken'),
      User.countDocuments(query)
    ]);

    // Add interview count to each user
    const usersWithStats = await Promise.all(
      users.map(async (user) => {
        const interviewCount = await Interview.countDocuments({ user: user._id });
        return {
          ...user.toObject(),
          interviewCount,
          // Generate display name
          name: `${user.firstName} ${user.lastName}`
        };
      })
    );

    res.status(200).json({
      success: true,
      data: {
        users: usersWithStats,
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
    console.error('Get users error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch users',
      error: error.message
    });
  }
};

/**
 * Get detailed user information including analytics
 */
const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id).select('-password -refreshToken');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Get user's analytics
    const analytics = await Analytics.findOne({ user: id });

    // Get interview statistics and data
    const [
      totalInterviews,
      completedInterviews,
      interviews,
      avgScoreResult
    ] = await Promise.all([
      Interview.countDocuments({ user: id }),
      Interview.countDocuments({ user: id, status: 'completed' }),
      Interview.find({ user: id })
        .sort({ createdAt: -1 })
        .limit(20)
        .select('category difficulty overallScore status createdAt completedAt totalQuestions questionsAnswered'),
      Interview.aggregate([
        { $match: { user: user._id, status: 'completed', overallScore: { $gt: 0 } } },
        { $group: { _id: null, avgScore: { $avg: '$overallScore' } } }
      ])
    ]);

    // Get resumes with details
    const resumes = await Resume.find({ user: id })
      .sort({ updatedAt: -1 })
      .select('title template personalInfo createdAt updatedAt');

    // Get aptitude tests with results
    const aptitudeTests = await AptitudeTest.find({ user: id })
      .sort({ createdAt: -1 })
      .limit(20)
      .select('category totalQuestions correctAnswers score percentage status createdAt completedAt');

    // Get aptitude average score
    const aptitudeAvgResult = await AptitudeTest.aggregate([
      { $match: { user: user._id, status: 'completed' } },
      { $group: { _id: null, avgScore: { $avg: '$percentage' } } }
    ]);

    // Get GD sessions with feedback
    const gdSessions = await GDSession.find({ user: id })
      .sort({ createdAt: -1 })
      .limit(20)
      .select('topicTitle mode feedback.overallScore feedback.communication feedback.content feedback.leadership status createdAt completedAt duration');

    // Get GD average score
    const gdAvgResult = await GDSession.aggregate([
      { $match: { user: user._id, status: 'completed', 'feedback.overallScore': { $gt: 0 } } },
      { $group: { _id: null, avgScore: { $avg: '$feedback.overallScore' } } }
    ]);

    const averageInterviewScore = avgScoreResult.length > 0 
      ? Math.round(avgScoreResult[0].avgScore) 
      : 0;
    
    const averageAptitudeScore = aptitudeAvgResult.length > 0 
      ? Math.round(aptitudeAvgResult[0].avgScore) 
      : 0;

    const averageGDScore = gdAvgResult.length > 0 
      ? Math.round(gdAvgResult[0].avgScore) 
      : 0;

    res.status(200).json({
      success: true,
      data: {
        user: {
          ...user.toObject(),
          name: `${user.firstName} ${user.lastName}`
        },
        analytics: {
          totalInterviews,
          completedInterviews,
          averageScore: averageInterviewScore,
          totalAptitudeTests: aptitudeTests.length,
          averageAptitudeScore,
          totalGDSessions: gdSessions.length,
          averageGDScore,
          totalResumes: resumes.length
        },
        interviews,
        aptitudeTests,
        gdSessions,
        resumes
      }
    });
  } catch (error) {
    console.error('Get user by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user details',
      error: error.message
    });
  }
};

/**
 * Update user role
 * Includes validation and audit logging
 */
const updateUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;
    const adminUser = req.user;

    // Validate role
    const validRoles = ['user', 'admin', 'moderator'];
    if (!role || !validRoles.includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid role. Must be one of: user, admin, moderator'
      });
    }

    // Prevent self-demotion
    if (id === adminUser._id.toString() && role !== 'admin') {
      return res.status(400).json({
        success: false,
        message: 'You cannot change your own role'
      });
    }

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Store previous role for audit
    const previousRole = user.role;

    // Update role
    user.role = role;
    await user.save();

    // Log the action (audit trail)
    console.log(`[AUDIT] Admin ${adminUser.email} changed role of ${user.email} from ${previousRole} to ${role}`);

    res.status(200).json({
      success: true,
      message: `User role updated to ${role}`,
      data: {
        user: {
          _id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: user.role
        }
      }
    });
  } catch (error) {
    console.error('Update user role error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update user role',
      error: error.message
    });
  }
};

/**
 * Toggle user active status (ban/unban)
 */
const toggleUserStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const adminUser = req.user;

    // Prevent self-banning
    if (id === adminUser._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'You cannot ban yourself'
      });
    }

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Prevent banning other admins
    if (user.role === 'admin') {
      return res.status(400).json({
        success: false,
        message: 'Cannot ban admin users'
      });
    }

    // Toggle status
    const previousStatus = user.isActive;
    user.isActive = !user.isActive;
    await user.save();

    const action = user.isActive ? 'activated' : 'deactivated';

    // Log the action
    console.log(`[AUDIT] Admin ${adminUser.email} ${action} user ${user.email}`);

    res.status(200).json({
      success: true,
      message: `User ${action} successfully`,
      data: {
        user: {
          _id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          isActive: user.isActive
        }
      }
    });
  } catch (error) {
    console.error('Toggle user status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update user status',
      error: error.message
    });
  }
};

/**
 * Update user details
 * Allows admin to update various user fields
 */
const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { role, isActive, plan, planExpiresAt, firstName, lastName, email } = req.body;
    const adminUser = req.user;

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Build update object
    const updateData = {};
    
    if (role !== undefined) {
      const validRoles = ['user', 'admin', 'moderator'];
      if (validRoles.includes(role)) {
        updateData.role = role;
      }
    }
    
    if (isActive !== undefined) {
      updateData.isActive = isActive;
    }
    
    if (plan !== undefined) {
      const validPlans = ['free', 'basic', 'premium', 'enterprise'];
      if (validPlans.includes(plan)) {
        updateData.plan = plan;
      }
    }
    
    if (planExpiresAt) {
      updateData.planExpiresAt = new Date(planExpiresAt);
    }

    if (firstName) updateData.firstName = firstName;
    if (lastName) updateData.lastName = lastName;
    if (email) updateData.email = email;

    const updatedUser = await User.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).select('-password -refreshToken');

    // Log the action
    console.log(`[AUDIT] Admin ${adminUser.email} updated user ${updatedUser.email}: ${JSON.stringify(updateData)}`);

    res.status(200).json({
      success: true,
      message: 'User updated successfully',
      data: { user: updatedUser }
    });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update user',
      error: error.message
    });
  }
};

/**
 * Delete user (supports soft and hard delete)
 */
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { permanent = false } = req.query;
    const adminUser = req.user;

    // Prevent self-deletion
    if (id === adminUser._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'You cannot delete yourself'
      });
    }

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Prevent deleting other admins
    if (user.role === 'admin') {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete admin users'
      });
    }

    if (permanent === 'true') {
      // Hard delete - remove all associated data
      await Promise.all([
        User.findByIdAndDelete(id),
        Analytics.deleteOne({ user: id }),
        Interview.deleteMany({ user: id }),
        Feedback.deleteMany({ user: id }),
        Resume.deleteMany({ user: id }),
        AptitudeTest.deleteMany({ user: id }),
        GDSession.deleteMany({ user: id })
      ]);

      console.log(`[AUDIT] Admin ${adminUser.email} permanently deleted user ${user.email}`);

      res.status(200).json({
        success: true,
        message: 'User and all associated data permanently deleted'
      });
    } else {
      // Soft delete - deactivate and scramble email
      user.isActive = false;
      user.email = `deleted_${Date.now()}_${user.email}`;
      user.deletedAt = new Date();
      user.deletedBy = adminUser._id;
      await user.save();

      console.log(`[AUDIT] Admin ${adminUser.email} soft-deleted user ${user.email}`);

      res.status(200).json({
        success: true,
        message: 'User deactivated successfully'
      });
    }
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete user',
      error: error.message
    });
  }
};

/**
 * Get user interviews
 */
const getUserInterviews = async (req, res) => {
  try {
    const { id } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const limitNum = parseInt(limit);

    const [interviews, total] = await Promise.all([
      Interview.find({ user: id })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum)
        .select('category difficulty overallScore status createdAt completedAt totalQuestions questionsAnswered'),
      Interview.countDocuments({ user: id })
    ]);

    res.status(200).json({
      success: true,
      data: {
        interviews,
        pagination: {
          page: parseInt(page),
          limit: limitNum,
          total,
          pages: Math.ceil(total / limitNum)
        }
      }
    });
  } catch (error) {
    console.error('Get user interviews error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user interviews',
      error: error.message
    });
  }
};

module.exports = {
  getUsers,
  getUserById,
  updateUserRole,
  toggleUserStatus,
  updateUser,
  deleteUser,
  getUserInterviews
};
