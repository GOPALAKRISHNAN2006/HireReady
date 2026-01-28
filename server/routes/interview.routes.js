/**
 * ===========================================
 * Interview Routes
 * ===========================================
 * 
 * Handles interview session management.
 * 
 * Routes:
 * POST /api/interviews - Create new interview
 * GET /api/interviews - Get user's interviews
 * GET /api/interviews/:id - Get interview by ID
 * PUT /api/interviews/:id/start - Start interview
 * POST /api/interviews/:id/submit-answer - Submit answer
 * PUT /api/interviews/:id/complete - Complete interview
 * DELETE /api/interviews/:id - Delete interview
 */

const express = require('express');
const router = express.Router();
const Interview = require('../models/Interview.model');
const Question = require('../models/Question.model');
const Analytics = require('../models/Analytics.model');
const Feedback = require('../models/Feedback.model');
const AIService = require('../services/ai.service');
const { protect } = require('../middleware/auth.middleware');
const { asyncHandler } = require('../middleware/errorHandler');
const { validateInterviewCreation, validateAnswerSubmission, validateObjectId } = require('../middleware/validation.middleware');

/**
 * @route   POST /api/interviews
 * @desc    Create a new interview session
 * @access  Private
 */
router.post('/', protect, validateInterviewCreation, asyncHandler(async (req, res) => {
  let {
    category,
    difficulty = 'medium',
    totalQuestions = 5,
    type = 'practice',
    mode = 'text',
    targetRole,
    targetCompany,
    timeLimitMinutes
  } = req.body;

  // Map frontend category values to backend values
  const categoryMap = {
    'general': 'mixed',
    'web-development': 'web',
    'machine-learning': 'ml',
  };
  const mappedCategory = categoryMap[category] || category;

  // Get random questions based on category and difficulty
  let questions = await Question.getRandomQuestions(
    mappedCategory === 'mixed' ? null : mappedCategory,
    difficulty,
    totalQuestions
  );

  // Fallback questions if no database questions exist - create them in DB
  if (questions.length === 0) {
    const fallbackQuestionsData = {
      'dsa': [
        { text: 'Explain the difference between an Array and a Linked List. When would you use one over the other?', category: 'dsa', difficulty: 'medium', type: 'conceptual', isApproved: true, aiProvider: 'manual' },
        { text: 'What is the time complexity of common operations in a Binary Search Tree?', category: 'dsa', difficulty: 'medium', type: 'conceptual', isApproved: true, aiProvider: 'manual' },
        { text: 'Explain how a hash table works and how collisions are handled.', category: 'dsa', difficulty: 'medium', type: 'conceptual', isApproved: true, aiProvider: 'manual' },
        { text: 'What is the difference between BFS and DFS? When would you use each?', category: 'dsa', difficulty: 'medium', type: 'conceptual', isApproved: true, aiProvider: 'manual' },
        { text: 'Explain the concept of Dynamic Programming with an example.', category: 'dsa', difficulty: 'hard', type: 'conceptual', isApproved: true, aiProvider: 'manual' },
        { text: 'Describe how you would implement a stack using two queues.', category: 'dsa', difficulty: 'medium', type: 'conceptual', isApproved: true, aiProvider: 'manual' },
        { text: 'What is a heap data structure and what are its common applications?', category: 'dsa', difficulty: 'medium', type: 'conceptual', isApproved: true, aiProvider: 'manual' },
        { text: 'Explain the difference between merge sort and quick sort. Which one is better and why?', category: 'dsa', difficulty: 'medium', type: 'conceptual', isApproved: true, aiProvider: 'manual' },
        { text: 'How would you detect a cycle in a linked list? Explain your approach.', category: 'dsa', difficulty: 'medium', type: 'conceptual', isApproved: true, aiProvider: 'manual' },
        { text: 'What is a graph and what are the different ways to represent it in memory?', category: 'dsa', difficulty: 'medium', type: 'conceptual', isApproved: true, aiProvider: 'manual' }
      ],
      'web': [
        { text: 'Explain the Virtual DOM in React and why it improves performance.', category: 'web', difficulty: 'medium', type: 'conceptual', isApproved: true, aiProvider: 'manual' },
        { text: 'What is the difference between REST and GraphQL?', category: 'web', difficulty: 'medium', type: 'conceptual', isApproved: true, aiProvider: 'manual' },
        { text: 'Explain how CORS works and why it is important for web security.', category: 'web', difficulty: 'medium', type: 'technical', isApproved: true, aiProvider: 'manual' },
        { text: 'What are Web Workers and when would you use them?', category: 'web', difficulty: 'medium', type: 'conceptual', isApproved: true, aiProvider: 'manual' },
        { text: 'Explain the difference between cookies, localStorage, and sessionStorage.', category: 'web', difficulty: 'easy', type: 'conceptual', isApproved: true, aiProvider: 'manual' },
        { text: 'What is the event loop in JavaScript? How does it handle asynchronous operations?', category: 'web', difficulty: 'medium', type: 'conceptual', isApproved: true, aiProvider: 'manual' },
        { text: 'Explain the concept of closures in JavaScript with examples.', category: 'web', difficulty: 'medium', type: 'conceptual', isApproved: true, aiProvider: 'manual' },
        { text: 'What are React hooks? Explain useState and useEffect with examples.', category: 'web', difficulty: 'medium', type: 'conceptual', isApproved: true, aiProvider: 'manual' },
        { text: 'How does CSS specificity work? Explain with examples.', category: 'web', difficulty: 'easy', type: 'conceptual', isApproved: true, aiProvider: 'manual' },
        { text: 'What is the difference between SSR and CSR? When would you use each?', category: 'web', difficulty: 'medium', type: 'conceptual', isApproved: true, aiProvider: 'manual' }
      ],
      'behavioral': [
        { text: 'Tell me about a time when you had to work with a difficult team member.', category: 'behavioral', difficulty: 'medium', type: 'behavioral', isApproved: true, aiProvider: 'manual' },
        { text: 'Describe a project where you had to learn a new technology quickly.', category: 'behavioral', difficulty: 'medium', type: 'behavioral', isApproved: true, aiProvider: 'manual' },
        { text: 'Tell me about a time you failed. What did you learn from it?', category: 'behavioral', difficulty: 'medium', type: 'behavioral', isApproved: true, aiProvider: 'manual' },
        { text: 'How do you prioritize tasks when you have multiple deadlines?', category: 'behavioral', difficulty: 'medium', type: 'behavioral', isApproved: true, aiProvider: 'manual' },
        { text: 'Describe a situation where you had to make a decision without complete information.', category: 'behavioral', difficulty: 'medium', type: 'behavioral', isApproved: true, aiProvider: 'manual' },
        { text: 'Tell me about yourself and your experience in software development.', category: 'behavioral', difficulty: 'easy', type: 'behavioral', isApproved: true, aiProvider: 'manual' },
        { text: 'What motivates you to work in technology? Why did you choose this career?', category: 'behavioral', difficulty: 'easy', type: 'behavioral', isApproved: true, aiProvider: 'manual' },
        { text: 'Describe a time when you went above and beyond for a project.', category: 'behavioral', difficulty: 'medium', type: 'behavioral', isApproved: true, aiProvider: 'manual' },
        { text: 'How do you handle feedback and criticism on your work?', category: 'behavioral', difficulty: 'medium', type: 'behavioral', isApproved: true, aiProvider: 'manual' },
        { text: 'Where do you see yourself in 5 years? What are your career goals?', category: 'behavioral', difficulty: 'easy', type: 'behavioral', isApproved: true, aiProvider: 'manual' }
      ],
      'system-design': [
        { text: 'Design a URL shortening service like bit.ly.', category: 'system-design', difficulty: 'medium', type: 'technical', isApproved: true, aiProvider: 'manual' },
        { text: 'How would you design a real-time chat application?', category: 'system-design', difficulty: 'medium', type: 'technical', isApproved: true, aiProvider: 'manual' },
        { text: 'Design a rate limiter for an API.', category: 'system-design', difficulty: 'medium', type: 'technical', isApproved: true, aiProvider: 'manual' },
        { text: 'How would you design a notification system?', category: 'system-design', difficulty: 'medium', type: 'technical', isApproved: true, aiProvider: 'manual' },
        { text: 'Explain how you would scale a web application to handle millions of users.', category: 'system-design', difficulty: 'hard', type: 'technical', isApproved: true, aiProvider: 'manual' },
        { text: 'Design a social media feed like Twitter or Facebook.', category: 'system-design', difficulty: 'hard', type: 'technical', isApproved: true, aiProvider: 'manual' },
        { text: 'How would you design a video streaming platform like YouTube?', category: 'system-design', difficulty: 'hard', type: 'technical', isApproved: true, aiProvider: 'manual' },
        { text: 'Design an e-commerce platform with product catalog and checkout.', category: 'system-design', difficulty: 'medium', type: 'technical', isApproved: true, aiProvider: 'manual' },
        { text: 'How would you design a job scheduler system?', category: 'system-design', difficulty: 'medium', type: 'technical', isApproved: true, aiProvider: 'manual' },
        { text: 'Design a search autocomplete feature for a search engine.', category: 'system-design', difficulty: 'medium', type: 'technical', isApproved: true, aiProvider: 'manual' }
      ],
      'mixed': [
        { text: 'Tell me about yourself and your experience.', category: 'behavioral', difficulty: 'easy', type: 'behavioral', isApproved: true, aiProvider: 'manual' },
        { text: 'Explain the difference between an Array and a Linked List.', category: 'dsa', difficulty: 'medium', type: 'conceptual', isApproved: true, aiProvider: 'manual' },
        { text: 'What is your approach to debugging a complex issue?', category: 'behavioral', difficulty: 'medium', type: 'behavioral', isApproved: true, aiProvider: 'manual' },
        { text: 'Explain how CORS works in web development.', category: 'web', difficulty: 'medium', type: 'technical', isApproved: true, aiProvider: 'manual' },
        { text: 'Describe a challenging project you worked on.', category: 'behavioral', difficulty: 'medium', type: 'behavioral', isApproved: true, aiProvider: 'manual' },
        { text: 'What programming languages are you proficient in? Describe your experience with each.', category: 'behavioral', difficulty: 'easy', type: 'behavioral', isApproved: true, aiProvider: 'manual' },
        { text: 'Explain the concept of API design. What makes a good API?', category: 'web', difficulty: 'medium', type: 'conceptual', isApproved: true, aiProvider: 'manual' },
        { text: 'How do you stay updated with new technologies and trends?', category: 'behavioral', difficulty: 'easy', type: 'behavioral', isApproved: true, aiProvider: 'manual' },
        { text: 'Explain the difference between SQL and NoSQL databases.', category: 'dsa', difficulty: 'medium', type: 'conceptual', isApproved: true, aiProvider: 'manual' },
        { text: 'Describe your experience with version control systems like Git.', category: 'behavioral', difficulty: 'easy', type: 'behavioral', isApproved: true, aiProvider: 'manual' }
      ]
    };

    const categoryQuestions = fallbackQuestionsData[mappedCategory] || fallbackQuestionsData['mixed'];
    const questionsToCreate = categoryQuestions.slice(0, totalQuestions);
    
    // Insert questions into database
    questions = await Question.insertMany(questionsToCreate);
  }

  // Create interview with questions as responses
  const interview = await Interview.create({
    user: req.user._id,
    category: mappedCategory,
    difficulty,
    totalQuestions: questions.length,
    type,
    mode,
    targetRole,
    targetCompany,
    timeLimitMinutes,
    responses: questions.map(q => ({
      question: q._id,
      questionText: q.text
    })),
    status: 'scheduled'
  });

  // Return interview with questions included
  res.status(201).json({
    success: true,
    message: 'Interview created successfully.',
    data: {
      interview: {
        id: interview._id,
        _id: interview._id,
        sessionId: interview.sessionId,
        category: interview.category,
        difficulty: interview.difficulty,
        totalQuestions: interview.totalQuestions,
        type: interview.type,
        mode: interview.mode,
        status: interview.status,
        timeLimitMinutes: interview.timeLimitMinutes,
        responses: interview.responses.map((r, index) => ({
          question: r.question,
          questionText: r.questionText
        })),
        questions: questions.map((q, index) => ({
          _id: q._id,
          text: q.text,
          category: q.category,
          difficulty: q.difficulty,
          hints: q.hints || []
        }))
      }
    }
  });
}));

