/**
 * ===========================================
 * Community Model - MongoDB Schema
 * ===========================================
 * 
 * Handles community posts, comments, and discussions.
 */

const mongoose = require('mongoose');

// Comment Schema
const commentSchema = new mongoose.Schema({
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    type: String,
    required: true,
    maxlength: 2000
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  isEdited: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Post Schema
const postSchema = new mongoose.Schema({
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  content: {
    type: String,
    required: true,
    maxlength: 10000
  },
  type: {
    type: String,
    enum: ['discussion', 'question', 'experience', 'tip', 'resource', 'success-story'],
    default: 'discussion'
  },
  category: {
    type: String,
    enum: ['interview-prep', 'coding', 'system-design', 'behavioral', 'career', 'general', 'job-hunting'],
    default: 'general'
  },
  tags: [{
    type: String,
    trim: true
  }],
  images: [{
    url: String,
    caption: String
  }],
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  bookmarks: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  comments: [commentSchema],
  views: {
    type: Number,
    default: 0
  },
  shares: {
    type: Number,
    default: 0
  },
  isPinned: {
    type: Boolean,
    default: false
  },
  isApproved: {
    type: Boolean,
    default: true
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  relatedCompany: {
    type: String,
    trim: true
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for like count
postSchema.virtual('likeCount').get(function() {
  return this.likes?.length || 0;
});

// Virtual for comment count
postSchema.virtual('commentCount').get(function() {
  return this.comments?.length || 0;
});

// Indexes
postSchema.index({ createdAt: -1 });
postSchema.index({ category: 1, createdAt: -1 });
postSchema.index({ type: 1, createdAt: -1 });
postSchema.index({ tags: 1 });
postSchema.index({ 'likes': 1 });
postSchema.index({ author: 1, createdAt: -1 });

// Static methods
postSchema.statics.getTrending = async function(limit = 10) {
  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);
  
  return this.aggregate([
    { $match: { createdAt: { $gte: weekAgo }, isApproved: true } },
    { $addFields: {
      score: {
        $add: [
          { $multiply: [{ $size: '$likes' }, 3] },
          { $multiply: [{ $size: '$comments' }, 2] },
          '$views',
          { $cond: ['$isPinned', 100, 0] }
        ]
      }
    }},
    { $sort: { score: -1 } },
    { $limit: limit }
  ]);
};

postSchema.statics.getFeed = async function(options = {}) {
  const { page = 1, limit = 20, category, type, userId } = options;
  const skip = (page - 1) * limit;
  
  const query = { isApproved: true };
  if (category) query.category = category;
  if (type) query.type = type;
  
  const posts = await this.find(query)
    .populate('author', 'firstName lastName avatar jobTitle')
    .sort({ isPinned: -1, createdAt: -1 })
    .skip(skip)
    .limit(limit);
  
  const total = await this.countDocuments(query);
  
  return {
    posts,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit)
    }
  };
};

// Discussion/Topic Schema for organized discussions
const discussionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String
  },
  category: {
    type: String,
    enum: ['interview-prep', 'coding', 'system-design', 'behavioral', 'career', 'general'],
    default: 'general'
  },
  participantCount: {
    type: Number,
    default: 0
  },
  postCount: {
    type: Number,
    default: 0
  },
  lastActivity: {
    type: Date,
    default: Date.now
  },
  isActive: {
    type: Boolean,
    default: true
  },
  icon: String,
  color: String
}, {
  timestamps: true
});

// Mentor Schema
const mentorSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  specializations: [{
    type: String
  }],
  experience: {
    type: String
  },
  company: {
    type: String
  },
  bio: {
    type: String,
    maxlength: 1000
  },
  availability: {
    type: String,
    enum: ['available', 'busy', 'offline'],
    default: 'available'
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  reviewCount: {
    type: Number,
    default: 0
  },
  sessionsCompleted: {
    type: Number,
    default: 0
  },
  responseTime: {
    type: String,
    default: 'Within 24 hours'
  }
}, {
  timestamps: true
});

const CommunityPost = mongoose.model('CommunityPost', postSchema);
const Discussion = mongoose.model('Discussion', discussionSchema);
const Mentor = mongoose.model('Mentor', mentorSchema);

module.exports = { CommunityPost, Discussion, Mentor };
