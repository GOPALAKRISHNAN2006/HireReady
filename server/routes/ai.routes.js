/**
 * ===========================================
 * AI Routes
 * ===========================================
 * 
 * Handles AI-related operations like question generation and answer evaluation.
 * 
 * Routes:
 * POST /api/ai/generate-questions - Generate interview questions
 * POST /api/ai/evaluate-answer - Evaluate user's answer
 * POST /api/ai/generate-feedback - Generate detailed feedback
 */

const express = require('express');
const router = express.Router();
const AIService = require('../services/ai.service');
const Question = require('../models/Question.model');
const { protect, authorize } = require('../middleware/auth.middleware');
const { asyncHandler } = require('../middleware/errorHandler');

/**
 * @route   POST /api/ai/generate-questions
 * @desc    Generate interview questions using AI
 * @access  Private/Admin
 */
router.post('/generate-questions', 
  protect, 
  authorize('admin', 'moderator'),
  asyncHandler(async (req, res) => {
    const {
      category,
      difficulty = 'medium',
      count = 5,
      targetRole,
      topics,
      style = 'technical'
    } = req.body;

    if (!category) {
      return res.status(400).json({
        success: false,
        message: 'Category is required.'
      });
    }

    try {
      const generatedQuestions = await AIService.generateQuestions({
        category,
        difficulty,
        count: Math.min(count, 10), // Limit to 10 questions per request
        targetRole,
        topics,
        style
      });

      // Save questions to database (as unapproved for review)
      const savedQuestions = await Promise.all(
        generatedQuestions.map(async (q) => {
          const question = await Question.create({
            text: q.text,
            category,
            difficulty,
            type: q.type || 'technical',
            tags: q.tags || [],
            targetRoles: targetRole ? [targetRole] : [],
            expectedAnswer: q.expectedAnswer,
            keyPoints: q.keyPoints || [],
            hints: q.hints || [],
            followUpQuestions: q.followUpQuestions || [],
            isAIGenerated: true,
            aiProvider: AIService.getProvider(),
            isApproved: false, // Require admin approval
            createdBy: req.user._id,
            recommendedTimeMinutes: q.recommendedTimeMinutes || 5
          });
          return question;
        })
      );

      res.status(201).json({
        success: true,
        message: `Generated ${savedQuestions.length} questions successfully.`,
        data: {
          questions: savedQuestions,
          provider: AIService.getProvider()
        }
      });

    } catch (error) {
      console.error('AI Question Generation Error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to generate questions. Please try again.',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  })
);

/**
 * @route   POST /api/ai/generate-question
 * @desc    Generate a single interview question using AI
 * @access  Private/Admin
 */
router.post('/generate-question', 
  protect, 
  authorize('admin', 'moderator'),
  asyncHandler(async (req, res) => {
    const {
      category = 'general',
      difficulty = 'medium',
      targetRole,
      topics,
      style = 'technical'
    } = req.body;

    try {
      const generatedQuestions = await AIService.generateQuestions({
        category,
        difficulty,
        count: 1,
        targetRole,
        topics,
        style
      });

      if (generatedQuestions.length === 0) {
        return res.status(500).json({
          success: false,
          message: 'Failed to generate question.'
        });
      }

      const q = generatedQuestions[0];
      
      res.status(200).json({
        success: true,
        question: {
          text: q.text,
          category,
          difficulty,
          type: q.type || 'technical',
          tags: q.tags || [category, difficulty],
          expectedAnswer: q.expectedAnswer,
          hints: q.hints || [],
          keyPoints: q.keyPoints || [],
        },
        provider: AIService.getProvider()
      });

    } catch (error) {
      console.error('AI Question Generation Error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to generate question. Please try again.',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  })
);

/**
 * @route   POST /api/ai/evaluate-answer
 * @desc    Evaluate a user's answer using AI
 * @access  Private
 */
router.post('/evaluate-answer', protect, asyncHandler(async (req, res) => {
  const {
    question,
    expectedAnswer,
    userAnswer,
    category,
    keyPoints
  } = req.body;

  if (!question || !userAnswer) {
    return res.status(400).json({
      success: false,
      message: 'Question and user answer are required.'
    });
  }

  try {
    const evaluation = await AIService.evaluateAnswer({
      question,
      expectedAnswer,
      userAnswer,
      category,
      keyPoints
    });

    res.status(200).json({
      success: true,
      data: {
        evaluation,
        provider: AIService.getProvider()
      }
    });

  } catch (error) {
    console.error('AI Evaluation Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to evaluate answer. Please try again.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}));

/**
 * @route   POST /api/ai/generate-feedback
 * @desc    Generate detailed feedback for an interview
 * @access  Private
 */
router.post('/generate-feedback', protect, asyncHandler(async (req, res) => {
  const {
    category,
    difficulty,
    responses,
    overallScore,
    categoryScores
  } = req.body;

  if (!responses || !Array.isArray(responses)) {
    return res.status(400).json({
      success: false,
      message: 'Interview responses are required.'
    });
  }

  try {
    const feedback = await AIService.generateInterviewInsights({
      category,
      difficulty,
      responses,
      overallScore,
      categoryScores
    });

    res.status(200).json({
      success: true,
      data: {
        feedback,
        provider: AIService.getProvider()
      }
    });

  } catch (error) {
    console.error('AI Feedback Generation Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate feedback. Please try again.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}));

/**
 * @route   POST /api/ai/analyze-resume
 * @desc    Analyze resume and suggest interview focus areas
 * @access  Private
 */
router.post('/analyze-resume', protect, asyncHandler(async (req, res) => {
  const { resumeText, targetRole } = req.body;

  if (!resumeText) {
    return res.status(400).json({
      success: false,
      message: 'Resume text is required.'
    });
  }

  try {
    const analysis = await AIService.analyzeResume({
      resumeText,
      targetRole
    });

    res.status(200).json({
      success: true,
      data: {
        analysis,
        provider: AIService.getProvider()
      }
    });

  } catch (error) {
    console.error('Resume Analysis Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to analyze resume. Please try again.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}));

/**
 * @route   POST /api/ai/improve-answer
 * @desc    Get suggestions to improve an answer
 * @access  Private
 */
router.post('/improve-answer', protect, asyncHandler(async (req, res) => {
  const { question, userAnswer, category } = req.body;

  if (!question || !userAnswer) {
    return res.status(400).json({
      success: false,
      message: 'Question and answer are required.'
    });
  }

  try {
    const improvements = await AIService.suggestImprovements({
      question,
      userAnswer,
      category
    });

    res.status(200).json({
      success: true,
      data: {
        improvements,
        provider: AIService.getProvider()
      }
    });

  } catch (error) {
    console.error('Answer Improvement Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate improvements. Please try again.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}));

/**
 * @route   POST /api/ai/chat
 * @desc    AI chatbot - general conversation for interview prep assistance
 * @access  Private
 */
router.post('/chat', protect, asyncHandler(async (req, res) => {
  const { message, conversationHistory } = req.body;

  if (!message || !message.trim()) {
    return res.status(400).json({
      success: false,
      message: 'Message is required.'
    });
  }

  try {
    const response = await AIService.chat({
      message: message.trim(),
      conversationHistory: conversationHistory || []
    });

    res.status(200).json({
      success: true,
      data: {
        response,
        provider: AIService.getProvider()
      }
    });
  } catch (error) {
    console.error('AI Chat Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate response. Please try again.'
    });
  }
}));

/**
 * @route   GET /api/ai/status
 * @desc    Check AI service status
 * @access  Private/Admin
 */
router.get('/status', protect, authorize('admin'), asyncHandler(async (req, res) => {
  const status = await AIService.checkStatus();

  res.status(200).json({
    success: true,
    data: {
      status,
      provider: AIService.getProvider(),
      isConfigured: status.isConfigured
    }
  });
}));

module.exports = router;
