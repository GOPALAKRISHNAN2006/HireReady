/**
 * ===========================================
 * Proctoring Routes
 * ===========================================
 * 
 * API endpoints for AI proctoring system.
 * 
 * Routes:
 * POST /api/proctoring/session/start - Start proctoring session
 * POST /api/proctoring/session/:id/violation - Log a violation
 * POST /api/proctoring/session/:id/end - End session and generate report
 * GET /api/proctoring/session/:id - Get session details
 * GET /api/proctoring/session/:id/report - Get proctoring report
 * GET /api/proctoring/alerts - Get real-time alerts (for invigilators)
 * POST /api/proctoring/alerts/:id/acknowledge - Acknowledge alert
 * GET /api/proctoring/review - Get sessions needing review (admin)
 * POST /api/proctoring/session/:id/review - Submit review decision
 */

const express = require('express');
const router = express.Router();
const { ProctoringSession, ProctoringAlert } = require('../models/Proctoring.model');
const { protect, authorize } = require('../middleware/auth.middleware');
const { asyncHandler } = require('../middleware/errorHandler');

/**
 * @route   GET /api/proctoring/my-sessions
 * @desc    Get current user's proctoring sessions
 * @access  Private
 */
router.get('/my-sessions', protect, asyncHandler(async (req, res) => {
  const { status, limit = 10 } = req.query;
  
  const query = { candidate: req.user._id };
  if (status) query.status = status;
  
  const sessions = await ProctoringSession.find(query)
    .select('sessionType startTime endTime duration riskScore riskLevel report.integrityStatus status')
    .sort({ startTime: -1 })
    .limit(parseInt(limit));
  
  res.status(200).json({
    success: true,
    count: sessions.length,
    data: { sessions }
  });
}));

/**
 * @route   POST /api/proctoring/session/clear
 * @desc    Clear all active proctoring sessions for the user
 * @access  Private
 */
router.post('/session/clear', protect, asyncHandler(async (req, res) => {
  const result = await ProctoringSession.updateMany(
    { candidate: req.user._id, status: 'active' },
    { 
      status: 'terminated', 
      endTime: new Date(),
      terminationReason: 'User cleared sessions'
    }
  );
  
  res.json({
    success: true,
    message: `Cleared ${result.modifiedCount} active session(s)`,
    data: { clearedCount: result.modifiedCount }
  });
}));

/**
 * @route   POST /api/proctoring/session/start
 * @desc    Start a new proctoring session
 * @access  Private
 */
router.post('/session/start', protect, asyncHandler(async (req, res) => {
  const { sessionType, sessionId, config, deviceInfo, forceNew } = req.body;
  
  // Check for existing active session
  const existingSession = await ProctoringSession.getActiveSession(req.user._id);
  if (existingSession) {
    // If forceNew is true, end the existing session
    if (forceNew) {
      existingSession.status = 'terminated';
      existingSession.endTime = new Date();
      existingSession.terminationReason = 'New session started';
      await existingSession.save();
    } else {
      return res.status(400).json({
        success: false,
        message: 'An active proctoring session already exists',
        data: { sessionId: existingSession._id }
      });
    }
  }
  
  // Determine session model based on type
  const sessionModelMap = {
    'interview': 'Interview',
    'aptitude': 'AptitudeAttempt',
    'group_discussion': 'GDSession'
  };
  
  const session = await ProctoringSession.create({
    sessionType,
    sessionId,
    sessionModel: sessionModelMap[sessionType],
    candidate: req.user._id,
    config: {
      cameraEnabled: config?.cameraEnabled ?? true,
      screenMonitoringEnabled: config?.screenMonitoringEnabled ?? true,
      audioMonitoringEnabled: config?.audioMonitoringEnabled ?? true,
      fullscreenRequired: config?.fullscreenRequired ?? true,
      allowedTabs: config?.allowedTabs ?? 0,
      allowedApps: config?.allowedApps ?? [],
      strictMode: config?.strictMode ?? false
    },
    deviceInfo,
    ipAddress: req.ip,
    userAgent: req.headers['user-agent']
  });
  
  res.status(201).json({
    success: true,
    message: 'Proctoring session started',
    data: {
      proctoringSessionId: session._id,
      config: session.config,
      startTime: session.startTime
    }
  });
}));

/**
 * @route   POST /api/proctoring/session/:id/violation
 * @desc    Log a violation during proctoring
 * @access  Private
 */