/**
 * @route   GET /api/interviews
 * @desc    Get user's interview history
 * @access  Private
 */
router.get('/', protect, asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 10,
    status,
    category,
    sortBy = 'createdAt',
    sortOrder = 'desc'
  } = req.query;

  const query = { user: req.user._id };
  if (status) query.status = status;
  if (category) query.category = category;

  const sort = {};
  sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

  const skip = (parseInt(page) - 1) * parseInt(limit);

  const [interviews, total] = await Promise.all([
    Interview.find(query)
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit))
      .select('title category difficulty totalQuestions questionsAnswered overallScore status createdAt completedAt totalDurationSeconds')
      .lean(),
    Interview.countDocuments(query)
  ]);

  res.status(200).json({
    success: true,
    data: {
      interviews,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    }
  });
}));

/**
 * @route   GET /api/interviews/:id
 * @desc    Get interview details by ID
 * @access  Private
 */
router.get('/:id', protect, validateObjectId('id'), asyncHandler(async (req, res) => {
  const interview = await Interview.findOne({
    _id: req.params.id,
    user: req.user._id
  }).populate('responses.question', 'text category difficulty hints');

  if (!interview) {
    return res.status(404).json({
      success: false,
      message: 'Interview not found.'
    });
  }

  res.status(200).json({
    success: true,
    data: { interview }
  });
}));

