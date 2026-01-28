/**
 * Aptitude Test Model - MongoDB Schema
 */

const mongoose = require('mongoose');

const aptitudeQuestionSchema = new mongoose.Schema({
  category: {
    type: String,
    enum: ['quantitative', 'logical', 'verbal', 'data-interpretation', 'general-knowledge'],
    required: true
  },
  question: {
    type: String,
    required: true
  },
  options: [{
    text: String,
    isCorrect: Boolean
  }],
  explanation: String,
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    default: 'medium'
  },
  timeLimit: {
    type: Number,
    default: 60 // seconds
  },
  points: {
    type: Number,
    default: 1
  }
}, {
  timestamps: true
});

const aptitudeTestSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  category: {
    type: String,
    enum: ['quantitative', 'logical', 'verbal', 'data-interpretation', 'general-knowledge', 'mixed'],
    required: true
  },
  totalQuestions: {
    type: Number,
    required: true
  },
  questionsAnswered: {
    type: Number,
    default: 0
  },
  correctAnswers: {
    type: Number,
    default: 0
  },
  score: {
    type: Number,
    default: 0
  },
  percentage: {
    type: Number,
    default: 0
  },
  responses: [{
    question: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'AptitudeQuestion'
    },
    questionText: String,
    options: [{
      text: String,
      isCorrect: Boolean
    }],
    selectedOption: Number,
    isCorrect: Boolean,
    timeTaken: Number
  }],
  status: {
    type: String,
    enum: ['in-progress', 'completed', 'abandoned'],
    default: 'in-progress'
  },
  startedAt: Date,
  completedAt: Date,
  totalTime: Number
}, {
  timestamps: true
});

aptitudeQuestionSchema.index({ category: 1, difficulty: 1 });
aptitudeTestSchema.index({ user: 1, status: 1 });

const AptitudeQuestion = mongoose.model('AptitudeQuestion', aptitudeQuestionSchema);
const AptitudeTest = mongoose.model('AptitudeTest', aptitudeTestSchema);

module.exports = { AptitudeQuestion, AptitudeTest };