router.post('/session/:id/violation', protect, asyncHandler(async (req, res) => {
  const { type, severity, description, evidence } = req.body;
  
  const session = await ProctoringSession.findById(req.params.id);
  if (!session) {
    return res.status(404).json({
      success: false,
      message: 'Proctoring session not found'
    });
  }
  
  // Verify ownership
  if (session.candidate.toString() !== req.user._id.toString()) {
    return res.status(403).json({
      success: false,
      message: 'Not authorized to log violations for this session'
    });
  }
  
  // Add violation
  const violation = await session.addViolation({
    type,
    severity,
    description,
    evidence
  });
  
  // Determine action based on severity and history
  let actionTaken = 'none';
  let alertType = 'warning';
  let requiresAction = false;
  let message = '';
  
  if (severity === 'high') {
    alertType = 'critical';
    requiresAction = true;
    
    // Check for critical patterns
    const highViolations = session.stats.highViolations;
    if (highViolations >= 3 || type === 'proxy_suspected') {
      actionTaken = 'session_terminated';
      message = `CRITICAL: ${description}. Session termination recommended.`;
    } else {
      actionTaken = 'flagged_for_review';
      message = `HIGH ALERT: ${description}. Immediate review required.`;
    }
  } else if (severity === 'medium') {
    alertType = 'alert';
    actionTaken = 'warning_issued';
    message = `WARNING: ${description}. Please correct your behavior.`;
    session.stats.warningsIssued++;
    
    // Check for repeated medium violations
    if (session.stats.mediumViolations >= 5) {
      requiresAction = true;
      message = `REPEATED WARNINGS: ${description}. Review recommended.`;
    }
  } else {
    // Low severity
    message = `Notice: ${description}.`;
  }
  
  // Update violation action
  const violationIndex = session.violations.length - 1;
  session.violations[violationIndex].actionTaken = actionTaken;
  await session.save();
  
  // Create alert for invigilators (for medium and high severity)
  if (severity !== 'low') {
    await ProctoringAlert.create({
      proctoringSession: session._id,
      candidate: req.user._id,
      alertType,
      violation: session.violations[violationIndex],
      message,
      requiresAction,
      actionRequired: requiresAction ? 'Review and take action' : null
    });
  }
  
  res.status(200).json({
    success: true,
    data: {
      violation: session.violations[violationIndex],
      riskScore: session.riskScore,
      riskLevel: session.riskLevel,
      actionTaken,
      warningMessage: severity !== 'low' ? message : null,
      stats: session.stats
    }
  });
}));

/**
 * @route   POST /api/proctoring/session/:id/end
 * @desc    End proctoring session and generate report
 * @access  Private
 */
router.post('/session/:id/end', protect, asyncHandler(async (req, res) => {
  const session = await ProctoringSession.findById(req.params.id);
  
  if (!session) {
    return res.status(404).json({
      success: false,
      message: 'Proctoring session not found'
    });
  }
  
  // Verify ownership or admin
  if (session.candidate.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Not authorized'
    });
  }
  
  // Generate report
  const report = session.generateReport();
  await session.save();
  
  res.status(200).json({
    success: true,
    message: 'Proctoring session ended',
    data: {
      sessionId: session._id,
      duration: session.duration,
      report,
      stats: session.stats,
      riskScore: session.riskScore,
      riskLevel: session.riskLevel
    }
  });
}));

/**
 * @route   GET /api/proctoring/session/:id
 * @desc    Get proctoring session details
 * @access  Private
 */
router.get('/session/:id', protect, asyncHandler(async (req, res) => {
  const session = await ProctoringSession.findById(req.params.id)
    .populate('candidate', 'firstName lastName email avatar');
  
  if (!session) {
    return res.status(404).json({
      success: false,
      message: 'Proctoring session not found'
    });
  }
  
  // Check authorization
  if (session.candidate._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Not authorized to view this session'
    });
  }
  
  res.status(200).json({
    success: true,
    data: { session }
  });
}));

/**
 * @route   GET /api/proctoring/session/:id/report
 * @desc    Get proctoring report for a session
 * @access  Private
 */
router.get('/session/:id/report', protect, asyncHandler(async (req, res) => {
  const session = await ProctoringSession.findById(req.params.id)
    .populate('candidate', 'firstName lastName email avatar');
  
  if (!session) {
    return res.status(404).json({
      success: false,
      message: 'Proctoring session not found'
    });
  }
  
  // Check authorization
  if (session.candidate._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Not authorized'
    });
  }
  
  // Generate report if not already generated
  if (!session.report.generated) {
    session.generateReport();
    await session.save();
  }
  
  // Organize violations by category
  const violationsByCategory = {
    camera: session.violations.filter(v => v.category === 'camera'),
    screen: session.violations.filter(v => v.category === 'screen'),
    audio: session.violations.filter(v => v.category === 'audio'),
    activity: session.violations.filter(v => v.category === 'activity')
  };
  
  res.status(200).json({
    success: true,
    data: {
      candidate: session.candidate,
      sessionType: session.sessionType,
      startTime: session.startTime,
      endTime: session.endTime,
      duration: session.duration,
      report: session.report,
      stats: session.stats,
      riskScore: session.riskScore,
      riskLevel: session.riskLevel,
      violationsByCategory,
      violations: session.violations.sort((a, b) => b.timestamp - a.timestamp)
    }
  });
}));

