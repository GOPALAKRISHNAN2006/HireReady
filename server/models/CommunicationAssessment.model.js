/**
 * ===========================================
 * Communication Assessment Model
 * ===========================================
 * 
 * Stores communication skills assessments
 * for interview responses.
 */

const mongoose = require('mongoose');

// Sub-scores schema for detailed metrics
const SubScoresSchema = new mongoose.Schema({
  fluency: {
    type: Number,
    min: 0,
    max: 10,
    required: true,
    description: 'Speaking rate, pacing, and smoothness of delivery'
  },
  clarity_structure: {
    type: Number,
    min: 0,
    max: 10,
    required: true,
    description: 'Logical flow, coherence, and organization of ideas'
  },
  grammar_vocabulary: {
    type: Number,
    min: 0,
    max: 10,
    required: true,
    description: 'Grammar accuracy, sentence variety, and vocabulary usage'
  },
  pronunciation: {
    type: Number,
    min: 0,
    max: 10,
    required: true,
    description: 'Speech clarity and understandability'
  },
  tone_confidence: {
    type: Number,
    min: 0,
    max: 10,
    required: true,
    description: 'Tone, confidence level, and professionalism'
  },
  question_relevance: {
    type: Number,
    min: 0,
    max: 10,
    default: 7,
    description: 'How well the response addresses and stays on topic'
  }
}, { _id: false });

// Audio features schema (optional metadata from speech analysis)
const AudioFeaturesSchema = new mongoose.Schema({
  speakingRate: {
    type: Number,
    description: 'Words per minute'
  },
  pauseDuration: {
    type: Number,
    description: 'Average pause duration in seconds'
  },
  fillerWordCount: {
    type: Number,
    description: 'Count of filler words (um, uh, like, etc.)'
  },
  totalDuration: {
    type: Number,
    description: 'Total speaking duration in seconds'
  },
  wordCount: {
    type: Number,
    description: 'Total word count'
  }
}, { _id: false });

// Main Communication Assessment Schema
const CommunicationAssessmentSchema = new mongoose.Schema({
  // Reference to the user
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  // Reference to interview (if applicable)
  interview: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Interview'
  },

  // Question context
  questionId: {
    type: String,
    required: true
  },
  questionText: {
    type: String,
    required: true
  },

  // The transcript of the candidate's response
  transcript: {
    type: String,
    required: true
  },

  // Audio features (optional)
  audioFeatures: AudioFeaturesSchema,

  // Overall score (0-10)
  overallScore: {
    type: Number,
    min: 0,
    max: 10,
    required: true
  },

  // Detailed sub-scores
  subscores: {
    type: SubScoresSchema,
    required: true
  },

  // Strengths identified (2-3 items)
  strengths: [{
    type: String
  }],

  // Improvement suggestions (2-3 items)
  improvements: [{
    type: String
  }],

  // Summary comment (2-3 lines)
  summaryComment: {
    type: String,
    required: true
  },

  // Score level classification
  scoreLevel: {
    type: String,
    enum: ['needs_improvement', 'average', 'strong', 'excellent'],
    required: true
  },

  // Assessment metadata
  assessmentType: {
    type: String,
    enum: ['interview', 'practice', 'mock', 'gd'],
    default: 'interview'
  },

  // Processing status
  status: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'failed'],
    default: 'pending'
  },

  // Error message if processing failed
  errorMessage: String,

  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now
  },
  processedAt: Date

}, {
  timestamps: true
});

// Indexes
CommunicationAssessmentSchema.index({ user: 1, createdAt: -1 });
CommunicationAssessmentSchema.index({ interview: 1 });
CommunicationAssessmentSchema.index({ questionId: 1 });

// Virtual for getting score level label
CommunicationAssessmentSchema.virtual('scoreLevelLabel').get(function() {
  const labels = {
    'needs_improvement': 'Needs Improvement (1-3)',
    'average': 'Average (4-6)',
    'strong': 'Strong (7-8)',
    'excellent': 'Excellent (9-10)'
  };
  return labels[this.scoreLevel] || 'Unknown';
});

// Static method to calculate score level from score
CommunicationAssessmentSchema.statics.getScoreLevel = function(score) {
  if (score >= 9) return 'excellent';
  if (score >= 7) return 'strong';
  if (score >= 4) return 'average';
  return 'needs_improvement';
};

// Static method to get user's assessment history
CommunicationAssessmentSchema.statics.getUserHistory = async function(userId, limit = 10) {
  return this.find({ user: userId, status: 'completed' })
    .sort({ createdAt: -1 })
    .limit(limit)
    .select('questionText overallScore subscores scoreLevel createdAt');
};

// Static method to get user's average scores
CommunicationAssessmentSchema.statics.getUserAverages = async function(userId) {
  const result = await this.aggregate([
    { $match: { user: new mongoose.Types.ObjectId(userId), status: 'completed' } },
    {
      $group: {
        _id: null,
        avgOverall: { $avg: '$overallScore' },
        avgFluency: { $avg: '$subscores.fluency' },
        avgClarity: { $avg: '$subscores.clarity_structure' },
        avgGrammar: { $avg: '$subscores.grammar_vocabulary' },
        avgPronunciation: { $avg: '$subscores.pronunciation' },
        avgTone: { $avg: '$subscores.tone_confidence' },
        totalAssessments: { $sum: 1 }
      }
    }
  ]);

  if (result.length === 0) {
    return null;
  }

  return {
    overall: Math.round(result[0].avgOverall * 10) / 10,
    fluency: Math.round(result[0].avgFluency * 10) / 10,
    clarity_structure: Math.round(result[0].avgClarity * 10) / 10,
    grammar_vocabulary: Math.round(result[0].avgGrammar * 10) / 10,
    pronunciation: Math.round(result[0].avgPronunciation * 10) / 10,
    tone_confidence: Math.round(result[0].avgTone * 10) / 10,
    totalAssessments: result[0].totalAssessments
  };
};

// Static method to get improvement trends
CommunicationAssessmentSchema.statics.getImprovementTrends = async function(userId, days = 30) {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  return this.aggregate([
    {
      $match: {
        user: new mongoose.Types.ObjectId(userId),
        status: 'completed',
        createdAt: { $gte: startDate }
      }
    },
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
        avgScore: { $avg: '$overallScore' },
        count: { $sum: 1 }
      }
    },
    { $sort: { _id: 1 } }
  ]);
};

// Instance method to get formatted result
CommunicationAssessmentSchema.methods.getFormattedResult = function() {
  return {
    question_id: this.questionId,
    overall_score: this.overallScore,
    subscores: {
      fluency: this.subscores.fluency,
      clarity_structure: this.subscores.clarity_structure,
      grammar_vocabulary: this.subscores.grammar_vocabulary,
      pronunciation: this.subscores.pronunciation,
      tone_confidence: this.subscores.tone_confidence
    },
    strengths: this.strengths,
    improvements: this.improvements,
    summary_comment: this.summaryComment,
    score_level: this.scoreLevel
  };
};

const CommunicationAssessment = mongoose.model('CommunicationAssessment', CommunicationAssessmentSchema);

module.exports = CommunicationAssessment;
