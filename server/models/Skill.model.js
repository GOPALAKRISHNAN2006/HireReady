/**
 * ===========================================
 * Skill Assessment Model - MongoDB Schema
 * ===========================================
 * 
 * Tracks user skills, assessments, and progress for Skill Radar.
 */

const mongoose = require('mongoose');

// Skill Category Schema
const skillCategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  displayName: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  icon: {
    type: String,
    default: '📊'
  },
  color: {
    type: String,
    default: '#3B82F6'
  },
  subSkills: [{
    name: String,
    weight: { type: Number, default: 1 }
  }],
  maxLevel: {
    type: Number,
    default: 100
  },
  assessmentQuestions: [{
    question: String,
    options: [String],
    correctAnswer: Number,
    difficulty: { type: String, enum: ['easy', 'medium', 'hard'] },
    points: { type: Number, default: 10 }
  }]
}, {
  timestamps: true
});

// User Skill Assessment Schema
const userSkillSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  skills: [{
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'SkillCategory'
    },
    categoryName: String,
    currentLevel: {
      type: Number,
      min: 0,
      max: 100,
      default: 0
    },
    targetLevel: {
      type: Number,
      min: 0,
      max: 100,
      default: 80
    },
    assessmentsTaken: {
      type: Number,
      default: 0
    },
    lastAssessedAt: Date,
    history: [{
      level: Number,
      assessedAt: Date,
      source: { type: String, enum: ['assessment', 'interview', 'practice', 'manual'] }
    }],
    subSkillLevels: [{
      name: String,
      level: Number
    }]
  }],
  overallLevel: {
    type: Number,
    default: 0
  },
  rank: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced', 'expert', 'master'],
    default: 'beginner'
  },
  strengths: [{
    type: String
  }],
  weaknesses: [{
    type: String
  }],
  recommendations: [{
    skill: String,
    action: String,
    priority: { type: String, enum: ['low', 'medium', 'high'] },
    resources: [{
      title: String,
      url: String,
      type: String
    }]
  }],
  lastFullAssessment: Date,
  assessmentHistory: [{
    date: Date,
    overallScore: Number,
    skillScores: [{
      skill: String,
      score: Number
    }]
  }]
}, {
  timestamps: true
});

// Indexes
userSkillSchema.index({ user: 1 }, { unique: true });
userSkillSchema.index({ overallLevel: -1 });
userSkillSchema.index({ rank: 1 });

// Methods
userSkillSchema.methods.updateSkillLevel = async function(categoryName, newLevel, source = 'assessment') {
  const skillIndex = this.skills.findIndex(s => s.categoryName === categoryName);
  
  if (skillIndex >= 0) {
    const skill = this.skills[skillIndex];
    skill.currentLevel = newLevel;
    skill.lastAssessedAt = new Date();
    skill.assessmentsTaken += 1;
    skill.history.push({
      level: newLevel,
      assessedAt: new Date(),
      source
    });
    
    // Keep only last 20 history entries
    if (skill.history.length > 20) {
      skill.history = skill.history.slice(-20);
    }
  } else {
    this.skills.push({
      categoryName,
      currentLevel: newLevel,
      lastAssessedAt: new Date(),
      assessmentsTaken: 1,
      history: [{ level: newLevel, assessedAt: new Date(), source }]
    });
  }
  
  // Recalculate overall level
  this.calculateOverall();
  
  return this.save();
};

userSkillSchema.methods.calculateOverall = function() {
  if (this.skills.length === 0) {
    this.overallLevel = 0;
    this.rank = 'beginner';
    return;
  }
  
  const total = this.skills.reduce((sum, s) => sum + s.currentLevel, 0);
  this.overallLevel = Math.round(total / this.skills.length);
  
  // Determine rank
  if (this.overallLevel >= 90) this.rank = 'master';
  else if (this.overallLevel >= 75) this.rank = 'expert';
  else if (this.overallLevel >= 55) this.rank = 'advanced';
  else if (this.overallLevel >= 35) this.rank = 'intermediate';
  else this.rank = 'beginner';
  
  // Update strengths and weaknesses
  const sorted = [...this.skills].sort((a, b) => b.currentLevel - a.currentLevel);
  this.strengths = sorted.slice(0, 3).map(s => s.categoryName);
  this.weaknesses = sorted.slice(-3).reverse().map(s => s.categoryName);
};

userSkillSchema.methods.generateRecommendations = function() {
  this.recommendations = [];
  
  // Find skills below target
  for (const skill of this.skills) {
    if (skill.currentLevel < skill.targetLevel) {
      const gap = skill.targetLevel - skill.currentLevel;
      let priority = 'low';
      if (gap > 30) priority = 'high';
      else if (gap > 15) priority = 'medium';
      
      this.recommendations.push({
        skill: skill.categoryName,
        action: `Improve ${skill.categoryName} by ${gap} points to reach your target`,
        priority,
        resources: []
      });
    }
  }
  
  // Sort by priority
  const priorityOrder = { high: 0, medium: 1, low: 2 };
  this.recommendations.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
  
  return this.recommendations;
};

// Static methods
userSkillSchema.statics.getOrCreate = async function(userId) {
  let userSkill = await this.findOne({ user: userId });
  if (!userSkill) {
    // Create with default skill categories
    const defaultSkills = [
      { categoryName: 'Data Structures', currentLevel: 0, targetLevel: 80 },
      { categoryName: 'Algorithms', currentLevel: 0, targetLevel: 80 },
      { categoryName: 'System Design', currentLevel: 0, targetLevel: 70 },
      { categoryName: 'Problem Solving', currentLevel: 0, targetLevel: 85 },
      { categoryName: 'Communication', currentLevel: 0, targetLevel: 75 },
      { categoryName: 'Behavioral', currentLevel: 0, targetLevel: 70 }
    ];
    
    userSkill = await this.create({
      user: userId,
      skills: defaultSkills
    });
  }
  return userSkill;
};

userSkillSchema.statics.getLeaderboard = async function(limit = 10) {
  return this.find()
    .populate('user', 'firstName lastName avatar')
    .sort({ overallLevel: -1 })
    .limit(limit)
    .select('user overallLevel rank');
};

const SkillCategory = mongoose.model('SkillCategory', skillCategorySchema);
const UserSkill = mongoose.model('UserSkill', userSkillSchema);

module.exports = { SkillCategory, UserSkill };
