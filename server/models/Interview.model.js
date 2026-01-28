/**
 * ===========================================
 * Interview Model - MongoDB Schema
 * ===========================================
 * 
 * Defines the schema for mock interview sessions.
 * Tracks questions, responses, scores, and overall performance.
 */

const mongoose = require('mongoose');

// Response Sub-Schema (for each question in an interview)
const responseSchema = new mongoose.Schema({
  question: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Question',
    required: true
  },
  questionText: {
    type: String,
    required: true
  },
  
  // User's Answer
  answer: {
    type: String,
    default: ''
  },
  answerType: {
    type: String,
    enum: ['text', 'voice', 'code'],
    default: 'text'
  },
  
  // Voice recording (if applicable)
  audioUrl: String,
  transcription: String,
  
  // Code response (if applicable)
  code: String,
  programmingLanguage: String,
  
  // AI Evaluation Results
  evaluation: {
    overallScore: {
      type: Number,
      min: 0,
      max: 100,
      default: 0
    },
    relevanceScore: {
      type: Number,
      min: 0,
      max: 100
    },
    completenessScore: {
      type: Number,
      min: 0,
      max: 100
    },
    clarityScore: {
      type: Number,
      min: 0,
      max: 100
    },
    technicalAccuracyScore: {
      type: Number,
      min: 0,
      max: 100
    },
    communicationScore: {
      type: Number,
      min: 0,
      max: 100
    },
    confidenceScore: {
      type: Number,
      min: 0,
      max: 100
    }
  },
  
  // AI Feedback
  feedback: {
    strengths: [String],
    improvements: [String],
    suggestions: [String],
    detailedFeedback: String
  },
  
  // Key points covered
  keyPointsCovered: [{
    point: String,
    covered: Boolean
  }],
  
  // Timing
  startedAt: Date,
  completedAt: Date,
  timeSpentSeconds: {
    type: Number,
    default: 0
  },
  
  // Status
  isSkipped: {
    type: Boolean,
    default: false
  },
  isEvaluated: {
    type: Boolean,
    default: false
  }
}, { _id: true });

// Main Interview Schema
const interviewSchema = new mongoose.Schema({
  // User Reference
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User is required']
  },
  
  // Interview Configuration
  title: {
    type: String,
    default: function() {
      return `Interview Session - ${new Date().toLocaleDateString()}`;
    }
  },
  category: {
    type: String,
    required: [true, 'Interview category is required'],
    enum: ['general', 'dsa', 'web', 'web-development', 'ml', 'machine-learning', 'system-design', 'behavioral', 'database', 'devops', 'mobile', 'mixed']
  },
  difficulty: {
    type: String,
    required: true,
    enum: ['easy', 'medium', 'hard', 'expert'],
    default: 'medium'
  },
  targetRole: {
    type: String,
    trim: true
  },
  targetCompany: {
    type: String,
    trim: true
  },
  
  // Interview Type
  type: {
    type: String,
    enum: ['practice', 'timed', 'simulation', 'custom'],
    default: 'practice'
  },
  mode: {
    type: String,
    enum: ['text', 'voice', 'mixed'],
    default: 'text'
  },
  
  // Questions and Responses
  responses: [responseSchema],
  totalQuestions: {
    type: Number,
    required: true,
    min: 1,
    max: 50
  },
  questionsAnswered: {
    type: Number,
    default: 0
  },
  questionsSkipped: {
    type: Number,
    default: 0
  },
  
  // Overall Scores
  overallScore: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  categoryScores: {
    relevance: { type: Number, default: 0 },
    completeness: { type: Number, default: 0 },
    clarity: { type: Number, default: 0 },
    technicalAccuracy: { type: Number, default: 0 },
    communication: { type: Number, default: 0 },
    confidence: { type: Number, default: 0 }
  },
  
  // Performance Insights
  insights: {
    overallFeedback: String,
    topStrengths: [String],
    areasToImprove: [String],
    recommendations: [String],
    performanceLevel: {
      type: String,
      enum: ['excellent', 'good', 'average', 'needs-improvement', 'poor']
    }
  },
  
  // Timing
  scheduledAt: Date,
  startedAt: Date,
  completedAt: Date,
  totalDurationSeconds: {
    type: Number,
    default: 0
  },
  timeLimitMinutes: {
    type: Number,
    min: 5,
    max: 180
  },
  
  // Status
  status: {
    type: String,
    enum: ['scheduled', 'in-progress', 'completed', 'abandoned', 'expired'],
    default: 'scheduled'
  },
  
  // Progress Tracking
  currentQuestionIndex: {
    type: Number,
    default: 0
  },
  lastActivityAt: {
    type: Date,
    default: Date.now
  },
  
  // Session Info
  sessionId: {
    type: String,
    unique: true
  },
  ipAddress: String,
  userAgent: String,
  
  // Sharing and Privacy
  isPublic: {
    type: Boolean,
    default: false
  },
  shareCode: String,
  
  // Notes
  userNotes: String,

}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// ===========================================
// Indexes
// ===========================================

interviewSchema.index({ user: 1, createdAt: -1 });
interviewSchema.index({ category: 1, difficulty: 1 });

// ===========================================
// Pre-save Middleware
// ===========================================

