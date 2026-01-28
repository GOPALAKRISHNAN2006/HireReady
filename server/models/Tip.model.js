/**
 * ===========================================
 * Interview Tips Model - MongoDB Schema
 * ===========================================
 * 
 * Stores curated interview tips and user interactions.
 */

const mongoose = require('mongoose');

// Interview Tip Schema
const tipSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  content: {
    type: String,
    required: true,
    maxlength: 5000
  },
  summary: {
    type: String,
    maxlength: 300
  },
  category: {
    type: String,
    enum: ['preparation', 'technical', 'behavioral', 'communication', 'negotiation', 'follow-up', 'remote', 'general'],
    default: 'general',
    index: true
  },
  tags: [{
    type: String,
    trim: true
  }],
  difficulty: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    default: 'beginner'
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  authorName: {
    type: String,
    default: 'HireReady Team'
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  bookmarks: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  views: {
    type: Number,
    default: 0
  },
  relatedCompanies: [{
    type: String
  }],
  relatedRoles: [{
    type: String
  }],
  resources: [{
    title: String,
    url: String,
    type: { type: String, enum: ['article', 'video', 'book', 'course'] }
  }],
  isApproved: {
    type: Boolean,
    default: true
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  isPremium: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for like count
tipSchema.virtual('likeCount').get(function() {
  return this.likes?.length || 0;
});

// Virtual for bookmark count
tipSchema.virtual('bookmarkCount').get(function() {
  return this.bookmarks?.length || 0;
});

// Indexes
tipSchema.index({ category: 1, isApproved: 1 });
tipSchema.index({ tags: 1 });
tipSchema.index({ createdAt: -1 });
tipSchema.index({ 'likes': 1 });
tipSchema.index({ isFeatured: 1, isApproved: 1 });

// User Tip Interaction Schema
const userTipInteractionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  likedTips: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'InterviewTip'
  }],
  bookmarkedTips: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'InterviewTip'
  }],
  viewedTips: [{
    tip: { type: mongoose.Schema.Types.ObjectId, ref: 'InterviewTip' },
    viewedAt: { type: Date, default: Date.now }
  }],
  preferences: {
    favoriteCategories: [String],
    hideRead: { type: Boolean, default: false }
  }
}, {
  timestamps: true
});

// Indexes
userTipInteractionSchema.index({ user: 1 }, { unique: true });

// Static methods
tipSchema.statics.getFeatured = async function(limit = 5) {
  return this.find({ isFeatured: true, isApproved: true })
    .sort({ createdAt: -1 })
    .limit(limit);
};

tipSchema.statics.getByCategory = async function(category, options = {}) {
  const { page = 1, limit = 10, difficulty } = options;
  const skip = (page - 1) * limit;
  
  const query = { category, isApproved: true };
  if (difficulty) query.difficulty = difficulty;
  
  const tips = await this.find(query)
    .populate('author', 'firstName lastName avatar')
    .sort({ isFeatured: -1, createdAt: -1 })
    .skip(skip)
    .limit(limit);
  
  const total = await this.countDocuments(query);
  
  return {
    tips,
    pagination: { page, limit, total, pages: Math.ceil(total / limit) }
  };
};

tipSchema.statics.getPopular = async function(limit = 10) {
  return this.aggregate([
    { $match: { isApproved: true } },
    { $addFields: {
      popularity: {
        $add: [
          { $multiply: [{ $size: '$likes' }, 2] },
          { $size: '$bookmarks' },
          { $divide: ['$views', 10] }
        ]
      }
    }},
    { $sort: { popularity: -1 } },
    { $limit: limit }
  ]);
};

tipSchema.statics.search = async function(searchTerm, options = {}) {
  const { page = 1, limit = 10 } = options;
  const skip = (page - 1) * limit;
  
  const query = {
    isApproved: true,
    $or: [
      { title: { $regex: searchTerm, $options: 'i' } },
      { content: { $regex: searchTerm, $options: 'i' } },
      { tags: { $in: [new RegExp(searchTerm, 'i')] } }
    ]
  };
  
  const tips = await this.find(query)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);
  
  const total = await this.countDocuments(query);
  
  return {
    tips,
    pagination: { page, limit, total, pages: Math.ceil(total / limit) }
  };
};

userTipInteractionSchema.statics.getOrCreate = async function(userId) {
  let interaction = await this.findOne({ user: userId });
  if (!interaction) {
    interaction = await this.create({ user: userId });
  }
  return interaction;
};

const InterviewTip = mongoose.model('InterviewTip', tipSchema);
const UserTipInteraction = mongoose.model('UserTipInteraction', userTipInteractionSchema);

module.exports = { InterviewTip, UserTipInteraction };