/**
 * @route   PUT /api/interviews/:id/start
 * @desc    Start an interview session
 * @access  Private
 */
router.put('/:id/start', protect, validateObjectId('id'), asyncHandler(async (req, res) => {
  const interview = await Interview.findOne({
    _id: req.params.id,
    user: req.user._id
  });

  if (!interview) {
    return res.status(404).json({
      success: false,
      message: 'Interview not found.'
    });
  }

  if (interview.status !== 'scheduled') {
    return res.status(400).json({
      success: false,
      message: `Cannot start interview. Current status: ${interview.status}`
    });
  }

  // Start the interview
  await interview.start();

  // Emit socket event if available
  const io = req.app.get('io');
  if (io) {
    io.to(`interview_${interview._id}`).emit('interviewStarted', {
      interviewId: interview._id,
      startedAt: interview.startedAt
    });
  }

  res.status(200).json({
    success: true,
    message: 'Interview started.',
    data: {
      interview: {
        id: interview._id,
        status: interview.status,
        startedAt: interview.startedAt,
        currentQuestionIndex: interview.currentQuestionIndex
      },
      currentQuestion: interview.responses[0] ? {
        index: 0,
        questionId: interview.responses[0].question,
        questionText: interview.responses[0].questionText
      } : null
    }
  });
}));

