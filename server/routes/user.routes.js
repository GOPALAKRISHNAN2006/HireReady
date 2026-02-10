/**
 * ===========================================
 * User Routes
 * ===========================================
 * 
 * Handles user profile management and user-related operations.
 * 
 * Routes:
 * GET /api/users/profile - Get user profile
 * PUT /api/users/profile - Update user profile
 * PUT /api/users/preferences - Update user preferences
 * DELETE /api/users/account - Delete user account
 * GET /api/users/:id - Get user by ID (admin)
 */

const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const User = require('../models/User.model');
const Analytics = require('../models/Analytics.model');
const { protect, authorize } = require('../middleware/auth.middleware');
const { asyncHandler } = require('../middleware/errorHandler');
const { validateProfileUpdate, validateObjectId } = require('../middleware/validation.middleware');

// Ensure uploads/avatars directory exists
const avatarUploadDir = path.join(__dirname, '..', 'uploads', 'avatars');
if (!fs.existsSync(avatarUploadDir)) {
  fs.mkdirSync(avatarUploadDir, { recursive: true });
}

// Configure multer for avatar upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, avatarUploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = `avatar-${req.user._id}-${Date.now()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (extname && mimetype) {
      return cb(null, true);
    }
    cb(new Error('Only image files are allowed!'));
  }
});

/**
 * @route   GET /api/users/me
 * @desc    Get current user profile (alias for /profile)
 * @access  Private
 */
router.get('/me', protect, asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id)
    .select('-refreshToken -passwordResetToken -passwordResetExpires');

  // Get user analytics summary
  const analytics = await Analytics.findOne({ user: req.user._id })
    .select('overallStats.totalInterviews overallStats.averageScore overallStats.currentStreak');

  res.status(200).json({
    success: true,
    data: {
      user,
      stats: analytics ? {
        totalInterviews: analytics.overallStats?.totalInterviews || 0,
        averageScore: analytics.overallStats?.averageScore || 0,
        currentStreak: analytics.overallStats?.currentStreak || 0
      } : null
    }
  });
}));

/**
 * @route   GET /api/users/profile
 * @desc    Get current user profile
 * @access  Private
 */
router.get('/profile', protect, asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id)
    .select('-refreshToken -passwordResetToken -passwordResetExpires');

  // Get user analytics summary
  const analytics = await Analytics.findOne({ user: req.user._id })
    .select('overallStats.totalInterviews overallStats.averageScore overallStats.currentStreak');

  res.status(200).json({
    success: true,
    data: {
      user,
      stats: analytics ? {
        totalInterviews: analytics.overallStats?.totalInterviews || 0,
        averageScore: analytics.overallStats?.averageScore || 0,
        currentStreak: analytics.overallStats?.currentStreak || 0
      } : null
    }
  });
}));

/**
 * @route   PUT /api/users/profile
 * @desc    Update user profile
 * @access  Private
 */
router.put('/profile', protect, validateProfileUpdate, asyncHandler(async (req, res) => {
  const allowedFields = [
    'firstName', 'lastName', 'phone', 'bio', 
    'jobTitle', 'company', 'experience', 'skills', 'targetRole'
  ];

  // Build update object with only allowed fields
  const updateData = {};
  allowedFields.forEach(field => {
    if (req.body[field] !== undefined) {
      updateData[field] = req.body[field];
    }
  });

  const user = await User.findByIdAndUpdate(
    req.user._id,
    updateData,
    { new: true, runValidators: true }
  ).select('-refreshToken -password');

  res.status(200).json({
    success: true,
    message: 'Profile updated successfully.',
    data: { user }
  });
}));

/**
 * @route   PUT /api/users/avatar
 * @desc    Upload/update user avatar
 * @access  Private
 */
