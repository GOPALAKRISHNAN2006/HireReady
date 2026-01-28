/**
 * ===========================================
 * Career Routes
 * ===========================================
 * 
 * Handles career roadmap and progress tracking.
 * 
 * Routes:
 * GET /api/career/paths - Get all career paths
 * GET /api/career/paths/:id - Get single career path
 * GET /api/career/progress - Get user's career progress
 * POST /api/career/progress/start - Start a career path
 * POST /api/career/progress/milestone - Complete a milestone
 * GET /api/career/recommendations - Get personalized recommendations
 */

const express = require('express');
const router = express.Router();
const { CareerPath, UserCareerProgress } = require('../models/Career.model');
const { protect } = require('../middleware/auth.middleware');
const { asyncHandler } = require('../middleware/errorHandler');

/**
 * @route   GET /api/career/paths
 * @desc    Get all career paths
 * @access  Private
 */
router.get('/paths', protect, asyncHandler(async (req, res) => {
  const paths = await CareerPath.find()
    .select('name description icon color totalMilestones estimatedDuration salaryRange demandLevel prerequisites')
    .sort({ demandLevel: -1 });
  
  // Get user progress for each path
  const userProgress = await UserCareerProgress.find({ user: req.user._id })
    .select('selectedPath progressPercentage status');
  
  const progressMap = {};
  userProgress.forEach(p => {
    progressMap[p.selectedPath.toString()] = {
      progressPercentage: p.progressPercentage,
      status: p.status
    };
  });
  
  const pathsWithProgress = paths.map(path => {
    const pathObj = path.toObject();
    pathObj.userProgress = progressMap[path._id.toString()] || null;
    return pathObj;
  });
  
  res.status(200).json({
    success: true,
    data: { paths: pathsWithProgress }
  });
}));

/**
 * @route   GET /api/career/paths/:id
 * @desc    Get single career path with full details
 * @access  Private
 */
router.get('/paths/:id', protect, asyncHandler(async (req, res) => {
  const path = await CareerPath.findById(req.params.id);
  
  if (!path) {
    return res.status(404).json({
      success: false,
      message: 'Career path not found'
    });
  }
  
  // Get user's progress on this path
  const userProgress = await UserCareerProgress.findOne({
    user: req.user._id,
    selectedPath: path._id
  });
  
  res.status(200).json({
    success: true,
    data: {
      path,
      userProgress
    }
  });
}));

/**
 * @route   GET /api/career/progress
 * @desc    Get all user's career progress
 * @access  Private
 */
router.get('/progress', protect, asyncHandler(async (req, res) => {
  const progress = await UserCareerProgress.find({ user: req.user._id })
    .populate('selectedPath', 'name description icon color totalMilestones milestones')
    .sort({ updatedAt: -1 });
  
  res.status(200).json({
    success: true,
    data: { progress }
  });
}));

/**
 * @route   POST /api/career/progress/start
 * @desc    Start a career path
 * @access  Private
 */
router.post('/progress/start', protect, asyncHandler(async (req, res) => {
  const { pathId, targetCompletionDate } = req.body;
  
  const path = await CareerPath.findById(pathId);
  
  if (!path) {
    return res.status(404).json({
      success: false,
      message: 'Career path not found'
    });
  }
  
  // Check if already started
  let progress = await UserCareerProgress.findOne({
    user: req.user._id,
    selectedPath: pathId
  });
  
  if (progress) {
    // Reactivate if abandoned
    if (progress.status === 'abandoned') {
      progress.status = 'active';
      progress.startedAt = new Date();
      await progress.save();
    }
    
    return res.status(200).json({
      success: true,
      message: 'Career path already started',
      data: { progress }
    });
  }
  
  // Create new progress
  progress = await UserCareerProgress.create({
    user: req.user._id,
    selectedPath: pathId,
    targetCompletionDate: targetCompletionDate || null
  });
  
  await progress.populate('selectedPath', 'name description icon color');
  
  res.status(201).json({
    success: true,
    message: 'Career path started successfully',
    data: { progress }
  });
}));

