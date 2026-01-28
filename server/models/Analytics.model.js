/**
 * ===========================================
 * Analytics Model - MongoDB Schema
 * ===========================================
 * 
 * Tracks user performance metrics, progress over time,
 * and provides data for analytics dashboards.
 */

const mongoose = require('mongoose');

// Daily Snapshot Sub-Schema
const dailySnapshotSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true
  },
  interviewsCompleted: {
    type: Number,
    default: 0
  },
  questionsAnswered: {
    type: Number,
    default: 0
  },
  averageScore: {
    type: Number,
    default: 0
  },
  timeSpentMinutes: {
    type: Number,
    default: 0
  },
  categoriesStudied: [{
    type: String
  }]
}, { _id: false });

// Category Performance Sub-Schema
const categoryPerformanceSchema = new mongoose.Schema({
  category: {
    type: String,
    required: true
  },
  totalQuestions: {
    type: Number,
    default: 0
  },
  correctAnswers: {
    type: Number,
    default: 0
  },
  averageScore: {
    type: Number,
    default: 0
  },
  bestScore: {
    type: Number,
    default: 0
  },
  worstScore: {
    type: Number,
    default: 0
  },
  lastAttemptDate: Date,
  trend: {
    type: String,
    enum: ['improving', 'stable', 'declining'],
    default: 'stable'
  },
  scoreHistory: [{
    score: Number,
    date: Date
  }]
}, { _id: false });

// Skill Progress Sub-Schema
const skillProgressSchema = new mongoose.Schema({
  skillName: {
    type: String,
    required: true
  },
  currentLevel: {
    type: Number,
    min: 1,
    max: 100,
    default: 1
  },
  targetLevel: {
    type: Number,
    min: 1,
    max: 100,
    default: 100
  },
  progressPercentage: {
    type: Number,
    default: 0
  },
  questionsAttempted: {
    type: Number,
    default: 0
  },
  lastPracticeDate: Date
}, { _id: false });

// Main Analytics Schema
const analyticsSchema = new mongoose.Schema({
  // User Reference
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
    index: true
  },
  
  // Overall Statistics
  overallStats: {
    totalInterviews: {
      type: Number,
      default: 0
    },
    completedInterviews: {
      type: Number,
      default: 0
    },
    abandonedInterviews: {
      type: Number,
      default: 0
    },
    totalQuestionsAttempted: {
      type: Number,
      default: 0
    },
    totalQuestionsSkipped: {
      type: Number,
      default: 0
    },
    averageScore: {
      type: Number,
      default: 0
    },
    highestScore: {
      type: Number,
      default: 0
    },
    lowestScore: {
      type: Number,
      default: 100
    },
    totalPracticeTimeMinutes: {
      type: Number,
      default: 0
    },
    averageTimePerQuestion: {
      type: Number,
      default: 0
    },
    longestStreak: {
      type: Number,
      default: 0
    },
    currentStreak: {
      type: Number,
      default: 0
    },
    lastActiveDate: Date
  },
  
  // Category-wise Performance
  categoryPerformance: [categoryPerformanceSchema],
  
  // Skill Progress Tracking
  skillProgress: [skillProgressSchema],
  
  // Daily Activity Snapshots (for charts)
  dailySnapshots: [dailySnapshotSchema],
  
  // Weekly Aggregates
  weeklyStats: [{
    weekStart: Date,
    weekEnd: Date,
    interviewsCompleted: Number,
    averageScore: Number,
    improvement: Number,
    timeSpentMinutes: Number
  }],
  
  // Monthly Aggregates
  monthlyStats: [{
    month: Number,
    year: Number,
    interviewsCompleted: Number,
    averageScore: Number,
    improvement: Number,
    timeSpentMinutes: Number
  }],
  
  // Score Distribution
  scoreDistribution: {
    excellent: { type: Number, default: 0 }, // 85-100
    good: { type: Number, default: 0 },       // 70-84
    average: { type: Number, default: 0 },    // 50-69
    needsWork: { type: Number, default: 0 },  // 30-49
    poor: { type: Number, default: 0 }        // 0-29
  },
  
  // Recent Performance (last 10 interviews)
  recentScores: [{
    interviewId: mongoose.Schema.Types.ObjectId,
    score: Number,
    category: String,
    date: Date
  }],
  
  // Achievement & Milestones
  achievements: [{
    name: String,
    description: String,
    unlockedAt: Date,
    category: String,
    icon: String
  }],
  
  // Goals Tracking
  goals: [{
    title: String,
    description: String,
    targetValue: Number,
    currentValue: Number,
    type: {
      type: String,
      enum: ['score', 'interviews', 'streak', 'time', 'category']
    },
    status: {
      type: String,
      enum: ['active', 'completed', 'expired'],
      default: 'active'
    },
    deadline: Date,
    createdAt: { type: Date, default: Date.now }
  }],
  
  // Comparison Metrics
  rankings: {
    globalPercentile: Number,
    categoryRankings: [{
      category: String,
      percentile: Number
    }],
    lastUpdated: Date
  },
  
  // Learning Path Progress
  learningPath: {
    currentPhase: String,
    completedTopics: [String],
    recommendedTopics: [String],
    nextMilestone: String
  }

}, {
  timestamps: true
});