router.put('/avatar', protect, (req, res, next) => {
  upload.single('avatar')(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ success: false, message: 'Image size should be less than 5MB.' });
      }
      return res.status(400).json({ success: false, message: err.message });
    }
    if (err) {
      return res.status(400).json({ success: false, message: err.message || 'Only image files are allowed!' });
    }
    next();
  });
}, asyncHandler(async (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: 'Please upload an image file.'
    });
  }

  const avatarPath = `/uploads/avatars/${req.file.filename}`;

  const user = await User.findByIdAndUpdate(
    req.user._id,
    { avatar: avatarPath },
    { new: true }
  ).select('-refreshToken -password');

  res.status(200).json({
    success: true,
    message: 'Avatar updated successfully.',
    data: { avatar: avatarPath, user }
  });
}));

/**
 * @route   PUT /api/users/preferences
 * @desc    Update user preferences and settings
 * @access  Private
 */
router.put('/preferences', protect, asyncHandler(async (req, res) => {
  const { preferences, preferredCategories, difficultyLevel } = req.body;

  const updateData = {};

  // Handle full preferences object from Settings page
  if (preferences) {
    updateData.preferences = {
      // Appearance
      theme: preferences.theme || 'light',
      fontSize: preferences.fontSize || 'medium',
      reducedMotion: preferences.reducedMotion || false,
      
      // Notifications
      emailNotifications: preferences.emailNotifications !== false,
      pushNotifications: preferences.pushNotifications !== false,
      interviewReminders: preferences.interviewReminders !== false,
      weeklyReport: preferences.weeklyReport !== false,
      marketingEmails: preferences.marketingEmails || false,
      
      // Privacy
      profileVisibility: preferences.profileVisibility || 'public',
      showOnLeaderboard: preferences.showOnLeaderboard !== false,
      shareProgress: preferences.shareProgress !== false,
      
      // Interview Preferences
      defaultDifficulty: preferences.defaultDifficulty || 'medium',
      defaultDuration: preferences.defaultDuration || 30,
      autoSaveAnswers: preferences.autoSaveAnswers !== false,
      showHints: preferences.showHints !== false,
      soundEnabled: preferences.soundEnabled !== false,
      
      // Language & Region
      language: preferences.language || 'en',
      timezone: preferences.timezone || 'UTC',
    };
  }

  // Handle legacy preferredCategories field
  if (preferredCategories) {
    const validCategories = ['dsa', 'web', 'ml', 'system-design', 'behavioral', 'database', 'devops', 'mobile'];
    const filteredCategories = preferredCategories.filter(cat => validCategories.includes(cat));
    updateData.preferredCategories = filteredCategories;
  }

  // Handle legacy difficultyLevel field
  if (difficultyLevel) {
    const validLevels = ['easy', 'medium', 'hard', 'expert'];
    if (validLevels.includes(difficultyLevel)) {
      updateData.difficultyLevel = difficultyLevel;
    }
  }

  const user = await User.findByIdAndUpdate(
    req.user._id,
    updateData,
    { new: true }
  ).select('-refreshToken -password');

  res.status(200).json({
    success: true,
    message: 'Preferences updated successfully.',
    data: { user }
  });
}));

/**
 * @route   DELETE /api/users/account
 * @desc    Delete user account
 * @access  Private
 */
router.delete('/account', protect, asyncHandler(async (req, res) => {
  const { password, confirmation } = req.body;

  if (confirmation !== 'DELETE') {
    return res.status(400).json({
      success: false,
      message: 'Please type "DELETE" to confirm account deletion.'
    });
  }

  // Get user with password
  const user = await User.findById(req.user._id).select('+password');

  // Verify password
  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    return res.status(401).json({
      success: false,
      message: 'Incorrect password.'
    });
  }

  // Soft delete - just deactivate
  user.isActive = false;
  user.email = `deleted_${Date.now()}_${user.email}`;
  await user.save();

  // Alternative: Hard delete
  // await User.findByIdAndDelete(req.user._id);
  // await Analytics.findOneAndDelete({ user: req.user._id });

  res.status(200).json({
    success: true,
    message: 'Account deleted successfully.'
  });
}));