/**
 * @route   POST /api/interviews/:id/submit-answer
 * @desc    Submit answer for a question
 * @access  Private
 */
router.post('/:id/submit-answer', 
  protect, 
  validateObjectId('id'),
  validateAnswerSubmission,
  asyncHandler(async (req, res) => {
    const { questionId, answer, answerType = 'text', code, programmingLanguage, questionIndex } = req.body;

    const interview = await Interview.findOne({
      _id: req.params.id,
      user: req.user._id
    }).populate('responses.question');

    if (!interview) {
      return res.status(404).json({
        success: false,
        message: 'Interview not found.'
      });
    }

    // Allow submitting answers even if status is 'scheduled' - auto-start the interview
    if (interview.status === 'scheduled') {
      await interview.start();
    } else if (interview.status !== 'in-progress') {
      return res.status(400).json({
        success: false,
        message: 'Interview is not in progress.'
      });
    }

    // Find the response for this question - try multiple matching strategies
    let responseIndex = -1;
    
    // Strategy 1: Match by question ID if it's a valid ObjectId
    if (questionId && questionId.match(/^[0-9a-fA-F]{24}$/)) {
      responseIndex = interview.responses.findIndex(
        r => r.question && (
          r.question._id?.toString() === questionId ||
          r.question.toString() === questionId
        )
      );
    }
    
    // Strategy 2: If not found, try matching by questionIndex
    if (responseIndex === -1 && questionIndex !== undefined) {
      responseIndex = questionIndex;
    }
    
    // Strategy 3: Use current question index from interview
    if (responseIndex === -1) {
      responseIndex = interview.currentQuestionIndex || 0;
    }
    
    // Ensure responseIndex is within bounds
    if (responseIndex < 0 || responseIndex >= interview.responses.length) {
      return res.status(404).json({
        success: false,
        message: 'Question not found in this interview.'
      });
    }

    const response = interview.responses[responseIndex];

    // Update response with answer
    response.answer = answer;
    response.answerType = answerType;
    response.completedAt = new Date();
    
    if (response.startedAt) {
      response.timeSpentSeconds = Math.round((response.completedAt - response.startedAt) / 1000);
    }

    if (code) {
      response.code = code;
      response.programmingLanguage = programmingLanguage;
    }

    // Get AI evaluation
    try {
      const question = response.question;
      const evaluation = await AIService.evaluateAnswer({
        question: question.text,
        expectedAnswer: question.expectedAnswer,
        userAnswer: answer,
        category: question.category,
        keyPoints: question.keyPoints
      });

      response.evaluation = {
        overallScore: evaluation.overallScore,
        relevanceScore: evaluation.relevanceScore,
        completenessScore: evaluation.completenessScore,
        clarityScore: evaluation.clarityScore,
        technicalAccuracyScore: evaluation.technicalAccuracyScore,
        communicationScore: evaluation.communicationScore,
        confidenceScore: evaluation.confidenceScore
      };

      response.feedback = {
        strengths: evaluation.strengths,
        improvements: evaluation.improvements,
        suggestions: evaluation.suggestions,
        detailedFeedback: evaluation.detailedFeedback
      };

      response.keyPointsCovered = evaluation.keyPointsCovered;
      response.isEvaluated = true;

      // Update question statistics
      await Question.findByIdAndUpdate(questionId, {
        $inc: { totalAttempts: 1 },
        $set: { 
          averageScore: (question.averageScore * question.totalAttempts + evaluation.overallScore) / (question.totalAttempts + 1)
        }
      });

    } catch (error) {
      console.error('AI Evaluation error:', error);
      // Continue without AI evaluation
      response.isEvaluated = false;
    }

    // Update interview
    interview.currentQuestionIndex = responseIndex + 1;
    interview.lastActivityAt = new Date();
    await interview.save();

    // Emit socket event
    const io = req.app.get('io');
    if (io) {
      io.to(`interview_${interview._id}`).emit('answerSubmitted', {
        questionId,
        evaluation: response.evaluation,
        nextQuestionIndex: interview.currentQuestionIndex
      });
    }

    // Get next question if available
    const nextQuestion = interview.responses[interview.currentQuestionIndex];

    res.status(200).json({
      success: true,
      message: 'Answer submitted successfully.',
      data: {
        evaluation: response.evaluation,
        feedback: response.feedback,
        isLastQuestion: interview.currentQuestionIndex >= interview.totalQuestions,
        nextQuestion: nextQuestion ? {
          index: interview.currentQuestionIndex,
          questionId: nextQuestion.question._id || nextQuestion.question,
          questionText: nextQuestion.questionText
        } : null
      }
    });
  })
);