// ===========================================
// Indexes
// ===========================================

analyticsSchema.index({ 'overallStats.averageScore': -1 });
analyticsSchema.index({ 'overallStats.totalInterviews': -1 });

// ===========================================
// Instance Methods
// ===========================================

/**
 * Update statistics after completing an interview
 * @param {Object} interviewData - Completed interview data
 */
analyticsSchema.methods.updateFromInterview = async function(interviewData) {
  // Update overall stats
  this.overallStats.totalInterviews += 1;
  this.overallStats.completedInterviews += 1;
  this.overallStats.totalQuestionsAttempted += interviewData.questionsAnswered;
  this.overallStats.totalQuestionsSkipped += interviewData.questionsSkipped;
  
  // Update average score
  const totalScoreSum = this.overallStats.averageScore * (this.overallStats.completedInterviews - 1) + interviewData.overallScore;
  this.overallStats.averageScore = Math.round(totalScoreSum / this.overallStats.completedInterviews);
  
  // Update high/low scores
  if (interviewData.overallScore > this.overallStats.highestScore) {
    this.overallStats.highestScore = interviewData.overallScore;
  }
  if (interviewData.overallScore < this.overallStats.lowestScore) {
    this.overallStats.lowestScore = interviewData.overallScore;
  }
  
  // Update practice time
  this.overallStats.totalPracticeTimeMinutes += Math.round(interviewData.totalDurationSeconds / 60);
  
  // Update score distribution
  if (interviewData.overallScore >= 85) this.scoreDistribution.excellent += 1;
  else if (interviewData.overallScore >= 70) this.scoreDistribution.good += 1;
  else if (interviewData.overallScore >= 50) this.scoreDistribution.average += 1;
  else if (interviewData.overallScore >= 30) this.scoreDistribution.needsWork += 1;
  else this.scoreDistribution.poor += 1;
  
  // Update recent scores
  this.recentScores.unshift({
    interviewId: interviewData._id,
    score: interviewData.overallScore,
    category: interviewData.category,
    date: new Date()
  });
  if (this.recentScores.length > 10) {
    this.recentScores = this.recentScores.slice(0, 10);
  }
  
  // Update category performance
  await this.updateCategoryPerformance(interviewData.category, interviewData.overallScore);
  
  // Update streak
  await this.updateStreak();
  
  this.overallStats.lastActiveDate = new Date();
  
  return this.save();
};

/**
 * Update category performance
 * @param {string} category - Interview category
 * @param {number} score - Interview score
 */
analyticsSchema.methods.updateCategoryPerformance = function(category, score) {
  let categoryStats = this.categoryPerformance.find(c => c.category === category);
  
  if (!categoryStats) {
    categoryStats = {
      category,
      totalQuestions: 0,
      correctAnswers: 0,
      averageScore: 0,
      bestScore: 0,
      worstScore: 100,
      scoreHistory: []
    };
    this.categoryPerformance.push(categoryStats);
    categoryStats = this.categoryPerformance[this.categoryPerformance.length - 1];
  }
  
  categoryStats.totalQuestions += 1;
  if (score >= 70) categoryStats.correctAnswers += 1;
  
  // Update average
  const totalScore = categoryStats.averageScore * (categoryStats.totalQuestions - 1) + score;
  categoryStats.averageScore = Math.round(totalScore / categoryStats.totalQuestions);
  
  // Update best/worst
  if (score > categoryStats.bestScore) categoryStats.bestScore = score;
  if (score < categoryStats.worstScore) categoryStats.worstScore = score;
  
  categoryStats.lastAttemptDate = new Date();
  
  // Add to history
  categoryStats.scoreHistory.push({ score, date: new Date() });
  if (categoryStats.scoreHistory.length > 20) {
    categoryStats.scoreHistory = categoryStats.scoreHistory.slice(-20);
  }
  
  // Calculate trend
  if (categoryStats.scoreHistory.length >= 3) {
    const recent = categoryStats.scoreHistory.slice(-3);
    const avgRecent = recent.reduce((a, b) => a + b.score, 0) / 3;
    const older = categoryStats.scoreHistory.slice(-6, -3);
    if (older.length >= 3) {
      const avgOlder = older.reduce((a, b) => a + b.score, 0) / 3;
      if (avgRecent > avgOlder + 5) categoryStats.trend = 'improving';
      else if (avgRecent < avgOlder - 5) categoryStats.trend = 'declining';
      else categoryStats.trend = 'stable';
    }
  }
};