/**
 * @route   GET /api/proctoring/alerts
 * @desc    Get real-time alerts (for invigilators/admins)
 * @access  Private/Admin
 */
router.get('/alerts', protect, authorize('admin', 'proctor'), asyncHandler(async (req, res) => {
  const { acknowledged, requiresAction, limit = 50 } = req.query;
  
  const query = {};
  if (acknowledged !== undefined) query.acknowledged = acknowledged === 'true';
  if (requiresAction !== undefined) query.requiresAction = requiresAction === 'true';
  
  const alerts = await ProctoringAlert.find(query)
    .populate('candidate', 'firstName lastName email avatar')
    .populate('proctoringSession', 'sessionType riskScore riskLevel')
    .sort({ createdAt: -1 })
    .limit(parseInt(limit));
  
  res.status(200).json({
    success: true,
    count: alerts.length,
    data: { alerts }
  });
}));

/**
 * @route   POST /api/proctoring/alerts/:id/acknowledge
 * @desc    Acknowledge an alert
 * @access  Private/Admin
 */
router.post('/alerts/:id/acknowledge', protect, authorize('admin', 'proctor'), asyncHandler(async (req, res) => {
  const alert = await ProctoringAlert.findById(req.params.id);
  
  if (!alert) {
    return res.status(404).json({
      success: false,
      message: 'Alert not found'
    });
  }
  
  alert.acknowledged = true;
  alert.acknowledgedBy = req.user._id;
  alert.acknowledgedAt = new Date();
  await alert.save();
  
  res.status(200).json({
    success: true,
    message: 'Alert acknowledged',
    data: { alert }
  });
}));

/**
 * @route   GET /api/proctoring/review
 * @desc    Get sessions needing review (admin)
 * @access  Private/Admin
 */
router.get('/review', protect, authorize('admin', 'proctor'), asyncHandler(async (req, res) => {
  const sessions = await ProctoringSession.getSessionsForReview();
  
  res.status(200).json({
    success: true,
    count: sessions.length,
    data: { sessions }
  });
}));

/**
 * @route   POST /api/proctoring/session/:id/review
 * @desc    Submit review decision for a session
 * @access  Private/Admin
 */
router.post('/session/:id/review', protect, authorize('admin', 'proctor'), asyncHandler(async (req, res) => {
  const { decision, notes } = req.body;
  
  const session = await ProctoringSession.findById(req.params.id);
  
  if (!session) {
    return res.status(404).json({
      success: false,
      message: 'Session not found'
    });
  }
  
  session.report.reviewedBy = req.user._id;
  session.report.reviewedAt = new Date();
  session.report.reviewDecision = decision;
  session.status = 'under_review';
  
  if (notes) {
    session.report.recommendations.push(`Review note: ${notes}`);
  }
  
  // If invalidated, mark session
  if (decision === 'invalidated') {
    session.status = 'terminated';
  }
  
  await session.save();
  
  res.status(200).json({
    success: true,
    message: 'Review submitted',
    data: { session }
  });
}));

/**
 * @route   POST /api/proctoring/session/:id/face-enrollment
 * @desc    Enroll candidate's face for matching
 * @access  Private
 */
router.post('/session/:id/face-enrollment', protect, asyncHandler(async (req, res) => {
  const { faceDescriptor, enrollmentPhoto } = req.body;
  
  const session = await ProctoringSession.findById(req.params.id);
  
  if (!session) {
    return res.status(404).json({
      success: false,
      message: 'Session not found'
    });
  }
  
  if (session.candidate.toString() !== req.user._id.toString()) {
    return res.status(403).json({
      success: false,
      message: 'Not authorized'
    });
  }
  
  session.enrolledFaceData = {
    faceDescriptor,
    enrollmentPhoto,
    enrolledAt: new Date()
  };
  await session.save();
  
  res.status(200).json({
    success: true,
    message: 'Face enrolled successfully',
    data: { enrolledAt: session.enrolledFaceData.enrolledAt }
  });
}));

module.exports = router;
