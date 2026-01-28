/**
 * ===========================================
 * Proctoring Model
 * ===========================================
 * 
 * Manages proctoring sessions, violations, and risk scoring
 * for mock interviews, aptitude tests, and group discussions.
 * 
 * Features:
 * - Session-based proctoring tracking
 * - Violation logging with timestamps
 * - Risk score calculation
 * - Report generation
 */

const mongoose = require('mongoose');

// Violation Schema - Individual suspicious events
const ViolationSchema = new mongoose.Schema({
  timestamp: {
    type: Date,
    default: Date.now,
    required: true
  },
  type: {
    type: String,
    enum: [
      // Camera-based violations
      'multiple_faces',
      'no_face_detected',
      'face_mismatch',
      'suspicious_gaze',
      'head_movement',
      'posture_shift',
      'mouth_movement',
      'background_person',
      'proxy_suspected',
      
      // Screen-based violations
      'fullscreen_exit',
      'tab_switch',
      'restricted_app',
      'restricted_website',
      'copy_paste',
      'screen_share_detected',
      'remote_desktop',
      'virtual_machine',
      'overlay_detected',
      'secondary_device',
      
      // Audio-based violations
      'background_voice',
      'coaching_detected',
      'voice_mismatch',
      'scripted_reading',
      'answer_playback',
      
      // Activity-specific violations
      'phone_detected',
      'external_material',
      'muted_with_movement',
      'unexplained_silence',
      'speaker_mismatch'
    ],
    required: true
  },
  category: {
    type: String,
    enum: ['camera', 'screen', 'audio', 'activity'],
    required: true
  },
  severity: {
    type: String,
    enum: ['low', 'medium', 'high'],
    required: true
  },
  description: {
    type: String,
    required: true
  },
  evidence: {
    screenshot: String,       // Base64 or URL
    videoClip: String,        // URL to recorded clip
    audioClip: String,        // URL to audio clip
    metadata: mongoose.Schema.Types.Mixed  // Additional context data
  },
  actionTaken: {
    type: String,
    enum: ['none', 'warning_issued', 'session_paused', 'session_terminated', 'flagged_for_review'],
    default: 'none'
  },
  acknowledged: {
    type: Boolean,
    default: false
  },
  falsePositive: {
    type: Boolean,
    default: false
  },
  reviewNotes: String
});

// Proctoring Session Schema
const ProctoringSessionSchema = new mongoose.Schema({
  // Reference to the actual session
  sessionType: {
    type: String,
    enum: ['interview', 'aptitude', 'group_discussion'],
    required: true
  },
  sessionId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    refPath: 'sessionModel'
  },
  sessionModel: {
    type: String,
    enum: ['Interview', 'AptitudeAttempt', 'GDSession'],
    required: true
  },
  
  // Candidate information
  candidate: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  enrolledFaceData: {
    faceDescriptor: [Number],  // Face encoding for matching
    enrollmentPhoto: String,   // Reference photo URL
    enrolledAt: Date
  },
  
  // Session timing
  startTime: {
    type: Date,
    default: Date.now
  },
  endTime: Date,
  duration: Number,  // In seconds
  
  // Violations and risk
  violations: [ViolationSchema],
  
  riskScore: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  riskLevel: {
    type: String,
    enum: ['clean', 'low', 'medium', 'high', 'critical'],
    default: 'clean'
  },
  
  // Session status
  status: {
    type: String,
    enum: ['active', 'paused', 'completed', 'terminated', 'under_review'],
    default: 'active'
  },
  
  // Monitoring configuration
  config: {
    cameraEnabled: { type: Boolean, default: true },
    screenMonitoringEnabled: { type: Boolean, default: true },
    audioMonitoringEnabled: { type: Boolean, default: true },
    fullscreenRequired: { type: Boolean, default: true },
    allowedTabs: { type: Number, default: 0 },
    allowedApps: [String],
    strictMode: { type: Boolean, default: false }
  },
  
  // Statistics
  stats: {
    totalViolations: { type: Number, default: 0 },
    lowViolations: { type: Number, default: 0 },
    mediumViolations: { type: Number, default: 0 },
    highViolations: { type: Number, default: 0 },
    warningsIssued: { type: Number, default: 0 },
    faceDetectionRate: { type: Number, default: 100 },
    avgConfidenceScore: { type: Number, default: 100 },
    tabSwitchCount: { type: Number, default: 0 },
    fullscreenExitCount: { type: Number, default: 0 }
  },
  
  // Final report
  report: {
    generated: { type: Boolean, default: false },
    generatedAt: Date,
    integrityStatus: {
      type: String,
      enum: ['clean', 'review_recommended', 'high_suspicion'],
      default: 'clean'
    },
    summary: String,
    recommendations: [String],
    reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    reviewedAt: Date,
    reviewDecision: {
      type: String,
      enum: ['approved', 'flagged', 'invalidated', 'pending'],
      default: 'pending'
    }
  },
  
  // Metadata
  deviceInfo: {
    browser: String,
    os: String,
    screenResolution: String,
    cameraDevice: String,
    microphoneDevice: String
  },
  ipAddress: String,
  userAgent: String
  
}, { timestamps: true });