interviewSchema.pre('save', function(next) {
  // Generate session ID if not exists
  if (!this.sessionId) {
    this.sessionId = `INT-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
  }
  
  // Update questions answered count
  if (this.responses) {
    this.questionsAnswered = this.responses.filter(r => r.answer && !r.isSkipped).length;
    this.questionsSkipped = this.responses.filter(r => r.isSkipped).length;
  }
  
  next();
});

// ===========================================
// Virtual Fields
// ===========================================

// Completion percentage
interviewSchema.virtual('completionPercentage').get(function() {
  if (this.totalQuestions === 0) return 0;
  return Math.round((this.questionsAnswered / this.totalQuestions) * 100);
});

// Average time per question
interviewSchema.virtual('avgTimePerQuestion').get(function() {
  if (this.questionsAnswered === 0) return 0;
  return Math.round(this.totalDurationSeconds / this.questionsAnswered);
});

// ===========================================
// Instance Methods
// ===========================================

/**
 * Start the interview
 */
interviewSchema.methods.start = function() {
  this.status = 'in-progress';
  this.startedAt = new Date();
  this.lastActivityAt = new Date();
  return this.save();
};

/**
 * Complete the interview and calculate scores
 */
interviewSchema.methods.complete = async function() {
  this.status = 'completed';
  this.completedAt = new Date();
  
  if (this.startedAt) {
    this.totalDurationSeconds = Math.round((this.completedAt - this.startedAt) / 1000);
  }
  
  // Calculate overall scores
  this.calculateOverallScores();
  
  return this.save();
};

/**
 * Calculate overall scores from individual responses
 */
interviewSchema.methods.calculateOverallScores = function() {
  const evaluatedResponses = this.responses.filter(r => r.isEvaluated && !r.isSkipped);
  
  if (evaluatedResponses.length === 0) {
    this.overallScore = 0;
    return;
  }
  
  // Calculate average scores
  const totals = evaluatedResponses.reduce((acc, resp) => {
    acc.overall += resp.evaluation.overallScore || 0;
    acc.relevance += resp.evaluation.relevanceScore || 0;
    acc.completeness += resp.evaluation.completenessScore || 0;
    acc.clarity += resp.evaluation.clarityScore || 0;
    acc.technicalAccuracy += resp.evaluation.technicalAccuracyScore || 0;
    acc.communication += resp.evaluation.communicationScore || 0;
    acc.confidence += resp.evaluation.confidenceScore || 0;
    return acc;
  }, { overall: 0, relevance: 0, completeness: 0, clarity: 0, technicalAccuracy: 0, communication: 0, confidence: 0 });
  
  const count = evaluatedResponses.length;
  
  this.overallScore = Math.round(totals.overall / count);
  this.categoryScores = {
    relevance: Math.round(totals.relevance / count),
    completeness: Math.round(totals.completeness / count),
    clarity: Math.round(totals.clarity / count),
    technicalAccuracy: Math.round(totals.technicalAccuracy / count),
    communication: Math.round(totals.communication / count),
    confidence: Math.round(totals.confidence / count)
  };
  
  // Determine performance level
  if (this.overallScore >= 85) {
    this.insights.performanceLevel = 'excellent';
  } else if (this.overallScore >= 70) {
    this.insights.performanceLevel = 'good';
  } else if (this.overallScore >= 50) {
    this.insights.performanceLevel = 'average';
  } else if (this.overallScore >= 30) {
    this.insights.performanceLevel = 'needs-improvement';
  } else {
    this.insights.performanceLevel = 'poor';
  }
};

/**
 * Add response to interview
 * @param {Object} responseData - Response data
 */
interviewSchema.methods.addResponse = function(responseData) {
  this.responses.push(responseData);
  this.currentQuestionIndex = this.responses.length;
  this.lastActivityAt = new Date();
  return this.save();
};

/**
 * Generate share code for public sharing
 */
interviewSchema.methods.generateShareCode = function() {
  this.shareCode = Math.random().toString(36).substr(2, 8).toUpperCase();
  this.isPublic = true;
  return this.save();
};

// ===========================================
// Static Methods
// ===========================================

/**
 * Get user's interview history
 * @param {ObjectId} userId - User ID
 * @param {Object} options - Query options
 * @returns {Promise<Array>} - Array of interviews
 */
interviewSchema.statics.getUserInterviews = function(userId, options = {}) {
  const { limit = 10, skip = 0, status } = options;
  
  const query = { user: userId };
  if (status) query.status = status;
  
  return this.find(query)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .select('-responses.answer -responses.audioUrl');
};

/**
 * Get user statistics
 * @param {ObjectId} userId - User ID
 * @returns {Promise<Object>} - User statistics
 */
interviewSchema.statics.getUserStats = async function(userId) {
  const stats = await this.aggregate([
    { $match: { user: mongoose.Types.ObjectId(userId), status: 'completed' } },
    {
      $group: {
        _id: null,
        totalInterviews: { $sum: 1 },
        avgScore: { $avg: '$overallScore' },
        totalQuestions: { $sum: '$totalQuestions' },
        totalAnswered: { $sum: '$questionsAnswered' },
        totalTime: { $sum: '$totalDurationSeconds' }
      }
    }
  ]);
  
  return stats[0] || {
    totalInterviews: 0,
    avgScore: 0,
    totalQuestions: 0,
    totalAnswered: 0,
    totalTime: 0
  };
};

const Interview = mongoose.model('Interview', interviewSchema);

module.exports = Interview;