/**
 * Update practice streak
 */
analyticsSchema.methods.updateStreak = function() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const lastActive = this.overallStats.lastActiveDate;
  if (lastActive) {
    const lastActiveDay = new Date(lastActive);
    lastActiveDay.setHours(0, 0, 0, 0);
    
    const diffDays = Math.floor((today - lastActiveDay) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      // Same day, streak continues
    } else if (diffDays === 1) {
      // Next day, increment streak
      this.overallStats.currentStreak += 1;
      if (this.overallStats.currentStreak > this.overallStats.longestStreak) {
        this.overallStats.longestStreak = this.overallStats.currentStreak;
      }
    } else {
      // Streak broken
      this.overallStats.currentStreak = 1;
    }
  } else {
    this.overallStats.currentStreak = 1;
  }
};

/**
 * Add daily snapshot
 */
analyticsSchema.methods.addDailySnapshot = function(snapshotData) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const existingIndex = this.dailySnapshots.findIndex(s => {
    const snapshotDate = new Date(s.date);
    snapshotDate.setHours(0, 0, 0, 0);
    return snapshotDate.getTime() === today.getTime();
  });
  
  if (existingIndex >= 0) {
    // Update existing snapshot
    const existing = this.dailySnapshots[existingIndex];
    existing.interviewsCompleted += snapshotData.interviewsCompleted || 0;
    existing.questionsAnswered += snapshotData.questionsAnswered || 0;
    existing.timeSpentMinutes += snapshotData.timeSpentMinutes || 0;
    if (snapshotData.averageScore) {
      existing.averageScore = (existing.averageScore + snapshotData.averageScore) / 2;
    }
  } else {
    // Add new snapshot
    this.dailySnapshots.push({
      date: today,
      ...snapshotData
    });
    
    // Keep only last 90 days
    if (this.dailySnapshots.length > 90) {
      this.dailySnapshots = this.dailySnapshots.slice(-90);
    }
  }
  
  return this.save();
};

/**
 * Unlock achievement
 * @param {Object} achievement - Achievement data
 */
analyticsSchema.methods.unlockAchievement = function(achievement) {
  const exists = this.achievements.find(a => a.name === achievement.name);
  if (!exists) {
    this.achievements.push({
      ...achievement,
      unlockedAt: new Date()
    });
  }
  return this.save();
};

// ===========================================
// Static Methods
// ===========================================

/**
 * Get or create analytics for user
 * @param {ObjectId} userId - User ID
 * @returns {Promise<Analytics>} - Analytics document
 */
analyticsSchema.statics.getOrCreate = async function(userId) {
  let analytics = await this.findOne({ user: userId });
  if (!analytics) {
    analytics = await this.create({ user: userId });
  }
  return analytics;
};

/**
 * Get leaderboard
 * @param {Object} options - Options (limit, category)
 * @returns {Promise<Array>} - Leaderboard entries
 */
analyticsSchema.statics.getLeaderboard = function(options = {}) {
  const { limit = 10, category } = options;
  
  let sortField = 'overallStats.averageScore';
  if (category) {
    // This would need a more complex aggregation for category-specific leaderboard
  }
  
  return this.find({ 'overallStats.completedInterviews': { $gte: 5 } })
    .sort({ [sortField]: -1 })
    .limit(limit)
    .populate('user', 'firstName lastName avatar')
    .select('user overallStats.averageScore overallStats.completedInterviews overallStats.currentStreak');
};

const Analytics = mongoose.model('Analytics', analyticsSchema);

module.exports = Analytics;
