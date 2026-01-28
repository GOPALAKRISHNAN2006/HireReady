/**
 * ===========================================
 * Communication Assessment Routes
 * ===========================================
 * 
 * API endpoints for communication skills assessment.
 */

const express = require('express');
const router = express.Router();
const CommunicationAssessmentService = require('../services/communication.service');
const { protect } = require('../middleware/auth.middleware');

/**
 * @route   POST /api/communication/assess
 * @desc    Submit a transcript for communication assessment
 * @access  Private
 */
router.post('/assess', protect, async (req, res) => {
  try {
    const {
      questionId,
      questionText,
      transcript,
      audioFeatures,
      interviewId,
      assessmentType
    } = req.body;

    // Validation
    if (!questionId || !questionText || !transcript) {
      return res.status(400).json({
        success: false,
        message: 'Question ID, question text, and transcript are required'
      });
    }

    if (transcript.length < 10) {
      return res.status(400).json({
        success: false,
        message: 'Transcript is too short for meaningful assessment'
      });
    }

    const result = await CommunicationAssessmentService.analyzeTranscript({
      userId: req.user.id,
      interviewId,
      questionId,
      questionText,
      transcript,
      audioFeatures,
      assessmentType
    });

    res.json({
      success: true,
      data: result
    });

  } catch (error) {
    console.error('Communication assessment error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to perform communication assessment',
      error: error.message
    });
  }
});

/**
 * @route   POST /api/communication/batch-assess
 * @desc    Submit multiple transcripts for batch assessment (e.g., entire interview)
 * @access  Private
 */
router.post('/batch-assess', protect, async (req, res) => {
  try {
    const { responses, interviewId, assessmentType } = req.body;

    if (!responses || !Array.isArray(responses) || responses.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Responses array is required'
      });
    }

    const results = [];
    let totalScore = 0;
    const aggregatedSubscores = {
      fluency: 0,
      clarity_structure: 0,
      grammar_vocabulary: 0,
      pronunciation: 0,
      tone_confidence: 0,
      question_relevance: 0
    };

    // Process each response
    for (const response of responses) {
      if (!response.transcript || response.transcript.length < 10) {
        continue; // Skip empty or too short responses
      }

      try {
        const result = await CommunicationAssessmentService.analyzeTranscript({
          userId: req.user.id,
          interviewId,
          questionId: response.questionId,
          questionText: response.questionText,
          transcript: response.transcript,
          audioFeatures: response.audioFeatures,
          assessmentType
        });

        results.push(result);
        totalScore += result.overall_score;
        
        Object.keys(aggregatedSubscores).forEach(key => {
          aggregatedSubscores[key] += result.subscores[key];
        });
      } catch (err) {
        console.error(`Error assessing response ${response.questionId}:`, err);
      }
    }

    // Calculate averages
    const count = results.length;
    const averageScore = count > 0 ? Math.round((totalScore / count) * 10) / 10 : 0;
    
    Object.keys(aggregatedSubscores).forEach(key => {
      aggregatedSubscores[key] = count > 0 
        ? Math.round((aggregatedSubscores[key] / count) * 10) / 10 
        : 0;
    });

    // Aggregate strengths and improvements
    const allStrengths = results.flatMap(r => r.strengths);
    const allImprovements = results.flatMap(r => r.improvements);
    
    // Get unique and most common feedback
    const strengthCounts = {};
    const improvementCounts = {};
    
    allStrengths.forEach(s => {
      strengthCounts[s] = (strengthCounts[s] || 0) + 1;
    });
    
    allImprovements.forEach(i => {
      improvementCounts[i] = (improvementCounts[i] || 0) + 1;
    });

    const topStrengths = Object.entries(strengthCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([strength]) => strength);

    const topImprovements = Object.entries(improvementCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([improvement]) => improvement);

    res.json({
      success: true,
      data: {
        individualAssessments: results,
        summary: {
          averageScore,
          averageSubscores: aggregatedSubscores,
          totalResponses: count,
          topStrengths,
          topImprovements,
          overallFeedback: generateOverallFeedback(averageScore, aggregatedSubscores)
        }
      }
    });

  } catch (error) {
    console.error('Batch assessment error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to perform batch assessment',
      error: error.message
    });
  }
});

/**
 * @route   GET /api/communication/assessment/:id
 * @desc    Get a specific assessment by ID
 * @access  Private
 */
router.get('/assessment/:id', protect, async (req, res) => {
  try {
    const assessment = await CommunicationAssessmentService.getAssessmentById(req.params.id);

    if (!assessment) {
      return res.status(404).json({
        success: false,
        message: 'Assessment not found'
      });
    }

    // Ensure user owns this assessment
    if (assessment.user._id.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    res.json({
      success: true,
      data: assessment.getFormattedResult()
    });

  } catch (error) {
    console.error('Get assessment error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch assessment',
      error: error.message
    });
  }
});

/**
 * @route   GET /api/communication/history
 * @desc    Get user's assessment history
 * @access  Private
 */
