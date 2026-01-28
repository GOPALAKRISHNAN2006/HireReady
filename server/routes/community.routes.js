/**
 * ===========================================
 * Community Routes
 * ===========================================
 * 
 * Handles community posts, discussions, and mentorship.
 * 
 * Routes:
 * GET /api/community/feed - Get community feed
 * POST /api/community/posts - Create a post
 * GET /api/community/posts/:id - Get single post
 * PUT /api/community/posts/:id - Update post
 * DELETE /api/community/posts/:id - Delete post
 * POST /api/community/posts/:id/like - Like/unlike post
 * POST /api/community/posts/:id/bookmark - Bookmark post
 * POST /api/community/posts/:id/comments - Add comment
 * GET /api/community/trending - Get trending topics
 * GET /api/community/discussions - Get discussions
 * GET /api/community/mentors - Get available mentors
 */

const express = require('express');
const router = express.Router();
const { CommunityPost, Discussion, Mentor } = require('../models/Community.model');
const { protect, optionalAuth } = require('../middleware/auth.middleware');
const { asyncHandler } = require('../middleware/errorHandler');

/**
 * @route   GET /api/community/feed
 * @desc    Get community feed
 * @access  Private
 */
router.get('/feed', protect, asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, category, type } = req.query;
  
  const result = await CommunityPost.getFeed({
    page: parseInt(page),
    limit: parseInt(limit),
    category,
    type,
    userId: req.user._id
  });
  
  // Add user interaction info
  const posts = result.posts.map(post => {
    const postObj = post.toObject();
    postObj.isLiked = post.likes?.includes(req.user._id);
    postObj.isBookmarked = post.bookmarks?.includes(req.user._id);
    postObj.likeCount = post.likes?.length || 0;
    postObj.commentCount = post.comments?.length || 0;
    return postObj;
  });
  
  res.status(200).json({
    success: true,
    data: {
      posts,
      pagination: result.pagination
    }
  });
}));

/**
 * @route   POST /api/community/posts
 * @desc    Create a new post
 * @access  Private
 */
router.post('/posts', protect, asyncHandler(async (req, res) => {
  const { title, content, type, category, tags, relatedCompany } = req.body;
  
  const post = await CommunityPost.create({
    author: req.user._id,
    title,
    content,
    type: type || 'discussion',
    category: category || 'general',
    tags: tags || [],
    relatedCompany
  });
  
  await post.populate('author', 'firstName lastName avatar jobTitle');
  
  res.status(201).json({
    success: true,
    data: { post }
  });
}));

/**
 * @route   GET /api/community/posts/:id
 * @desc    Get single post with comments
 * @access  Private
 */
router.get('/posts/:id', protect, asyncHandler(async (req, res) => {
  const post = await CommunityPost.findById(req.params.id)
    .populate('author', 'firstName lastName avatar jobTitle company')
    .populate('comments.author', 'firstName lastName avatar');
  
  if (!post) {
    return res.status(404).json({
      success: false,
      message: 'Post not found'
    });
  }
  
  // Increment views
  post.views += 1;
  await post.save();
  
  const postObj = post.toObject();
  postObj.isLiked = post.likes?.includes(req.user._id);
  postObj.isBookmarked = post.bookmarks?.includes(req.user._id);
  postObj.likeCount = post.likes?.length || 0;
  postObj.commentCount = post.comments?.length || 0;
  
  res.status(200).json({
    success: true,
    data: { post: postObj }
  });
}));

/**
 * @route   PUT /api/community/posts/:id
 * @desc    Update post
 * @access  Private (author only)
 */
router.put('/posts/:id', protect, asyncHandler(async (req, res) => {
  const { title, content, tags, category } = req.body;
  
  const post = await CommunityPost.findById(req.params.id);
  
  if (!post) {
    return res.status(404).json({
      success: false,
      message: 'Post not found'
    });
  }
  
  // Check ownership
  if (post.author.toString() !== req.user._id.toString()) {
    return res.status(403).json({
      success: false,
      message: 'Not authorized to update this post'
    });
  }
  
  post.title = title || post.title;
  post.content = content || post.content;
  post.tags = tags || post.tags;
  post.category = category || post.category;
  
  await post.save();
  
  res.status(200).json({
    success: true,
    data: { post }
  });
}));

/**
 * @route   DELETE /api/community/posts/:id
 * @desc    Delete post
 * @access  Private (author only)
 */
router.delete('/posts/:id', protect, asyncHandler(async (req, res) => {
  const post = await CommunityPost.findById(req.params.id);
  
  if (!post) {
    return res.status(404).json({
      success: false,
      message: 'Post not found'
    });
  }
  
  // Check ownership
  if (post.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Not authorized to delete this post'
    });
  }
  
  await CommunityPost.findByIdAndDelete(req.params.id);
  
  res.status(200).json({
    success: true,
    message: 'Post deleted successfully'
  });
}));

/**
 * @route   POST /api/community/posts/:id/like
 * @desc    Like or unlike a post
 * @access  Private
 */