// Indexes for efficient querying
ProctoringSessionSchema.index({ candidate: 1, sessionType: 1 });
ProctoringSessionSchema.index({ sessionId: 1 });
ProctoringSessionSchema.index({ status: 1 });
ProctoringSessionSchema.index({ riskLevel: 1 });
ProctoringSessionSchema.index({ 'report.integrityStatus': 1 });

// Calculate risk score based on violations
ProctoringSessionSchema.methods.calculateRiskScore = function() {
  let score = 0;
  const weights = {
    low: 5,
    medium: 15,
    high: 30
  };
  
  this.violations.forEach(violation => {
    if (!violation.falsePositive) {
      score += weights[violation.severity] || 0;
    }
  });
  
  // Cap at 100
  this.riskScore = Math.min(score, 100);
  
  // Determine risk level
  if (this.riskScore === 0) this.riskLevel = 'clean';
  else if (this.riskScore <= 15) this.riskLevel = 'low';
  else if (this.riskScore <= 40) this.riskLevel = 'medium';
  else if (this.riskScore <= 70) this.riskLevel = 'high';
  else this.riskLevel = 'critical';
  
  return this.riskScore;
};

// Add a violation
ProctoringSessionSchema.methods.addViolation = async function(violationData) {
  // Determine category based on type
  const categoryMap = {
    'multiple_faces': 'camera',
    'no_face_detected': 'camera',
    'face_mismatch': 'camera',
    'suspicious_gaze': 'camera',
    'head_movement': 'camera',
    'posture_shift': 'camera',
    'mouth_movement': 'camera',
    'background_person': 'camera',
    'proxy_suspected': 'camera',
    'fullscreen_exit': 'screen',
    'tab_switch': 'screen',
    'restricted_app': 'screen',
    'restricted_website': 'screen',
    'copy_paste': 'screen',
    'screen_share_detected': 'screen',
    'remote_desktop': 'screen',
    'virtual_machine': 'screen',
    'overlay_detected': 'screen',
    'secondary_device': 'screen',
    'background_voice': 'audio',
    'coaching_detected': 'audio',
    'voice_mismatch': 'audio',
    'scripted_reading': 'audio',
    'answer_playback': 'audio',
    'phone_detected': 'activity',
    'external_material': 'activity',
    'muted_with_movement': 'activity',
    'unexplained_silence': 'activity',
    'speaker_mismatch': 'activity'
  };
  
  const violation = {
    ...violationData,
    category: categoryMap[violationData.type] || 'activity',
    timestamp: new Date()
  };
  
  this.violations.push(violation);
  
  // Update stats
  this.stats.totalViolations++;
  if (violation.severity === 'low') this.stats.lowViolations++;
  else if (violation.severity === 'medium') this.stats.mediumViolations++;
  else if (violation.severity === 'high') this.stats.highViolations++;
  
  // Update specific counters
  if (violation.type === 'tab_switch') this.stats.tabSwitchCount++;
  if (violation.type === 'fullscreen_exit') this.stats.fullscreenExitCount++;
  
  // Recalculate risk score
  this.calculateRiskScore();
  
  await this.save();
  return violation;
};