/**
 * @route   POST /api/interviews/:id/skip-question
 * @desc    Skip current question
 * @access  Private
 */
router.post('/:id/skip-question', protect, validateObjectId('id'), asyncHandler(async (req, res) => {
  const { questionId } = req.body;

  const interview = await Interview.findOne({
    _id: req.params.id,
    user: req.user._id
  });

  if (!interview) {
    return res.status(404).json({
      success: false,
      message: 'Interview not found.'
    });
  }

  if (interview.status !== 'in-progress') {
    return res.status(400).json({
      success: false,
      message: 'Interview is not in progress.'
    });
  }

  // Find and mark question as skipped
  const responseIndex = interview.responses.findIndex(
    r => r.question.toString() === questionId
  );

  if (responseIndex !== -1) {
    interview.responses[responseIndex].isSkipped = true;
    interview.responses[responseIndex].completedAt = new Date();
    interview.questionsSkipped += 1;
  }

  interview.currentQuestionIndex += 1;
  interview.lastActivityAt = new Date();
  await interview.save();

  const nextQuestion = interview.responses[interview.currentQuestionIndex];

  res.status(200).json({
    success: true,
    message: 'Question skipped.',
    data: {
      isLastQuestion: interview.currentQuestionIndex >= interview.totalQuestions,
      nextQuestion: nextQuestion ? {
        index: interview.currentQuestionIndex,
        questionId: nextQuestion.question,
        questionText: nextQuestion.questionText
      } : null
    }
  });
}));

/**
 * @route   PUT /api/interviews/:id/complete
 * @desc    Complete the interview
 * @access  Private
 */