router.post('/posts/:id/like', protect, asyncHandler(async (req, res) => {
  const post = await CommunityPost.findById(req.params.id);
  
  if (!post) {
    return res.status(404).json({
      success: false,
      message: 'Post not found'
    });
  }
  
  const likeIndex = post.likes.indexOf(req.user._id);
  
  if (likeIndex > -1) {
    // Unlike
    post.likes.splice(likeIndex, 1);
  } else {
    // Like
    post.likes.push(req.user._id);
  }
  
  await post.save();
  
  res.status(200).json({
    success: true,
    data: {
      isLiked: likeIndex === -1,
      likeCount: post.likes.length
    }
  });
}));

/**
 * @route   POST /api/community/posts/:id/bookmark
 * @desc    Bookmark or unbookmark a post
 * @access  Private
 */
router.post('/posts/:id/bookmark', protect, asyncHandler(async (req, res) => {
  const post = await CommunityPost.findById(req.params.id);
  
  if (!post) {
    return res.status(404).json({
      success: false,
      message: 'Post not found'
    });
  }
  
  const bookmarkIndex = post.bookmarks.indexOf(req.user._id);
  
  if (bookmarkIndex > -1) {
    // Remove bookmark
    post.bookmarks.splice(bookmarkIndex, 1);
  } else {
    // Add bookmark
    post.bookmarks.push(req.user._id);
  }
  
  await post.save();
  
  res.status(200).json({
    success: true,
    data: {
      isBookmarked: bookmarkIndex === -1,
      bookmarkCount: post.bookmarks.length
    }
  });
}));

/**
 * @route   POST /api/community/posts/:id/comments
 * @desc    Add comment to post
 * @access  Private
 */
router.post('/posts/:id/comments', protect, asyncHandler(async (req, res) => {
  const { content } = req.body;
  
  const post = await CommunityPost.findById(req.params.id);
  
  if (!post) {
    return res.status(404).json({
      success: false,
      message: 'Post not found'
    });
  }
  
  post.comments.push({
    author: req.user._id,
    content
  });
  
  await post.save();
  
  // Populate the new comment's author
  await post.populate('comments.author', 'firstName lastName avatar');
  
  const newComment = post.comments[post.comments.length - 1];
  
  res.status(201).json({
    success: true,
    data: { comment: newComment }
  });
}));

/**
 * @route   GET /api/community/trending
 * @desc    Get trending topics and posts
 * @access  Private
 */
router.get('/trending', protect, asyncHandler(async (req, res) => {
  const { limit = 10 } = req.query;
  
  const trendingPosts = await CommunityPost.getTrending(parseInt(limit));
  
  // Get popular tags
  const popularTags = await CommunityPost.aggregate([
    { $match: { isApproved: true } },
    { $unwind: '$tags' },
    { $group: { _id: '$tags', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: 10 }
  ]);
  
  res.status(200).json({
    success: true,
    data: {
      trendingPosts,
      popularTags: popularTags.map(t => ({ tag: t._id, count: t.count }))
    }
  });
}));

/**
 * @route   GET /api/community/discussions
 * @desc    Get discussion topics
 * @access  Private
 */
router.get('/discussions', protect, asyncHandler(async (req, res) => {
  const discussions = await Discussion.find({ isActive: true })
    .sort({ lastActivity: -1 })
    .limit(20);
  
  res.status(200).json({
    success: true,
    data: { discussions }
  });
}));

/**
 * @route   GET /api/community/mentors
 * @desc    Get available mentors
 * @access  Private
 */
router.get('/mentors', protect, asyncHandler(async (req, res) => {
  const { specialization, availability } = req.query;
  
  const query = { isActive: true };
  if (specialization) query.specializations = specialization;
  if (availability) query.availability = availability;
  
  const mentors = await Mentor.find(query)
    .populate('user', 'firstName lastName avatar')
    .sort({ rating: -1, sessionsCompleted: -1 })
    .limit(20);
  
  res.status(200).json({
    success: true,
    data: { mentors }
  });
}));

/**
 * @route   GET /api/community/my-posts
 * @desc    Get current user's posts
 * @access  Private
 */
router.get('/my-posts', protect, asyncHandler(async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const skip = (page - 1) * limit;
  
  const posts = await CommunityPost.find({ author: req.user._id })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit));
  
  const total = await CommunityPost.countDocuments({ author: req.user._id });
  
  res.status(200).json({
    success: true,
    data: {
      posts,
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
 * @route   GET /api/community/bookmarks
 * @desc    Get user's bookmarked posts
 * @access  Private
 */
router.get('/bookmarks', protect, asyncHandler(async (req, res) => {
  const posts = await CommunityPost.find({ bookmarks: req.user._id })
    .populate('author', 'firstName lastName avatar')
    .sort({ createdAt: -1 })
    .limit(50);
  
  res.status(200).json({
    success: true,
    data: { posts }
  });
}));

module.exports = router;
