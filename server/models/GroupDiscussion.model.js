/**
 * Group Discussion Model - MongoDB Schema
 */

const mongoose = require('mongoose');

const gdTopicSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: String,
  category: {
    type: String,
    enum: ['current-affairs', 'social-issues', 'technology', 'business', 'abstract', 'case-study'],
    required: true
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    default: 'medium'
  },
  keyPoints: [String],
  forArguments: [String],
  againstArguments: [String],
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

const gdSessionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  topic: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'GDTopic',
    required: true
  },
  topicTitle: String,
  mode: {
    type: String,
    enum: ['solo-practice', 'ai-participants', 'live'],
    default: 'ai-participants'
  },
  userContributions: [{
    content: String,
    timestamp: Date,
    sentiment: String,
    relevance: Number,
    aiScore: Number
  }],
  aiParticipants: [{
    name: String,
    personality: String,
    contributions: [{
      content: String,
      timestamp: Date
    }]
  }],
  feedback: {
    overallScore: Number,
    communication: Number,
    content: Number,
    leadership: Number,
    teamwork: Number,
    reasoning: Number,
    strengths: [String],
    improvements: [String],
    summary: String
  },
  status: {
    type: String,
    enum: ['scheduled', 'in-progress', 'completed', 'cancelled'],
    default: 'scheduled'
  },
  duration: Number, // minutes
  startedAt: Date,
  completedAt: Date
}, {
  timestamps: true
});

gdTopicSchema.index({ category: 1, difficulty: 1 });
gdSessionSchema.index({ user: 1, status: 1 });

const GDTopic = mongoose.model('GDTopic', gdTopicSchema);
const GDSession = mongoose.model('GDSession', gdSessionSchema);

module.exports = { GDTopic, GDSession };
