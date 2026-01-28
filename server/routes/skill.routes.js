/**
 * ===========================================
 * Skill Routes
 * ===========================================
 * 
 * Handles skill assessment and tracking for Skill Radar.
 * 
 * Routes:
 * GET /api/skills - Get user's skill profile
 * GET /api/skills/categories - Get all skill categories
 * POST /api/skills/assess - Submit skill assessment
 * PUT /api/skills/update - Update skill level manually
 * GET /api/skills/recommendations - Get improvement recommendations
 * GET /api/skills/leaderboard - Get skill leaderboard
 */

const express = require('express');
const router = express.Router();
const { SkillCategory, UserSkill } = require('../models/Skill.model');
const { protect } = require('../middleware/auth.middleware');
const { asyncHandler } = require('../middleware/errorHandler');

/**
 * @route   GET /api/skills
 * @desc    Get user's skill profile
 * @access  Private
 */
router.get('/', protect, asyncHandler(async (req, res) => {
  const userSkill = await UserSkill.getOrCreate(req.user._id);
  
  // Calculate recommendations if not present
  if (userSkill.recommendations.length === 0) {
    userSkill.generateRecommendations();
    await userSkill.save();
  }
  
  res.status(200).json({
    success: true,
    data: {
      skills: userSkill.skills,
      overallLevel: userSkill.overallLevel,
      rank: userSkill.rank,
      strengths: userSkill.strengths,
      weaknesses: userSkill.weaknesses,
      recommendations: userSkill.recommendations.slice(0, 5)
    }
  });
}));

/**
 * @route   GET /api/skills/categories
 * @desc    Get all skill categories
 * @access  Private
 */
router.get('/categories', protect, asyncHandler(async (req, res) => {
  const categories = await SkillCategory.find()
    .select('name displayName description icon color subSkills maxLevel')
    .sort({ name: 1 });
  
  res.status(200).json({
    success: true,
    data: { categories }
  });
}));

/**
 * @route   POST /api/skills/assess
 * @desc    Submit skill assessment results
 * @access  Private
 */
router.post('/assess', protect, asyncHandler(async (req, res) => {
  const { assessments } = req.body;
  // assessments: [{ categoryName: string, score: number }]
  
  if (!assessments || !Array.isArray(assessments)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid assessment data'
    });
  }
  
  const userSkill = await UserSkill.getOrCreate(req.user._id);
  
  // Update each skill
  for (const assessment of assessments) {
    await userSkill.updateSkillLevel(
      assessment.categoryName,
      assessment.score,
      'assessment'
    );
  }
  
  // Refresh and calculate
  userSkill.calculateOverall();
  userSkill.generateRecommendations();
  userSkill.lastFullAssessment = new Date();
  
  // Add to assessment history
  userSkill.assessmentHistory.push({
    date: new Date(),
    overallScore: userSkill.overallLevel,
    skillScores: assessments.map(a => ({
      skill: a.categoryName,
      score: a.score
    }))
  });
  
  await userSkill.save();
  
  res.status(200).json({
    success: true,
    message: 'Assessment completed successfully',
    data: {
      overallLevel: userSkill.overallLevel,
      rank: userSkill.rank,
      skills: userSkill.skills,
      strengths: userSkill.strengths,
      weaknesses: userSkill.weaknesses
    }
  });
}));

/**
 * @route   PUT /api/skills/update
 * @desc    Update a single skill level
 * @access  Private
 */
router.put('/update', protect, asyncHandler(async (req, res) => {
  const { categoryName, level, targetLevel, source } = req.body;
  
  if (!categoryName || level === undefined) {
    return res.status(400).json({
      success: false,
      message: 'Category name and level are required'
    });
  }
  
  const userSkill = await UserSkill.getOrCreate(req.user._id);
  
  await userSkill.updateSkillLevel(categoryName, level, source || 'manual');
  
  // Update target if provided
  if (targetLevel !== undefined) {
    const skillIndex = userSkill.skills.findIndex(s => s.categoryName === categoryName);
    if (skillIndex >= 0) {
      userSkill.skills[skillIndex].targetLevel = targetLevel;
      await userSkill.save();
    }
  }
  
  res.status(200).json({
    success: true,
    data: {
      skill: userSkill.skills.find(s => s.categoryName === categoryName),
      overallLevel: userSkill.overallLevel
    }
  });
}));

/**
 * @route   GET /api/skills/recommendations
 * @desc    Get skill improvement recommendations
 * @access  Private
 */