/**
 * @route   POST /api/career/progress/milestone
 * @desc    Complete a milestone
 * @access  Private
 */
router.post('/progress/milestone', protect, asyncHandler(async (req, res) => {
  const { pathId, milestoneIndex, notes } = req.body;
  
  const progress = await UserCareerProgress.findOne({
    user: req.user._id,
    selectedPath: pathId
  }).populate('selectedPath');
  
  if (!progress) {
    return res.status(404).json({
      success: false,
      message: 'You have not started this career path'
    });
  }
  
  if (progress.status !== 'active') {
    return res.status(400).json({
      success: false,
      message: 'This career path is not active'
    });
  }
  
  // Complete the milestone
  await progress.completeMilestone(milestoneIndex);
  
  // Add notes if provided
  if (notes) {
    progress.notes.push({ content: notes });
    await progress.save();
  }
  
  res.status(200).json({
    success: true,
    message: 'Milestone completed!',
    data: {
      progress: {
        currentMilestone: progress.currentMilestone,
        progressPercentage: progress.progressPercentage,
        completedMilestones: progress.completedMilestones.length,
        status: progress.status
      }
    }
  });
}));

/**
 * @route   PUT /api/career/progress/:pathId/pause
 * @desc    Pause or resume a career path
 * @access  Private
 */
router.put('/progress/:pathId/pause', protect, asyncHandler(async (req, res) => {
  const progress = await UserCareerProgress.findOne({
    user: req.user._id,
    selectedPath: req.params.pathId
  });
  
  if (!progress) {
    return res.status(404).json({
      success: false,
      message: 'Progress not found'
    });
  }
  
  if (progress.status === 'active') {
    progress.status = 'paused';
  } else if (progress.status === 'paused') {
    progress.status = 'active';
  }
  
  await progress.save();
  
  res.status(200).json({
    success: true,
    data: { status: progress.status }
  });
}));

/**
 * @route   GET /api/career/recommendations
 * @desc    Get personalized career recommendations
 * @access  Private
 */
router.get('/recommendations', protect, asyncHandler(async (req, res) => {
  const User = require('../models/User.model');
  const user = await User.findById(req.user._id);
  
  // Get user's skills and preferences
  const targetRole = user.targetRole || '';
  const skills = user.skills || [];
  
  // Find matching career paths
  let paths = await CareerPath.find()
    .select('name description icon color demandLevel salaryRange prerequisites')
    .limit(5);
  
  // Get popular paths
  const popularPaths = await CareerPath.getPopularPaths(3);
  
  // Get user's current progress
  const activeProgress = await UserCareerProgress.find({
    user: req.user._id,
    status: 'active'
  }).populate('selectedPath', 'name');
  
  res.status(200).json({
    success: true,
    data: {
      recommended: paths,
      popular: popularPaths,
      inProgress: activeProgress
    }
  });
}));

/**
 * @route   GET /api/career/stats
 * @desc    Get career progress statistics
 * @access  Private
 */
router.get('/stats', protect, asyncHandler(async (req, res) => {
  const allProgress = await UserCareerProgress.find({ user: req.user._id });
  
  const stats = {
    totalPathsStarted: allProgress.length,
    pathsCompleted: allProgress.filter(p => p.status === 'completed').length,
    pathsInProgress: allProgress.filter(p => p.status === 'active').length,
    totalMilestonesCompleted: allProgress.reduce(
      (sum, p) => sum + p.completedMilestones.length, 0
    ),
    totalSkillsAcquired: allProgress.reduce(
      (sum, p) => sum + (p.skillsAcquired?.length || 0), 0
    )
  };
  
  res.status(200).json({
    success: true,
    data: { stats }
  });
}));

module.exports = router;
