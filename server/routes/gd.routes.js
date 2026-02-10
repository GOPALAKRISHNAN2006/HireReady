/**
 * Group Discussion Routes
 */

const express = require('express');
const router = express.Router();
const { GDTopic, GDSession } = require('../models/GroupDiscussion.model');
const { protect, authorize } = require('../middleware/auth.middleware');
const { asyncHandler } = require('../middleware/errorHandler');
const AIService = require('../services/ai.service');

// AI participant personalities
const AI_PERSONALITIES = [
  { name: 'Priya', personality: 'analytical', style: 'Data-driven and logical' },
  { name: 'Rahul', personality: 'creative', style: 'Creative and innovative thinker' },
  { name: 'Ananya', personality: 'diplomatic', style: 'Balanced and considers all viewpoints' },
  { name: 'Vikram', personality: 'assertive', style: 'Direct and confident speaker' },
  { name: 'Sneha', personality: 'supportive', style: 'Builds on others ideas' }
];

// Get all GD topics
router.get('/topics', protect, asyncHandler(async (req, res) => {
  const { category, difficulty } = req.query;
  
  const query = { isActive: true };
  if (category) query.category = category;
  if (difficulty) query.difficulty = difficulty;

  const topics = await GDTopic.find(query)
    .sort({ createdAt: -1 })
    .lean();

  res.json({
    success: true,
    data: topics
  });
}));

// Get topic categories
router.get('/categories', protect, asyncHandler(async (req, res) => {
  const categories = [
    { id: 'current-affairs', name: 'Current Affairs', description: 'News and trending topics' },
    { id: 'social-issues', name: 'Social Issues', description: 'Society and community topics' },
    { id: 'technology', name: 'Technology', description: 'Tech trends and innovations' },
    { id: 'business', name: 'Business', description: 'Business and economics' },
    { id: 'abstract', name: 'Abstract', description: 'Creative and philosophical topics' },
    { id: 'case-study', name: 'Case Study', description: 'Business scenarios' }
  ];

  res.json({
    success: true,
    data: categories
  });
}));

// Get single topic
router.get('/topics/:id', protect, asyncHandler(async (req, res) => {
  const topic = await GDTopic.findById(req.params.id);

  if (!topic) {
    return res.status(404).json({
      success: false,
      message: 'Topic not found'
    });
  }

  res.json({
    success: true,
    data: topic
  });
}));

// Start GD session
router.post('/sessions/start', protect, asyncHandler(async (req, res) => {
  const { topicId, mode = 'ai-participants', duration = 15 } = req.body;

  const topic = await GDTopic.findById(topicId);
  if (!topic) {
    return res.status(404).json({
      success: false,
      message: 'Topic not found'
    });
  }

  // Select random AI participants
  const aiParticipants = AI_PERSONALITIES
    .sort(() => Math.random() - 0.5)
    .slice(0, 4)
    .map(p => ({
      name: p.name,
      personality: p.personality,
      contributions: []
    }));

  const session = await GDSession.create({
    user: req.user._id,
    topic: topicId,
    topicTitle: topic.title,
    mode,
    duration,
    aiParticipants,
    status: 'in-progress',
    startedAt: new Date()
  });

  res.status(201).json({
    success: true,
    message: 'GD Session started',
    data: {
      sessionId: session._id,
      topic: {
        title: topic.title,
        description: topic.description,
        keyPoints: topic.keyPoints
      },
      aiParticipants: session.aiParticipants.map(p => ({
        name: p.name,
        personality: p.personality
      })),
      duration: session.duration
    }
  });
}));

// Add user contribution
router.post('/sessions/:sessionId/contribute', protect, asyncHandler(async (req, res) => {
  const { content } = req.body;

  const session = await GDSession.findOne({
    _id: req.params.sessionId,
    user: req.user._id,
    status: 'in-progress'
  });

  if (!session) {
    return res.status(404).json({
      success: false,
      message: 'Session not found or already completed'
    });
  }

  // Simple scoring (in production, use AI)
  const words = content.split(' ').length;
  const aiScore = Math.min(100, Math.max(20, words * 3 + Math.random() * 30));

  session.userContributions.push({
    content,
    timestamp: new Date(),
    relevance: Math.round(aiScore),
    aiScore: Math.round(aiScore)
  });

  // Generate AI response
  const respondingAI = session.aiParticipants[
    Math.floor(Math.random() * session.aiParticipants.length)
  ];

  let aiResponseText;
  try {
    const gdTopic = session.topic?.title || 'the current topic';
    const aiPrompt = `You are ${respondingAI.name}, a ${respondingAI.personality || 'thoughtful'} participant in a group discussion about "${gdTopic}". 
Another participant just said: "${content}"
Respond naturally in 1-2 sentences as a GD participant. Be ${respondingAI.style || 'balanced and insightful'}. Either build on their point, add a new perspective, or respectfully disagree.`;
    
    aiResponseText = await AIService.chat({ message: aiPrompt, conversationHistory: [] });
    // Keep response concise
    if (aiResponseText && aiResponseText.length > 300) {
      aiResponseText = aiResponseText.substring(0, 297) + '...';
    }
  } catch {
    const fallbackResponses = [
      `That's an interesting point. Building on that, I think we should also consider the broader implications and how this affects different stakeholders.`,
      `I agree with some aspects, but we should also look at the other side. There are valid counterarguments worth discussing.`,
      `While that's valid, research suggests a more nuanced perspective. Let me share what I've observed.`,
      `Great observation! Additionally, we could explore how this connects to real-world applications and current trends.`,
      `I'd like to add a different viewpoint here. Consider the long-term consequences of this approach.`
    ];
    aiResponseText = fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
  }

  const aiResponse = {
    content: aiResponseText,
    timestamp: new Date()
  };

  respondingAI.contributions.push(aiResponse);

  await session.save();

  res.json({
    success: true,
    data: {
      userScore: Math.round(aiScore),
      aiResponse: {
        participant: respondingAI.name,
        content: aiResponse.content
      }
    }
  });
}));

