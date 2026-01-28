/**
 * ===========================================
 * Daily Challenge Model - MongoDB Schema
 * ===========================================
 * 
 * Tracks daily challenges, user attempts, and streak data.
 */

const mongoose = require('mongoose');

// Challenge Schema
const challengeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ['dsa', 'system-design', 'behavioral', 'technical', 'coding', 'problem-solving'],
    default: 'coding'
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard', 'expert'],
    default: 'medium'
  },
  points: {
    type: Number,
    default: 100
  },
  timeLimit: {
    type: Number, // in minutes
    default: 30
  },
  question: {
    type: String,
    required: true
  },
  expectedAnswer: {
    type: String,
    description: 'The expected correct answer for validation'
  },
  hints: [{
    type: String
  }],
  solution: {
    type: String
  },
  sampleInput: String,
  sampleOutput: String,
  testCases: [{
    input: String,
    expectedOutput: String,
    isHidden: { type: Boolean, default: false }
  }],
  tags: [String],
  activeDate: {
    type: Date,
    required: true,
    index: true
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// User Challenge Attempt Schema
const userChallengeSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  challenge: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'DailyChallenge',
    required: true
  },
  answer: {
    type: String
  },
  code: {
    type: String
  },
  isCompleted: {
    type: Boolean,
    default: false
  },
  score: {
    type: Number,
    default: 0
  },
  pointsEarned: {
    type: Number,
    default: 0
  },
  timeSpent: {
    type: Number, // in seconds
    default: 0
  },
  hintsUsed: {
    type: Number,
    default: 0
  },
  attemptDate: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// User Streak Schema
const userStreakSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
    index: true
  },
  currentStreak: {
    type: Number,
    default: 0
  },
  longestStreak: {
    type: Number,
    default: 0
  },
  totalPoints: {
    type: Number,
    default: 0
  },
  totalChallengesCompleted: {
    type: Number,
    default: 0
  },
  lastChallengeDate: {
    type: Date
  },
  streakHistory: [{
    date: Date,
    challengeId: mongoose.Schema.Types.ObjectId,
    pointsEarned: Number
  }],
  achievements: [{
    name: String,
    description: String,
    earnedAt: Date,
    icon: String
  }]
}, {
  timestamps: true
});

// Indexes
challengeSchema.index({ activeDate: 1, isActive: 1 });
userChallengeSchema.index({ user: 1, challenge: 1 }, { unique: true });
userChallengeSchema.index({ user: 1, attemptDate: -1 });

// Static methods
challengeSchema.statics.getTodaysChallenge = async function() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  return this.findOne({
    activeDate: { $gte: today, $lt: tomorrow },
    isActive: true
  });
};

userStreakSchema.statics.getOrCreate = async function(userId) {
  let streak = await this.findOne({ user: userId });
  if (!streak) {
    streak = await this.create({ user: userId });
  }
  return streak;
};

userStreakSchema.methods.updateStreak = async function(challengeId, pointsEarned) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  
  // Check if last challenge was yesterday or today
  if (this.lastChallengeDate) {
    const lastDate = new Date(this.lastChallengeDate);
    lastDate.setHours(0, 0, 0, 0);
    
    if (lastDate.getTime() === today.getTime()) {
      // Already completed today's challenge
      return this;
    } else if (lastDate.getTime() === yesterday.getTime()) {
      // Streak continues
      this.currentStreak += 1;
    } else {
      // Streak broken
      this.currentStreak = 1;
    }
  } else {
    this.currentStreak = 1;
  }
  
  // Update longest streak
  if (this.currentStreak > this.longestStreak) {
    this.longestStreak = this.currentStreak;
  }
  
  // Add to history
  this.streakHistory.push({
    date: today,
    challengeId,
    pointsEarned
  });
  
  // Update totals
  this.totalPoints += pointsEarned;
  this.totalChallengesCompleted += 1;
  this.lastChallengeDate = today;
  
  // Check for streak achievements
  const streakMilestones = [7, 30, 60, 100, 365];
  for (const milestone of streakMilestones) {
    if (this.currentStreak === milestone) {
      const exists = this.achievements.find(a => a.name === `${milestone} Day Streak`);
      if (!exists) {
        this.achievements.push({
          name: `${milestone} Day Streak`,
          description: `Completed ${milestone} days in a row!`,
          earnedAt: new Date(),
          icon: milestone >= 100 ? '🏆' : milestone >= 30 ? '🔥' : '⭐'
        });
      }
    }
  }
  
  return this.save();
};

const DailyChallenge = mongoose.model('DailyChallenge', challengeSchema);
const UserChallenge = mongoose.model('UserChallenge', userChallengeSchema);
const UserStreak = mongoose.model('UserStreak', userStreakSchema);

module.exports = { DailyChallenge, UserChallenge, UserStreak };
