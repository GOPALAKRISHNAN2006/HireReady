/**
 * ===========================================
 * User Model - MongoDB Schema
 * ===========================================
 * 
 * Defines the user schema for authentication and profile management.
 * Includes password hashing, JWT token generation, and role-based access.
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const jwtConfig = require('../config/jwt.config');

// User Schema Definition
const userSchema = new mongoose.Schema({
  // Basic Information
  firstName: {
    type: String,
    required: [true, 'First name is required'],
    trim: true,
    maxlength: [50, 'First name cannot exceed 50 characters']
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required'],
    trim: true,
    maxlength: [50, 'Last name cannot exceed 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [8, 'Password must be at least 8 characters'],
    select: false // Don't return password in queries by default
  },
  
  // Profile Information
  avatar: {
    type: String,
    default: 'default-avatar.png'
  },
  phone: {
    type: String,
    trim: true
  },
  bio: {
    type: String,
    maxlength: [500, 'Bio cannot exceed 500 characters']
  },
  
  // Professional Information
  jobTitle: {
    type: String,
    trim: true
  },
  company: {
    type: String,
    trim: true
  },
  experience: {
    type: Number,
    min: 0,
    max: 50,
    default: 0
  },
  skills: [{
    type: String,
    trim: true
  }],
  targetRole: {
    type: String,
    trim: true
  },
  
  // Preferences
  preferredCategories: [{
    type: String,
    enum: ['dsa', 'web', 'ml', 'system-design', 'behavioral', 'database', 'devops', 'mobile']
  }],
  difficultyLevel: {
    type: String,
    enum: ['easy', 'medium', 'hard', 'expert'],
    default: 'medium'
  },
  
  // Role and Access
  role: {
    type: String,
    enum: ['user', 'admin', 'moderator'],
    default: 'user'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isEmailVerified: {
    type: Boolean,
    default: false
  },
  
  // Auth Provider (for OAuth)
  authProvider: {
    type: String,
    enum: ['local', 'google', 'github'],
    default: 'local'
  },
  
  // User Preferences/Settings
  preferences: {
    // Appearance
    theme: { type: String, enum: ['light', 'dark', 'system'], default: 'light' },
    fontSize: { type: String, enum: ['small', 'medium', 'large'], default: 'medium' },
    reducedMotion: { type: Boolean, default: false },
    
    // Notifications
    emailNotifications: { type: Boolean, default: true },
    pushNotifications: { type: Boolean, default: true },
    interviewReminders: { type: Boolean, default: true },
    weeklyReport: { type: Boolean, default: true },
    marketingEmails: { type: Boolean, default: false },
    
    // Privacy
    profileVisibility: { type: String, enum: ['public', 'private', 'friends'], default: 'public' },
    showOnLeaderboard: { type: Boolean, default: true },
    shareProgress: { type: Boolean, default: true },
    
    // Interview Preferences
    defaultDifficulty: { type: String, enum: ['easy', 'medium', 'hard'], default: 'medium' },
    defaultDuration: { type: Number, default: 30 },
    autoSaveAnswers: { type: Boolean, default: true },
    showHints: { type: Boolean, default: true },
    soundEnabled: { type: Boolean, default: true },
    
    // Language & Region
    language: { type: String, default: 'en' },
    timezone: { type: String, default: 'UTC' }
  },
  
  // Authentication Tokens
  refreshToken: {
    type: String,
    select: false
  },
  passwordResetToken: String,
  passwordResetExpires: Date,
  emailVerificationToken: String,
  emailVerificationExpires: Date,
  
  // Activity Tracking
  lastLogin: {
    type: Date
  },
  loginCount: {
    type: Number,
    default: 0
  },
  
  // Saved Questions
  savedQuestions: [{
    question: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Question'
    },
    savedAt: {
      type: Date,
      default: Date.now
    },
    notes: String,
    starred: {
      type: Boolean,
      default: false
    }
  }],
  
  // Notifications
  notifications: [{
    type: {
      type: String,
      enum: ['achievement', 'result', 'reminder', 'system', 'tip', 'streak', 'challenge'],
      default: 'system'
    },
    title: String,
    message: String,
    read: {
      type: Boolean,
      default: false
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// ===========================================
// Virtual Fields
// ===========================================

// Full name virtual
userSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

// Virtual for user's interviews
userSchema.virtual('interviews', {
  ref: 'Interview',
  localField: '_id',
  foreignField: 'user',
  justOne: false
});

// ===========================================
// Indexes (email already indexed by unique: true)
// ===========================================

userSchema.index({ role: 1 });
userSchema.index({ createdAt: -1 });

// ===========================================
// Pre-save Middleware
// ===========================================

// Hash password before saving
userSchema.pre('save', async function(next) {
  // Only hash if password is modified
  if (!this.isModified('password')) {
    return next();
  }
  
  try {
    // Generate salt and hash password (10 rounds is secure and fast for production)
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// ===========================================
// Instance Methods
// ===========================================

/**
 * Compare entered password with hashed password
 * @param {string} enteredPassword - Password to compare
 * @returns {Promise<boolean>} - Whether passwords match
 */
userSchema.methods.comparePassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

/**
 * Generate JWT access token
 * @returns {string} - JWT token
 */
userSchema.methods.generateAccessToken = function() {
  return jwt.sign(
    { 
      id: this._id,
      email: this.email,
      role: this.role 
    },
    jwtConfig.secret,
    { 
      expiresIn: jwtConfig.expiresIn,
      algorithm: jwtConfig.algorithm
    }
  );
};

/**
 * Generate refresh token
 * @returns {string} - Refresh token
 */
userSchema.methods.generateRefreshToken = function() {
  return jwt.sign(
    { id: this._id },
    jwtConfig.secret,
    { expiresIn: jwtConfig.refreshExpiresIn }
  );
};

/**
 * Generate password reset token
 * @returns {string} - Reset token
 */
userSchema.methods.generatePasswordResetToken = function() {
  const crypto = require('crypto');
  const resetToken = crypto.randomBytes(32).toString('hex');
  
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
  
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
  
  return resetToken;
};

/**
 * Generate email verification token
 * @returns {string} - Verification token
 */
userSchema.methods.generateEmailVerificationToken = function() {
  const crypto = require('crypto');
  const verificationToken = crypto.randomBytes(32).toString('hex');
  
  this.emailVerificationToken = crypto
    .createHash('sha256')
    .update(verificationToken)
    .digest('hex');
  
  this.emailVerificationExpires = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
  
  return verificationToken;
};

/**
 * Update login statistics
 */
userSchema.methods.updateLoginStats = function() {
  this.lastLogin = new Date();
  this.loginCount += 1;
  return this.save();
};

// ===========================================
// Static Methods
// ===========================================

/**
 * Find user by email
 * @param {string} email - User email
 * @returns {Promise<User>} - User document
 */
userSchema.statics.findByEmail = function(email) {
  return this.findOne({ email: email.toLowerCase() });
};

/**
 * Get active users count
 * @returns {Promise<number>} - Count of active users
 */
userSchema.statics.getActiveUsersCount = function() {
  return this.countDocuments({ isActive: true });
};

const User = mongoose.model('User', userSchema);

module.exports = User;
