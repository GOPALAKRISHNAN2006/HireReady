/**
 * ===========================================
 * Tips Routes
 * ===========================================
 * 
 * Handles interview tips and user interactions.
 * 
 * Routes:
 * GET /api/tips - Get all tips
 * GET /api/tips/featured - Get featured tips
 * GET /api/tips/category/:category - Get tips by category
 * GET /api/tips/:id - Get single tip
 * POST /api/tips/:id/like - Like/unlike tip
 * POST /api/tips/:id/bookmark - Bookmark tip
 * GET /api/tips/bookmarks - Get user's bookmarked tips
 * GET /api/tips/search - Search tips
 */

const express = require('express');
const router = express.Router();
const { InterviewTip, UserTipInteraction } = require('../models/Tip.model');
const { protect } = require('../middleware/auth.middleware');
const { asyncHandler } = require('../middleware/errorHandler');

/**
 * @route   GET /api/tips
 * @desc    Get all tips with pagination
 * @access  Private
 */
router.get('/', protect, asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, category, difficulty, sort = 'newest' } = req.query;
  const skip = (page - 1) * limit;
  
  const query = { isApproved: true };
  if (category && category !== 'all') query.category = category;
  if (difficulty) query.difficulty = difficulty;
  
  let sortOption = { createdAt: -1 };
  if (sort === 'popular') sortOption = { 'likes': -1 };
  if (sort === 'views') sortOption = { views: -1 };
  
  const tips = await InterviewTip.find(query)
    .populate('author', 'firstName lastName avatar')
    .sort({ isFeatured: -1, ...sortOption })
    .skip(skip)
    .limit(parseInt(limit));
  
  const total = await InterviewTip.countDocuments(query);
  
  // Add user interaction info
  const tipsWithInteraction = tips.map(tip => {
    const tipObj = tip.toObject();
    tipObj.isLiked = tip.likes?.includes(req.user._id);
    tipObj.isBookmarked = tip.bookmarks?.includes(req.user._id);
    tipObj.likeCount = tip.likes?.length || 0;
    return tipObj;
  });
  
  res.status(200).json({
    success: true,
    data: {
      tips: tipsWithInteraction,
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
 * @route   GET /api/tips/featured
 * @desc    Get featured tips
 * @access  Private
 */
router.get('/featured', protect, asyncHandler(async (req, res) => {
  const { limit = 5 } = req.query;
  
  const tips = await InterviewTip.getFeatured(parseInt(limit));
  
  res.status(200).json({
    success: true,
    data: { tips }
  });
}));

/**
 * @route   GET /api/tips/popular
 * @desc    Get most popular tips
 * @access  Private
 */
router.get('/popular', protect, asyncHandler(async (req, res) => {
  const { limit = 10 } = req.query;
  
  const tips = await InterviewTip.getPopular(parseInt(limit));
  
  res.status(200).json({
    success: true,
    data: { tips }
  });
}));

/**
 * @route   GET /api/tips/category/:category
 * @desc    Get tips by category
 * @access  Private
 */
router.get('/category/:category', protect, asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, difficulty } = req.query;
  
  const result = await InterviewTip.getByCategory(req.params.category, {
    page: parseInt(page),
    limit: parseInt(limit),
    difficulty
  });
  
  // Add user interaction info
  result.tips = result.tips.map(tip => {
    const tipObj = tip.toObject();
    tipObj.isLiked = tip.likes?.includes(req.user._id);
    tipObj.isBookmarked = tip.bookmarks?.includes(req.user._id);
    return tipObj;
  });
  
  res.status(200).json({
    success: true,
    data: result
  });
}));

/**
 * @route   GET /api/tips/categories
 * @desc    Get available categories with counts
 * @access  Private
 */
router.get('/categories', protect, asyncHandler(async (req, res) => {
  const categories = await InterviewTip.aggregate([
    { $match: { isApproved: true } },
    { $group: { _id: '$category', count: { $sum: 1 } } },
    { $sort: { count: -1 } }
  ]);
  
  const categoryInfo = {
    preparation: { name: 'Preparation', icon: '📝', color: '#3B82F6' },
    technical: { name: 'Technical', icon: '💻', color: '#10B981' },
    behavioral: { name: 'Behavioral', icon: '🤝', color: '#8B5CF6' },
    communication: { name: 'Communication', icon: '💬', color: '#F59E0B' },
    negotiation: { name: 'Negotiation', icon: '💰', color: '#EF4444' },
    'follow-up': { name: 'Follow-up', icon: '📧', color: '#06B6D4' },
    remote: { name: 'Remote', icon: '🏠', color: '#EC4899' },
    general: { name: 'General', icon: '📚', color: '#6B7280' }
  };
  
  const categoriesWithInfo = categories.map(cat => ({
    category: cat._id,
    count: cat.count,
    ...categoryInfo[cat._id] || { name: cat._id, icon: '📌', color: '#6B7280' }
  }));
  
  res.status(200).json({
    success: true,
    data: { categories: categoriesWithInfo }
  });
}));