// Generate proctoring report
ProctoringSessionSchema.methods.generateReport = function() {
  const violationsByCategory = {
    camera: this.violations.filter(v => v.category === 'camera' && !v.falsePositive),
    screen: this.violations.filter(v => v.category === 'screen' && !v.falsePositive),
    audio: this.violations.filter(v => v.category === 'audio' && !v.falsePositive),
    activity: this.violations.filter(v => v.category === 'activity' && !v.falsePositive)
  };
  
  // Determine integrity status
  let integrityStatus = 'clean';
  if (this.riskScore > 40 || this.stats.highViolations > 0) {
    integrityStatus = 'high_suspicion';
  } else if (this.riskScore > 15 || this.stats.mediumViolations > 2) {
    integrityStatus = 'review_recommended';
  }
  
  // Generate recommendations
  const recommendations = [];
  if (this.stats.highViolations > 0) {
    recommendations.push('Manual review required due to high-severity violations');
  }
  if (this.stats.tabSwitchCount > 3) {
    recommendations.push('Multiple tab switches detected - verify no external resources used');
  }
  if (violationsByCategory.camera.length > 5) {
    recommendations.push('Frequent camera violations - verify candidate identity');
  }
  if (violationsByCategory.audio.some(v => v.type === 'coaching_detected')) {
    recommendations.push('Potential coaching detected - review audio recordings');
  }
  
  // Generate summary
  const summary = `Proctoring session completed with ${this.stats.totalViolations} total violations ` +
    `(${this.stats.highViolations} high, ${this.stats.mediumViolations} medium, ${this.stats.lowViolations} low). ` +
    `Risk score: ${this.riskScore}/100. Status: ${integrityStatus.replace('_', ' ')}.`;
  
  this.report = {
    generated: true,
    generatedAt: new Date(),
    integrityStatus,
    summary,
    recommendations,
    reviewDecision: 'pending'
  };
  
  this.endTime = new Date();
  this.duration = Math.floor((this.endTime - this.startTime) / 1000);
  this.status = 'completed';
  
  return this.report;
};

// Static method to get active session for a candidate
ProctoringSessionSchema.statics.getActiveSession = function(candidateId) {
  return this.findOne({
    candidate: candidateId,
    status: 'active'
  }).sort({ startTime: -1 });
};

// Static method to get sessions requiring review
ProctoringSessionSchema.statics.getSessionsForReview = function() {
  return this.find({
    status: 'completed',
    'report.reviewDecision': 'pending',
    $or: [
      { 'report.integrityStatus': 'review_recommended' },
      { 'report.integrityStatus': 'high_suspicion' }
    ]
  }).populate('candidate', 'firstName lastName email');
};

// Proctoring Alert Schema - Real-time alerts for invigilators
const ProctoringAlertSchema = new mongoose.Schema({
  proctoringSession: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ProctoringSession',
    required: true
  },
  candidate: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  alertType: {
    type: String,
    enum: ['warning', 'alert', 'critical'],
    required: true
  },
  violation: ViolationSchema,
  message: {
    type: String,
    required: true
  },
  requiresAction: {
    type: Boolean,
    default: false
  },
  actionRequired: String,
  acknowledged: {
    type: Boolean,
    default: false
  },
  acknowledgedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  acknowledgedAt: Date
}, { timestamps: true });

ProctoringAlertSchema.index({ proctoringSession: 1 });
ProctoringAlertSchema.index({ acknowledged: 1, requiresAction: 1 });

const ProctoringSession = mongoose.model('ProctoringSession', ProctoringSessionSchema);
const ProctoringAlert = mongoose.model('ProctoringAlert', ProctoringAlertSchema);

module.exports = { ProctoringSession, ProctoringAlert };