// Complete GD session
router.post('/sessions/:sessionId/complete', protect, asyncHandler(async (req, res) => {
  const session = await GDSession.findOne({
    _id: req.params.sessionId,
    user: req.user._id
  });

  if (!session) {
    return res.status(404).json({
      success: false,
      message: 'Session not found'
    });
  }

  // Calculate feedback
  const contributions = session.userContributions;
  const avgScore = contributions.length > 0
    ? contributions.reduce((sum, c) => sum + c.aiScore, 0) / contributions.length
    : 0;

  session.status = 'completed';
  session.completedAt = new Date();
  session.feedback = {
    overallScore: Math.round(avgScore),
    communication: Math.round(avgScore * (0.8 + Math.random() * 0.4)),
    content: Math.round(avgScore * (0.8 + Math.random() * 0.4)),
    leadership: Math.round(avgScore * (0.7 + Math.random() * 0.5)),
    teamwork: Math.round(avgScore * (0.8 + Math.random() * 0.4)),
    reasoning: Math.round(avgScore * (0.8 + Math.random() * 0.4)),
    strengths: [
      'Good articulation of points',
      'Engaged actively in discussion',
      'Showed awareness of topic'
    ],
    improvements: [
      'Could provide more examples',
      'Try to build on others points more',
      'Include data to support arguments'
    ],
    summary: `You made ${contributions.length} contributions during this discussion. Your overall performance was ${avgScore >= 70 ? 'good' : avgScore >= 50 ? 'satisfactory' : 'needs improvement'}.`
  };

  await session.save();

  res.json({
    success: true,
    message: 'GD Session completed',
    data: session.feedback
  });
}));

// Get session history
router.get('/sessions/history', protect, asyncHandler(async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const skip = (page - 1) * limit;

  const [sessions, total] = await Promise.all([
    GDSession.find({ user: req.user._id, status: 'completed' })
      .sort({ completedAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .select('topicTitle feedback.overallScore completedAt duration')
      .lean(),
    GDSession.countDocuments({ user: req.user._id, status: 'completed' })
  ]);

  res.json({
    success: true,
    data: {
      sessions,
      pagination: { page: parseInt(page), limit: parseInt(limit), total, pages: Math.ceil(total / limit) }
    }
  });
}));

// Get single session
router.get('/sessions/:sessionId', protect, asyncHandler(async (req, res) => {
  const session = await GDSession.findOne({
    _id: req.params.sessionId,
    user: req.user._id
  }).populate('topic');

  if (!session) {
    return res.status(404).json({
      success: false,
      message: 'Session not found'
    });
  }

  res.json({
    success: true,
    data: session
  });
}));

// Get session result
router.get('/sessions/:sessionId/result', protect, asyncHandler(async (req, res) => {
  const session = await GDSession.findOne({
    _id: req.params.sessionId,
    user: req.user._id
  }).populate('topic');

  if (!session) {
    return res.status(404).json({
      success: false,
      message: 'Session not found'
    });
  }

  if (session.status !== 'completed') {
    return res.status(400).json({
      success: false,
      message: 'Session not completed yet'
    });
  }

  // Format result data
  const result = {
    topic: {
      title: session.topicTitle || session.topic?.title,
      description: session.topic?.description
    },
    overallScore: session.feedback?.overallScore || 0,
    feedback: {
      content: session.feedback?.content || 70,
      clarity: session.feedback?.communication || 70,
      relevance: session.feedback?.reasoning || 70,
      engagement: session.feedback?.teamwork || 70,
      leadership: session.feedback?.leadership || 60
    },
    contributions: session.userContributions?.map(c => ({
      content: c.content,
      score: c.aiScore || c.relevance || 70
    })) || [],
    strengths: session.feedback?.strengths || [],
    improvements: session.feedback?.improvements || [],
    duration: session.duration,
    completedAt: session.completedAt
  };

  res.json({
    success: true,
    data: result
  });
}));

// Admin: Add topic
router.post('/topics', protect, authorize('admin'), asyncHandler(async (req, res) => {
  const topic = await GDTopic.create(req.body);

  res.status(201).json({
    success: true,
    message: 'Topic added successfully',
    data: topic
  });
}));

// Admin: Update topic
router.put('/topics/:id', protect, authorize('admin'), asyncHandler(async (req, res) => {
  const topic = await GDTopic.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  );

  if (!topic) {
    return res.status(404).json({
      success: false,
      message: 'Topic not found'
    });
  }

  res.json({
    success: true,
    message: 'Topic updated successfully',
    data: topic
  });
}));

module.exports = router;