/**
 * @route   GET /api/users/notifications
 * @desc    Get user notifications
 * @access  Private
 */
router.get('/notifications', protect, asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select('notifications');
  
  // Return notifications sorted by date (newest first)
  const notifications = (user?.notifications || [])
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .map(n => ({
      id: n._id,
      _id: n._id,
      type: n.type,
      title: n.title,
      message: n.message,
      read: n.read,
      time: n.createdAt,
      createdAt: n.createdAt
    }));

  res.status(200).json({
    success: true,
    data: { notifications }
  });
}));

/**
 * @route   PUT /api/users/notifications/:id/read
 * @desc    Mark a notification as read
 * @access  Private
 */
router.put('/notifications/:id/read', protect, asyncHandler(async (req, res) => {
  const notificationId = req.params.id;
  
  await User.updateOne(
    { _id: req.user._id, 'notifications._id': notificationId },
    { $set: { 'notifications.$.read': true } }
  );

  res.status(200).json({
    success: true,
    message: 'Notification marked as read.'
  });
}));

/**
 * @route   PUT /api/users/notifications/read-all
 * @desc    Mark all notifications as read
 * @access  Private
 */
router.put('/notifications/read-all', protect, asyncHandler(async (req, res) => {
  await User.updateOne(
    { _id: req.user._id },
    { $set: { 'notifications.$[].read': true } }
  );

  res.status(200).json({
    success: true,
    message: 'All notifications marked as read.'
  });
}));

/**
 * @route   DELETE /api/users/notifications/:id
 * @desc    Delete a notification
 * @access  Private
 */
router.delete('/notifications/:id', protect, asyncHandler(async (req, res) => {
  const notificationId = req.params.id;
  
  await User.findByIdAndUpdate(req.user._id, {
    $pull: { notifications: { _id: notificationId } }
  });

  res.status(200).json({
    success: true,
    message: 'Notification deleted.'
  });
}));

/**
 * @route   GET /api/users/skills/popular
 * @desc    Get popular skills among users
 * @access  Private
 */
router.get('/skills/popular', protect, asyncHandler(async (req, res) => {
  const popularSkills = await User.aggregate([
    { $unwind: '$skills' },
    { $group: { _id: '$skills', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: 20 }
  ]);

  res.status(200).json({
    success: true,
    data: { skills: popularSkills }
  });
}));

/**
 * @route   GET /api/users/export-data
 * @desc    Export all user data as JSON
 * @access  Private
 */
router.get('/export-data', protect, asyncHandler(async (req, res) => {
  const Interview = require('../models/Interview.model');
  
  // Gather all user data
  const user = await User.findById(req.user._id)
    .select('-refreshToken -password -passwordResetToken -passwordResetExpires');
  
  const analytics = await Analytics.findOne({ user: req.user._id });
  
  // Try to get interviews if model exists
  let interviews = [];
  try {
    interviews = await Interview.find({ user: req.user._id })
      .select('-__v')
      .sort({ createdAt: -1 })
      .limit(500);
  } catch (e) {
    // Model might not exist, skip
  }

  const exportData = {
    exportedAt: new Date().toISOString(),
    user: user?.toObject() || {},
    analytics: analytics?.toObject() || null,
    interviews: interviews.map(i => i.toObject()),
  };

  // Set headers for file download
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Content-Disposition', `attachment; filename=hireready-data-${Date.now()}.json`);
  
  res.status(200).json(exportData);
}));

/**
 * @route   GET /api/users/:id
 * @desc    Get user by ID (admin only)
 * @access  Private/Admin
 */
router.get('/:id', 
  protect, 
  authorize('admin', 'moderator'),
  validateObjectId('id'),
  asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id)
      .select('-refreshToken -password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found.'
      });
    }

    res.status(200).json({
      success: true,
      data: { user }
    });
  })
);

module.exports = router;