/**
 * @route   GET /api/tips/user/bookmarks
 * @desc    Get user's bookmarked tips
 * @access  Private
 */
router.get('/user/bookmarks', protect, asyncHandler(async (req, res) => {
  const tips = await InterviewTip.find({ bookmarks: req.user._id })
    .populate('author', 'firstName lastName avatar')
    .sort({ createdAt: -1 });
  
  res.status(200).json({
    success: true,
    data: { tips }
  });
}));

/**
 * @route   GET /api/tips/search/query
 * @desc    Search tips
 * @access  Private
 */
router.get('/search/query', protect, asyncHandler(async (req, res) => {
  const { q, page = 1, limit = 10 } = req.query;
  
  if (!q) {
    return res.status(400).json({
      success: false,
      message: 'Search query is required'
    });
  }
  
  const result = await InterviewTip.search(q, {
    page: parseInt(page),
    limit: parseInt(limit)
  });
  
  res.status(200).json({
    success: true,
    data: result
  });
}));

/**
 * @route   GET /api/tips/:id
 * @desc    Get single tip
 * @access  Private
 */
router.get('/:id', protect, asyncHandler(async (req, res) => {
  const tip = await InterviewTip.findById(req.params.id)
    .populate('author', 'firstName lastName avatar jobTitle');
  
  if (!tip) {
    return res.status(404).json({
      success: false,
      message: 'Tip not found'
    });
  }
  
  // Increment views
  tip.views += 1;
  await tip.save();
  
  // Track view
  await UserTipInteraction.findOneAndUpdate(
    { user: req.user._id },
    { $addToSet: { viewedTips: { tip: tip._id, viewedAt: new Date() } } },
    { upsert: true }
  );
  
  const tipObj = tip.toObject();
  tipObj.isLiked = tip.likes?.includes(req.user._id);
  tipObj.isBookmarked = tip.bookmarks?.includes(req.user._id);
  tipObj.likeCount = tip.likes?.length || 0;
  
  res.status(200).json({
    success: true,
    data: { tip: tipObj }
  });
}));

/**
 * @route   POST /api/tips/:id/like
 * @desc    Like or unlike a tip
 * @access  Private
 */
router.post('/:id/like', protect, asyncHandler(async (req, res) => {
  const tip = await InterviewTip.findById(req.params.id);
  
  if (!tip) {
    return res.status(404).json({
      success: false,
      message: 'Tip not found'
    });
  }
  
  const likeIndex = tip.likes.indexOf(req.user._id);
  let isLiked;
  
  if (likeIndex > -1) {
    tip.likes.splice(likeIndex, 1);
    isLiked = false;
    
    // Remove from user interactions
    await UserTipInteraction.findOneAndUpdate(
      { user: req.user._id },
      { $pull: { likedTips: tip._id } }
    );
  } else {
    tip.likes.push(req.user._id);
    isLiked = true;
    
    // Add to user interactions
    await UserTipInteraction.findOneAndUpdate(
      { user: req.user._id },
      { $addToSet: { likedTips: tip._id } },
      { upsert: true }
    );
  }
  
  await tip.save();
  
  res.status(200).json({
    success: true,
    data: {
      isLiked,
      likeCount: tip.likes.length
    }
  });
}));

/**
 * @route   POST /api/tips/:id/bookmark
 * @desc    Bookmark or unbookmark a tip
 * @access  Private
 */
router.post('/:id/bookmark', protect, asyncHandler(async (req, res) => {
  const tip = await InterviewTip.findById(req.params.id);
  
  if (!tip) {
    return res.status(404).json({
      success: false,
      message: 'Tip not found'
    });
  }
  
  const bookmarkIndex = tip.bookmarks.indexOf(req.user._id);
  let isBookmarked;
  
  if (bookmarkIndex > -1) {
    tip.bookmarks.splice(bookmarkIndex, 1);
    isBookmarked = false;
    
    await UserTipInteraction.findOneAndUpdate(
      { user: req.user._id },
      { $pull: { bookmarkedTips: tip._id } }
    );
  } else {
    tip.bookmarks.push(req.user._id);
    isBookmarked = true;
    
    await UserTipInteraction.findOneAndUpdate(
      { user: req.user._id },
      { $addToSet: { bookmarkedTips: tip._id } },
      { upsert: true }
    );
  }
  
  await tip.save();
  
  res.status(200).json({
    success: true,
    data: {
      isBookmarked,
      bookmarkCount: tip.bookmarks.length
    }
  });
}));

module.exports = router;