router.get('/recommendations', protect, asyncHandler(async (req, res) => {
  const userSkill = await UserSkill.getOrCreate(req.user._id);
  
  // Regenerate recommendations
  userSkill.generateRecommendations();
  await userSkill.save();
  
  // Get detailed recommendations with resources
  const recommendations = userSkill.recommendations.map(rec => ({
    ...rec.toObject(),
    resources: getResourcesForSkill(rec.skill)
  }));
  
  res.status(200).json({
    success: true,
    data: {
      recommendations,
      strengths: userSkill.strengths,
      weaknesses: userSkill.weaknesses
    }
  });
}));

// Helper function to get learning resources
function getResourcesForSkill(skillName) {
  const resources = {
    'Data Structures': [
      { title: 'LeetCode - Data Structures', url: 'https://leetcode.com/explore/learn/', type: 'practice' },
      { title: 'Visualgo - DS Visualization', url: 'https://visualgo.net/', type: 'article' }
    ],
    'Algorithms': [
      { title: 'Algorithm Practice', url: 'https://leetcode.com/problemset/', type: 'practice' },
      { title: 'Big O Notation Guide', url: '#', type: 'article' }
    ],
    'System Design': [
      { title: 'System Design Primer', url: 'https://github.com/donnemartin/system-design-primer', type: 'article' },
      { title: 'Grokking System Design', url: '#', type: 'course' }
    ],
    'Problem Solving': [
      { title: 'Competitive Programming', url: 'https://codeforces.com/', type: 'practice' }
    ],
    'Communication': [
      { title: 'STAR Method Guide', url: '#', type: 'article' }
    ],
    'Behavioral': [
      { title: 'Behavioral Interview Prep', url: '#', type: 'video' }
    ]
  };
  
  return resources[skillName] || [];
}

/**
 * @route   GET /api/skills/history
 * @desc    Get skill assessment history
 * @access  Private
 */
router.get('/history', protect, asyncHandler(async (req, res) => {
  const userSkill = await UserSkill.findOne({ user: req.user._id });
  
  if (!userSkill) {
    return res.status(200).json({
      success: true,
      data: { history: [] }
    });
  }
  
  // Get skill-specific history
  const skillHistory = {};
  for (const skill of userSkill.skills) {
    skillHistory[skill.categoryName] = skill.history.slice(-10);
  }
  
  res.status(200).json({
    success: true,
    data: {
      assessmentHistory: userSkill.assessmentHistory.slice(-10),
      skillHistory
    }
  });
}));

/**
 * @route   GET /api/skills/leaderboard
 * @desc    Get skill leaderboard
 * @access  Private
 */
router.get('/leaderboard', protect, asyncHandler(async (req, res) => {
  const { skill, limit = 20 } = req.query;
  
  let leaderboard;
  
  if (skill) {
    // Leaderboard for specific skill
    leaderboard = await UserSkill.aggregate([
      { $unwind: '$skills' },
      { $match: { 'skills.categoryName': skill } },
      { $sort: { 'skills.currentLevel': -1 } },
      { $limit: parseInt(limit) },
      { $lookup: {
        from: 'users',
        localField: 'user',
        foreignField: '_id',
        as: 'userInfo'
      }},
      { $unwind: '$userInfo' },
      { $project: {
        user: {
          firstName: '$userInfo.firstName',
          lastName: '$userInfo.lastName',
          avatar: '$userInfo.avatar'
        },
        skill: '$skills.categoryName',
        level: '$skills.currentLevel'
      }}
    ]);
  } else {
    // Overall leaderboard
    leaderboard = await UserSkill.getLeaderboard(parseInt(limit));
  }
  
  // Get user's rank
  const userSkill = await UserSkill.findOne({ user: req.user._id });
  let userRank = null;
  
  if (userSkill) {
    const higherCount = await UserSkill.countDocuments({
      overallLevel: { $gt: userSkill.overallLevel }
    });
    userRank = higherCount + 1;
  }
  
  res.status(200).json({
    success: true,
    data: {
      leaderboard: leaderboard.map((entry, index) => ({
        rank: index + 1,
        ...entry.toObject ? entry.toObject() : entry
      })),
      userRank,
      userLevel: userSkill?.overallLevel || 0
    }
  });
}));

/**
 * @route   GET /api/skills/radar-data
 * @desc    Get data formatted for radar chart
 * @access  Private
 */
router.get('/radar-data', protect, asyncHandler(async (req, res) => {
  const userSkill = await UserSkill.getOrCreate(req.user._id);
  
  // Format data for radar chart
  const radarData = userSkill.skills.map(skill => ({
    category: skill.categoryName,
    value: skill.currentLevel,
    target: skill.targetLevel,
    fullMark: 100
  }));
  
  res.status(200).json({
    success: true,
    data: {
      radarData,
      overallLevel: userSkill.overallLevel,
      rank: userSkill.rank
    }
  });
}));

module.exports = router;
