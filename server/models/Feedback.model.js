/**
 * ===========================================
 * Feedback Model - MongoDB Schema
 * ===========================================
 * 
 * Stores detailed feedback for interview responses and overall sessions.
 * Used for AI-generated insights and improvement tracking.
 */

const mongoose = require('mongoose');

// Feedback Schema Definition
const feedbackSchema = new mongoose.Schema({
  // References
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  interview: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Interview'
  },
  question: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Question'
  },
  
  // Feedback Type
  type: {
    type: String,
    enum: ['interview', 'question', 'overall', 'weekly', 'monthly'],
    required: true
  },
  
  // Scores Breakdown
  scores: {
    overall: {
      type: Number,
      min: 0,
      max: 100,
      required: true
    },
    relevance: {
      type: Number,
      min: 0,
      max: 100
    },
    completeness: {
      type: Number,
      min: 0,
      max: 100
    },
    clarity: {
      type: Number,
      min: 0,
      max: 100
    },
    technicalAccuracy: {
      type: Number,
      min: 0,
      max: 100
    },
    communication: {
      type: Number,
      min: 0,
      max: 100
    },
    confidence: {
      type: Number,
      min: 0,
      max: 100
    },
    problemSolving: {
      type: Number,
      min: 0,
      max: 100
    }
  },
  
  // Detailed Feedback
  summary: {
    type: String,
    maxlength: 2000
  },
  strengths: [{
    area: String,
    description: String,
    examples: [String]
  }],
  weaknesses: [{
    area: String,
    description: String,
    recommendations: [String]
  }],
  improvements: [{
    area: String,
    currentLevel: String,
    targetLevel: String,
    actionItems: [String],
    resources: [{
      title: String,
      url: String,
      type: String
    }]
  }],
  
  // Key Observations
  keyObservations: [{
    observation: String,
    sentiment: {
      type: String,
      enum: ['positive', 'neutral', 'negative']
    },
    importance: {
      type: String,
      enum: ['high', 'medium', 'low']
    }
  }],
  
  // Comparison with Previous Performance
  comparison: {
    previousScore: Number,
    scoreDifference: Number,
    trend: {
      type: String,
      enum: ['improving', 'stable', 'declining']
    },
    percentileRank: Number // Compared to other users
  },
  
  // Goals and Targets
  goals: [{
    description: String,
    targetScore: Number,
    deadline: Date,
    status: {
      type: String,
      enum: ['not-started', 'in-progress', 'achieved', 'missed'],
      default: 'not-started'
    }
  }],
  
  // AI Generation Info
  generatedBy: {
    type: String,
    enum: ['openai', 'gemini', 'manual', 'system'],
    default: 'system'
  },
  modelUsed: String,
  generatedAt: {
    type: Date,
    default: Date.now
  },
  
  // User Interaction
  isRead: {
    type: Boolean,
    default: false
  },
  readAt: Date,
  userRating: {
    type: Number,
    min: 1,
    max: 5
  },
  userComments: String,
  isHelpful: Boolean,

}, {
  timestamps: true
});

// ===========================================
// Indexes
// ===========================================

feedbackSchema.index({ user: 1, createdAt: -1 });
feedbackSchema.index({ interview: 1 });
feedbackSchema.index({ type: 1 });

// ===========================================
// Instance Methods
// ===========================================

/**
 * Mark feedback as read
 */
feedbackSchema.methods.markAsRead = function() {
  this.isRead = true;
  this.readAt = new Date();
  return this.save();
};

/**
 * Add user rating
 * @param {number} rating - Rating (1-5)
 * @param {string} comments - Optional comments
 * @param {boolean} isHelpful - Whether feedback was helpful
 */
feedbackSchema.methods.addUserRating = function(rating, comments, isHelpful) {
  this.userRating = rating;
  this.userComments = comments;
  this.isHelpful = isHelpful;
  return this.save();
};

// ===========================================
// Static Methods
// ===========================================

/**
 * Get unread feedback count for user
 * @param {ObjectId} userId - User ID
 * @returns {Promise<number>} - Unread count
 */
feedbackSchema.statics.getUnreadCount = function(userId) {
  return this.countDocuments({ user: userId, isRead: false });
};

/**
 * Get recent feedback for user
 * @param {ObjectId} userId - User ID
 * @param {number} limit - Number of feedback items
 * @returns {Promise<Array>} - Array of feedback
 */
feedbackSchema.statics.getRecentFeedback = function(userId, limit = 10) {
  return this.find({ user: userId })
    .sort({ createdAt: -1 })
    .limit(limit)
    .populate('interview', 'title category overallScore')
    .populate('question', 'text category');
};

/**
 * Calculate average feedback helpfulness
 * @returns {Promise<Object>} - Helpfulness statistics
 */
feedbackSchema.statics.getHelpfulnessStats = async function() {
  return this.aggregate([
    { $match: { userRating: { $exists: true } } },
    {
      $group: {
        _id: null,
        avgRating: { $avg: '$userRating' },
        totalRated: { $sum: 1 },
        helpfulCount: { $sum: { $cond: ['$isHelpful', 1, 0] } }
      }
    }
  ]);
};

const Feedback = mongoose.model('Feedback', feedbackSchema);

module.exports = Feedback;
