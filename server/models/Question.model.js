/**
 * ===========================================
 * Question Model - MongoDB Schema
 * ===========================================
 * 
 * Defines the schema for interview questions.
 * Supports both pre-defined and AI-generated questions.
 */

const mongoose = require('mongoose');

// Question Schema Definition
const questionSchema = new mongoose.Schema({
  // Question Content
  text: {
    type: String,
    required: [true, 'Question text is required'],
    trim: true,
    maxlength: [2000, 'Question cannot exceed 2000 characters']
  },
  
  // Question Classification
  category: {
    type: String,
    required: [true, 'Question category is required'],
    enum: ['dsa', 'web', 'ml', 'system-design', 'behavioral', 'database', 'devops', 'mobile'],
    index: true
  },
  subcategory: {
    type: String,
    trim: true
  },
  difficulty: {
    type: String,
    required: [true, 'Difficulty level is required'],
    enum: ['easy', 'medium', 'hard', 'expert'],
    default: 'medium',
    index: true
  },
  
  // Question Type
  type: {
    type: String,
    enum: ['technical', 'behavioral', 'situational', 'coding', 'conceptual'],
    default: 'technical'
  },
  
  // Tags for better searchability
  tags: [{
    type: String,
    trim: true,
    lowercase: true
  }],
  
  // Related job roles
  targetRoles: [{
    type: String,
    trim: true
  }],
  
  // Expected Answer Guidelines
  expectedAnswer: {
    type: String,
    maxlength: [5000, 'Expected answer cannot exceed 5000 characters']
  },
  keyPoints: [{
    type: String,
    trim: true
  }],
  
  // Hints for users
  hints: [{
    type: String,
    trim: true
  }],
  
  // Follow-up questions
  followUpQuestions: [{
    type: String,
    trim: true
  }],
  
  // Resources for further learning
  resources: [{
    title: String,
    url: String,
    type: {
      type: String,
      enum: ['article', 'video', 'documentation', 'tutorial']
    }
  }],
  
  // Generation Info
  isAIGenerated: {
    type: Boolean,
    default: false
  },
  aiProvider: {
    type: String,
    enum: ['openai', 'gemini', 'manual']
  },
  
  // Metrics
  timesAsked: {
    type: Number,
    default: 0
  },
  averageScore: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  totalAttempts: {
    type: Number,
    default: 0
  },
  
  // Time recommendation
  recommendedTimeMinutes: {
    type: Number,
    min: 1,
    max: 60,
    default: 5
  },
  
  // Status
  isActive: {
    type: Boolean,
    default: true
  },
  isApproved: {
    type: Boolean,
    default: true // Set to false if requires admin approval
  },
  
  // Ownership
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  
  // Company-specific questions (optional)
  company: {
    type: String,
    trim: true
  },

}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// ===========================================
// Indexes
// ===========================================

questionSchema.index({ category: 1, difficulty: 1 });
questionSchema.index({ tags: 1 });
questionSchema.index({ targetRoles: 1 });
questionSchema.index({ text: 'text', expectedAnswer: 'text' }); // Text search index
questionSchema.index({ isActive: 1, isApproved: 1 });

// ===========================================
// Static Methods
// ===========================================

/**
 * Get random questions by category and difficulty
 * @param {string} category - Question category
 * @param {string} difficulty - Difficulty level
 * @param {number} limit - Number of questions to return
 * @returns {Promise<Array>} - Array of questions
 */
questionSchema.statics.getRandomQuestions = async function(category, difficulty, limit = 5) {
  const query = { isActive: true, isApproved: true };
  
  if (category) query.category = category;
  if (difficulty) query.difficulty = difficulty;
  
  return this.aggregate([
    { $match: query },
    { $sample: { size: limit } }
  ]);
};

/**
 * Get questions by tags
 * @param {Array} tags - Array of tags
 * @param {number} limit - Number of questions to return
 * @returns {Promise<Array>} - Array of questions
 */
questionSchema.statics.getByTags = function(tags, limit = 10) {
  return this.find({
    tags: { $in: tags },
    isActive: true,
    isApproved: true
  }).limit(limit);
};

/**
 * Search questions
 * @param {string} searchTerm - Search term
 * @returns {Promise<Array>} - Array of matching questions
 */
questionSchema.statics.searchQuestions = function(searchTerm) {
  return this.find(
    { $text: { $search: searchTerm }, isActive: true, isApproved: true },
    { score: { $meta: 'textScore' } }
  ).sort({ score: { $meta: 'textScore' } });
};

/**
 * Get category statistics
 * @returns {Promise<Array>} - Category statistics
 */
questionSchema.statics.getCategoryStats = function() {
  return this.aggregate([
    { $match: { isActive: true, isApproved: true } },
    {
      $group: {
        _id: '$category',
        count: { $sum: 1 },
        avgScore: { $avg: '$averageScore' },
        totalAttempts: { $sum: '$totalAttempts' }
      }
    },
    { $sort: { count: -1 } }
  ]);
};

// ===========================================
// Instance Methods
// ===========================================

/**
 * Increment times asked counter
 */
questionSchema.methods.incrementAskedCount = function() {
  this.timesAsked += 1;
  return this.save();
};

/**
 * Update average score
 * @param {number} newScore - New score to factor in
 */
questionSchema.methods.updateAverageScore = function(newScore) {
  const totalScore = this.averageScore * this.totalAttempts + newScore;
  this.totalAttempts += 1;
  this.averageScore = totalScore / this.totalAttempts;
  return this.save();
};

const Question = mongoose.model('Question', questionSchema);

module.exports = Question;
