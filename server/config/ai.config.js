/**
 * ===========================================
 * AI Service Configuration
 * ===========================================
 * 
 * Configuration for AI services (OpenAI and Google Gemini).
 */

module.exports = {
  // Default AI provider
  defaultProvider: process.env.AI_PROVIDER || 'openai',

  // OpenAI Configuration
  openai: {
    apiKey: process.env.OPENAI_API_KEY,
    model: process.env.OPENAI_MODEL || 'gpt-4',
    maxTokens: 2000,
    temperature: 0.7,
  },

  // Google Gemini Configuration
  gemini: {
    apiKey: process.env.GEMINI_API_KEY,
    model: process.env.GEMINI_MODEL || 'gemini-pro',
  },

  // Question Generation Settings
  questionGeneration: {
    // Maximum questions to generate per request
    maxQuestions: 10,
    
    // Default difficulty level
    defaultDifficulty: 'medium',
    
    // Available difficulty levels
    difficultyLevels: ['easy', 'medium', 'hard', 'expert'],
    
    // Available question categories
    categories: [
      'dsa',           // Data Structures & Algorithms
      'web',           // Web Development
      'ml',            // Machine Learning
      'system-design', // System Design
      'behavioral',    // Behavioral/HR
      'database',      // Database
      'devops',        // DevOps
      'mobile',        // Mobile Development
    ],
  },

  // Response Evaluation Settings
  responseEvaluation: {
    // Evaluation criteria weights
    weights: {
      relevance: 0.30,      // How relevant the answer is
      completeness: 0.25,   // How complete the answer is
      clarity: 0.20,        // How clear the explanation is
      technicalAccuracy: 0.15, // Technical correctness
      communication: 0.10,  // Communication quality
    },
    
    // Score ranges
    scoreRanges: {
      excellent: { min: 85, max: 100 },
      good: { min: 70, max: 84 },
      average: { min: 50, max: 69 },
      needsImprovement: { min: 0, max: 49 },
    },
  },

  // Communication Assessment Settings
  communicationAssessment: {
    // Evaluation dimensions with weights
    dimensions: {
      fluency: { weight: 0.20, label: 'Fluency & Pacing' },
      clarity_structure: { weight: 0.20, label: 'Clarity & Structure' },
      grammar_vocabulary: { weight: 0.15, label: 'Grammar & Vocabulary' },
      pronunciation: { weight: 0.15, label: 'Pronunciation' },
      tone_confidence: { weight: 0.15, label: 'Tone & Confidence' },
      question_relevance: { weight: 0.15, label: 'Question Relevance' }
    },
    
    // Score level thresholds
    scoreLevels: {
      excellent: { min: 9, max: 10 },
      good: { min: 7, max: 8.9 },
      average: { min: 5, max: 6.9 },
      needsImprovement: { min: 0, max: 4.9 }
    },
    
    // AI model settings for communication assessment
    aiSettings: {
      temperature: 0.3,  // Lower for consistent evaluations
      maxTokens: 1000
    }
  }
};