router.get('/history', protect, async (req, res) => {
  try {
    const { limit = 20, skip = 0, type } = req.query;

    const assessments = await CommunicationAssessmentService.getUserAssessments(
      req.user.id,
      { 
        limit: parseInt(limit), 
        skip: parseInt(skip),
        assessmentType: type 
      }
    );

    res.json({
      success: true,
      data: assessments.map(a => a.getFormattedResult()),
      pagination: {
        limit: parseInt(limit),
        skip: parseInt(skip)
      }
    });

  } catch (error) {
    console.error('Get history error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch assessment history',
      error: error.message
    });
  }
});

/**
 * @route   GET /api/communication/stats
 * @desc    Get user's communication stats and averages
 * @access  Private
 */
router.get('/stats', protect, async (req, res) => {
  try {
    const averages = await CommunicationAssessmentService.getUserAverages(req.user.id);
    const trends = await CommunicationAssessmentService.getImprovementTrends(req.user.id, 30);

    if (!averages) {
      return res.json({
        success: true,
        data: {
          hasData: false,
          message: 'No assessments found. Complete an interview to see your communication stats.'
        }
      });
    }

    // Determine overall level
    let level = 'needs_improvement';
    if (averages.overall >= 9) level = 'excellent';
    else if (averages.overall >= 7) level = 'strong';
    else if (averages.overall >= 4) level = 'average';

    // Find strongest and weakest areas
    const subscoreEntries = Object.entries(averages)
      .filter(([key]) => key !== 'overall' && key !== 'totalAssessments');
    
    subscoreEntries.sort((a, b) => b[1] - a[1]);
    const strongest = subscoreEntries[0];
    const weakest = subscoreEntries[subscoreEntries.length - 1];

    res.json({
      success: true,
      data: {
        hasData: true,
        averages,
        level,
        totalAssessments: averages.totalAssessments,
        strongestArea: {
          name: formatSubscoreName(strongest[0]),
          score: strongest[1]
        },
        weakestArea: {
          name: formatSubscoreName(weakest[0]),
          score: weakest[1]
        },
        trends
      }
    });

  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch communication stats',
      error: error.message
    });
  }
});

/**
 * @route   GET /api/communication/interview/:interviewId
 * @desc    Get all assessments for a specific interview
 * @access  Private
 */
router.get('/interview/:interviewId', protect, async (req, res) => {
  try {
    const CommunicationAssessment = require('../models/CommunicationAssessment.model');
    
    const assessments = await CommunicationAssessment.find({
      interview: req.params.interviewId,
      user: req.user.id,
      status: 'completed'
    }).sort({ createdAt: 1 });

    if (assessments.length === 0) {
      return res.json({
        success: true,
        data: {
          hasAssessments: false,
          message: 'No communication assessments found for this interview'
        }
      });
    }

    // Calculate aggregated scores
    let totalScore = 0;
    const aggregatedSubscores = {
      fluency: 0,
      clarity_structure: 0,
      grammar_vocabulary: 0,
      pronunciation: 0,
      tone_confidence: 0
    };

    assessments.forEach(a => {
      totalScore += a.overallScore;
      Object.keys(aggregatedSubscores).forEach(key => {
        aggregatedSubscores[key] += a.subscores[key];
      });
    });

    const count = assessments.length;
    const averageScore = Math.round((totalScore / count) * 10) / 10;
    
    Object.keys(aggregatedSubscores).forEach(key => {
      aggregatedSubscores[key] = Math.round((aggregatedSubscores[key] / count) * 10) / 10;
    });

    res.json({
      success: true,
      data: {
        hasAssessments: true,
        assessments: assessments.map(a => a.getFormattedResult()),
        summary: {
          averageScore,
          averageSubscores: aggregatedSubscores,
          totalQuestions: count
        }
      }
    });

  } catch (error) {
    console.error('Get interview assessments error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch interview assessments',
      error: error.message
    });
  }
});

// Helper function to format subscore names
function formatSubscoreName(key) {
  const names = {
    fluency: 'Fluency & Pacing',
    clarity_structure: 'Clarity & Structure',
    grammar_vocabulary: 'Grammar & Vocabulary',
    pronunciation: 'Pronunciation',
    tone_confidence: 'Tone & Confidence'
  };
  return names[key] || key;
}

// Helper function to generate overall feedback
function generateOverallFeedback(score, subscores) {
  let feedback = '';
  
  if (score >= 8) {
    feedback = 'Outstanding communication skills demonstrated across all responses. ';
  } else if (score >= 6) {
    feedback = 'Good communication skills with clear areas of strength. ';
  } else if (score >= 4) {
    feedback = 'Average communication with notable areas for improvement. ';
  } else {
    feedback = 'Communication skills need significant development. ';
  }

  // Find the weakest area
  const weakest = Object.entries(subscores)
    .sort((a, b) => a[1] - b[1])[0];
  
  feedback += `Focus on improving ${formatSubscoreName(weakest[0])} for the best results.`;

  return feedback;
}

module.exports = router;