router.put('/:id/complete', protect, validateObjectId('id'), asyncHandler(async (req, res) => {
  const interview = await Interview.findOne({
    _id: req.params.id,
    user: req.user._id
  });

  if (!interview) {
    return res.status(404).json({
      success: false,
      message: 'Interview not found.'
    });
  }

  if (interview.status === 'completed') {
    return res.status(400).json({
      success: false,
      message: 'Interview is already completed.'
    });
  }

  // Complete the interview
  await interview.complete();

  // Generate overall insights using AI
  try {
    const insights = await AIService.generateInterviewInsights({
      category: interview.category,
      difficulty: interview.difficulty,
      responses: interview.responses,
      overallScore: interview.overallScore,
      categoryScores: interview.categoryScores
    });

    interview.insights = {
      overallFeedback: insights.overallFeedback,
      topStrengths: insights.topStrengths,
      areasToImprove: insights.areasToImprove,
      recommendations: insights.recommendations,
      performanceLevel: insights.performanceLevel
    };

    await interview.save();
  } catch (error) {
    console.error('Error generating insights:', error);
  }

  // Update user analytics
  try {
    const analytics = await Analytics.getOrCreate(req.user._id);
    await analytics.updateFromInterview({
      _id: interview._id,
      overallScore: interview.overallScore,
      questionsAnswered: interview.questionsAnswered,
      questionsSkipped: interview.questionsSkipped,
      totalDurationSeconds: interview.totalDurationSeconds,
      category: interview.category
    });
  } catch (error) {
    console.error('Error updating analytics:', error);
  }

  // Create feedback record
  try {
    await Feedback.create({
      user: req.user._id,
      interview: interview._id,
      type: 'interview',
      scores: {
        overall: interview.overallScore,
        ...interview.categoryScores
      },
      summary: interview.insights?.overallFeedback,
      strengths: interview.insights?.topStrengths?.map(s => ({ area: s, description: s })),
      weaknesses: interview.insights?.areasToImprove?.map(w => ({ area: w, description: w })),
      generatedBy: 'system'
    });
  } catch (error) {
    console.error('Error creating feedback:', error);
  }

  // Emit socket event
  const io = req.app.get('io');
  if (io) {
    io.to(`interview_${interview._id}`).emit('interviewCompleted', {
      interviewId: interview._id,
      overallScore: interview.overallScore,
      completedAt: interview.completedAt
    });
  }

  res.status(200).json({
    success: true,
    message: 'Interview completed successfully.',
    data: {
      interview: {
        id: interview._id,
        overallScore: interview.overallScore,
        categoryScores: interview.categoryScores,
        insights: interview.insights,
        totalDurationSeconds: interview.totalDurationSeconds,
        questionsAnswered: interview.questionsAnswered,
        questionsSkipped: interview.questionsSkipped,
        completedAt: interview.completedAt
      }
    }
  });
}));

/**
 * @route   PUT /api/interviews/:id/abandon
 * @desc    Abandon an interview
 * @access  Private
 */
router.put('/:id/abandon', protect, validateObjectId('id'), asyncHandler(async (req, res) => {
  const interview = await Interview.findOneAndUpdate(
    {
      _id: req.params.id,
      user: req.user._id,
      status: 'in-progress'
    },
    {
      status: 'abandoned',
      completedAt: new Date()
    },
    { new: true }
  );

  if (!interview) {
    return res.status(404).json({
      success: false,
      message: 'Interview not found or not in progress.'
    });
  }

  res.status(200).json({
    success: true,
    message: 'Interview abandoned.'
  });
}));

/**
 * @route   DELETE /api/interviews/:id
 * @desc    Delete an interview
 * @access  Private
 */
router.delete('/:id', protect, validateObjectId('id'), asyncHandler(async (req, res) => {
  const interview = await Interview.findOneAndDelete({
    _id: req.params.id,
    user: req.user._id
  });

  if (!interview) {
    return res.status(404).json({
      success: false,
      message: 'Interview not found.'
    });
  }

  // Also delete associated feedback
  await Feedback.deleteMany({ interview: interview._id });

  res.status(200).json({
    success: true,
    message: 'Interview deleted successfully.'
  });
}));

/**
 * @route   GET /api/interviews/:id/report
 * @desc    Get detailed interview report
 * @access  Private
 */
router.get('/:id/report', protect, validateObjectId('id'), asyncHandler(async (req, res) => {
  const interview = await Interview.findOne({
    _id: req.params.id,
    user: req.user._id,
    status: 'completed'
  }).populate('responses.question', 'text category difficulty expectedAnswer keyPoints');

  if (!interview) {
    return res.status(404).json({
      success: false,
      message: 'Interview report not found.'
    });
  }

  // Get feedback
  const feedback = await Feedback.findOne({ interview: interview._id });

  res.status(200).json({
    success: true,
    data: {
      interview,
      feedback
    }
  });
}));

module.exports = router;
