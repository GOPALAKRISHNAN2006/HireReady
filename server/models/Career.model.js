/**
 * ===========================================
 * Career Progress Model - MongoDB Schema
 * ===========================================
 * 
 * Tracks user career roadmap progress and milestones.
 */

const mongoose = require('mongoose');

// Career Path Schema
const careerPathSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  description: {
    type: String
  },
  icon: {
    type: String,
    default: '💼'
  },
  color: {
    type: String,
    default: '#3B82F6'
  },
  totalMilestones: {
    type: Number,
    default: 0
  },
  estimatedDuration: {
    type: String,
    default: '6-12 months'
  },
  salaryRange: {
    min: Number,
    max: Number,
    currency: { type: String, default: 'USD' }
  },
  demandLevel: {
    type: String,
    enum: ['low', 'medium', 'high', 'very-high'],
    default: 'medium'
  },
  milestones: [{
    order: Number,
    title: String,
    description: String,
    skills: [String],
    resources: [{
      title: String,
      url: String,
      type: { type: String, enum: ['video', 'article', 'course', 'book', 'project'] }
    }],
    estimatedTime: String,
    isRequired: { type: Boolean, default: true }
  }],
  prerequisites: [{
    type: String
  }],
  relatedPaths: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CareerPath'
  }]
}, {
  timestamps: true
});

// User Career Progress Schema
const userCareerProgressSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  selectedPath: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CareerPath',
    required: true
  },
  currentMilestone: {
    type: Number,
    default: 0
  },
  completedMilestones: [{
    milestoneIndex: Number,
    completedAt: Date,
    notes: String
  }],
  progressPercentage: {
    type: Number,
    default: 0
  },
  startedAt: {
    type: Date,
    default: Date.now
  },
  targetCompletionDate: {
    type: Date
  },
  status: {
    type: String,
    enum: ['active', 'paused', 'completed', 'abandoned'],
    default: 'active'
  },
  notes: [{
    content: String,
    createdAt: { type: Date, default: Date.now }
  }],
  skillsAcquired: [{
    name: String,
    level: { type: Number, min: 1, max: 100 },
    acquiredAt: Date
  }]
}, {
  timestamps: true
});

// Indexes
userCareerProgressSchema.index({ user: 1, selectedPath: 1 }, { unique: true });
userCareerProgressSchema.index({ user: 1, status: 1 });

// Methods
userCareerProgressSchema.methods.completeMilestone = async function(milestoneIndex) {
  const CareerPath = mongoose.model('CareerPath');
  const path = await CareerPath.findById(this.selectedPath);
  
  if (!path) {
    throw new Error('Career path not found');
  }
  
  // Check if already completed
  const exists = this.completedMilestones.find(m => m.milestoneIndex === milestoneIndex);
  if (exists) {
    return this;
  }
  
  // Add to completed
  this.completedMilestones.push({
    milestoneIndex,
    completedAt: new Date()
  });
  
  // Update current milestone
  if (milestoneIndex >= this.currentMilestone) {
    this.currentMilestone = milestoneIndex + 1;
  }
  
  // Calculate progress
  this.progressPercentage = Math.round(
    (this.completedMilestones.length / path.milestones.length) * 100
  );
  
  // Check if completed
  if (this.completedMilestones.length >= path.milestones.length) {
    this.status = 'completed';
  }
  
  return this.save();
};

// Static methods
careerPathSchema.statics.getPopularPaths = async function(limit = 5) {
  const UserCareerProgress = mongoose.model('UserCareerProgress');
  
  const popular = await UserCareerProgress.aggregate([
    { $group: { _id: '$selectedPath', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: limit }
  ]);
  
  const pathIds = popular.map(p => p._id);
  return this.find({ _id: { $in: pathIds } });
};

userCareerProgressSchema.statics.getOrCreate = async function(userId, pathId) {
  let progress = await this.findOne({ user: userId, selectedPath: pathId });
  if (!progress) {
    progress = await this.create({ user: userId, selectedPath: pathId });
  }
  return progress;
};

const CareerPath = mongoose.model('CareerPath', careerPathSchema);
const UserCareerProgress = mongoose.model('UserCareerProgress', userCareerProgressSchema);

module.exports = { CareerPath, UserCareerProgress };
