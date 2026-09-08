/**
 * ===========================================
 * Authentication Routes
 * ===========================================
 *
 * Handles user registration, login, logout, and token management.
 *
 * Routes:
 * POST /api/auth/register - Register new user
 * POST /api/auth/login - Login user
 * POST /api/auth/logout - Logout user
 * GET /api/auth/me - Get current user
 * POST /api/auth/refresh - Refresh access token
 * POST /api/auth/forgot-password - Request password reset
 * PUT /api/auth/reset-password/:token - Reset password
 * PUT /api/auth/change-password - Change password (authenticated)
 */

const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const rateLimit = require('express-rate-limit');
const User = require('../models/User.model');
const PendingRegistration = require('../models/PendingRegistration.model');
const Analytics = require('../models/Analytics.model');

// Dedicated rate limiter for password reset operations (5 requests per 15 minutes)
const passwordResetLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: {
    success: false,
    message: 'Too many password reset requests. Please try again in 15 minutes.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});
const { protect } = require('../middleware/auth.middleware');
const { asyncHandler } = require('../middleware/errorHandler');
const {
  validateRegistration,
  validateLogin,
  validatePasswordChange,
} = require('../middleware/validation.middleware');
const jwtConfig = require('../config/jwt.config');
const {
  sendPasswordResetEmail,
  sendVerificationEmail,
  sendWelcomeEmail,
  sendPasswordChangedEmail,
} = require('../services/email.service');

// Initialize Google OAuth2 client
const { OAuth2Client } = require('google-auth-library');
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Cookie utility helpers
const setAuthCookies = (res, req, accessToken, refreshToken) => {
  const isProduction = process.env.NODE_ENV === 'production';
  const cookieOptions = {
    httpOnly: true,
    secure: isProduction || req.secure || req.headers['x-forwarded-proto'] === 'https',
    sameSite: isProduction ? 'none' : 'lax',
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
  };
  if (accessToken) res.cookie('token', accessToken, cookieOptions);
  if (refreshToken) res.cookie('refreshToken', refreshToken, cookieOptions);
};

const clearAuthCookies = (res, req) => {
  const isProduction = process.env.NODE_ENV === 'production';
  const cookieOptions = {
    httpOnly: true,
    secure: isProduction || req.secure || req.headers['x-forwarded-proto'] === 'https',
    sameSite: isProduction ? 'none' : 'lax',
  };
  res.clearCookie('token', cookieOptions);
  res.clearCookie('refreshToken', cookieOptions);
};

/**
 * @route   POST /api/auth/register
 * @desc    Register new user
 * @access  Public
 */
router.post(
  '/register',
  validateRegistration,
  asyncHandler(async (req, res) => {
    const { firstName, lastName, email, password, targetRole, skills } = req.body;
    const normalizedEmail = email.toLowerCase().trim();

    // Check if a permanent verified User account already exists
    const existingUser = await User.findByEmail(normalizedEmail);
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'An account with this email already exists.',
      });
    }

    // Create user directly (email verification not required)
    const user = await User.create({
      firstName,
      lastName,
      email: normalizedEmail,
      password,
      targetRole: targetRole || '',
      skills: skills || [],
      isEmailVerified: true,
    });

    // Generate authentication tokens
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    // Save refreshToken to user
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    // Set HTTP-only cookies
    setAuthCookies(res, req, accessToken, refreshToken);

    // Track analytics event (background)
    Analytics.trackEvent({
      userId: user._id,
      eventType: 'user_registered',
      metadata: { method: 'local' },
    }).catch(err => console.warn('Analytics tracking error:', err.message));

    // Send welcome email (background)
    sendWelcomeEmail(user.email, user.firstName).catch(err => {
      console.warn('Welcome email sending failed:', err.message || err);
    });

    // Clean up any pending registration for this email if present
    PendingRegistration.deleteOne({ email: normalizedEmail }).catch(() => {});

    res.status(201).json({
      success: true,
      message: 'Account created successfully.',
      data: {
        user: {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: user.role,
          avatar: user.avatar,
        },
        tokens: {
          accessToken,
          refreshToken,
          expiresIn: jwtConfig.expiresIn,
        },
      },
    });
  })
);

/**
 * @route   POST /api/auth/admin/login
 * @desc    Login admin user (admin-only endpoint)
 * @access  Public (but only admin accounts will succeed)
 */
router.post(
  '/admin/login',
  validateLogin,
  asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    // Find user with password field
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
    }

    // Check if account is active
    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Your account has been deactivated. Please contact support.',
      });
    }

    // Check if account is locked
    if (user.lockUntil && user.lockUntil > Date.now()) {
      const minutesLeft = Math.ceil((user.lockUntil - Date.now()) / (60 * 1000));
      return res.status(401).json({
        success: false,
        message: `Account is temporarily locked. Please try again in ${minutesLeft} minutes.`,
      });
    }

    // Check password
    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      user.loginAttempts += 1;
      if (user.loginAttempts >= 3) {
        user.lockUntil = Date.now() + 15 * 60 * 1000; // Lock for 15 minutes
        user.loginAttempts = 0; // Reset attempts once locked
      }
      await user.save();

      if (user.lockUntil && user.lockUntil > Date.now()) {
        return res.status(401).json({
          success: false,
          message:
            'Account temporarily locked due to 3 failed attempts. Please try again in 15 minutes.',
        });
      }

      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
    }

    // Reset login attempts on successful login
    if (user.loginAttempts > 0 || user.lockUntil) {
      user.loginAttempts = 0;
      user.lockUntil = undefined;
    }

    // Ensure account is admin
    if (user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'This endpoint is for admin accounts only.',
      });
    }

    // Generate tokens
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    // Update user login stats and save refresh token
    user.refreshToken = refreshToken;
    user.lastLogin = new Date();
    user.loginCount += 1;
    await user.save();

    // Set HttpOnly cookies
    setAuthCookies(res, req, accessToken, refreshToken);

    // Send response
    res.status(200).json({
      success: true,
      message: 'Admin login successful!',
      data: {
        user: {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: user.role,
          avatar: user.avatar,
        },
        tokens: {
          accessToken,
          refreshToken,
          expiresIn: jwtConfig.expiresIn,
        },
      },
    });
  })
);

/**
 * @route   POST /api/auth/login
 * @desc    Login user
 * @access  Public
 */
router.post(
  '/login',
  validateLogin,
  asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    // Find user with password field
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
    }

    // Check if account is active
    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Your account has been deactivated. Please contact support.',
      });
    }

    // Auto-verify email if not already marked
    if (!user.isEmailVerified) {
      user.isEmailVerified = true;
    }

    // Check if account is locked
    if (user.lockUntil && user.lockUntil > Date.now()) {
      const minutesLeft = Math.ceil((user.lockUntil - Date.now()) / (60 * 1000));
      return res.status(401).json({
        success: false,
        message: `Account is temporarily locked. Please try again in ${minutesLeft} minutes.`,
      });
    }

    // Check password
    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      user.loginAttempts += 1;
      if (user.loginAttempts >= 3) {
        user.lockUntil = Date.now() + 15 * 60 * 1000; // Lock for 15 minutes
        user.loginAttempts = 0; // Reset attempts once locked
      }
      await user.save();

      if (user.lockUntil && user.lockUntil > Date.now()) {
        return res.status(401).json({
          success: false,
          message:
            'Account temporarily locked due to 3 failed attempts. Please try again in 15 minutes.',
        });
      }

      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
    }

    // Reset login attempts on successful login
    if (user.loginAttempts > 0 || user.lockUntil) {
      user.loginAttempts = 0;
      user.lockUntil = undefined;
    }

    // Generate tokens
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    // Update user login stats and save refresh token
    user.refreshToken = refreshToken;
    user.lastLogin = new Date();
    user.loginCount += 1;
    await user.save();

    // Set HttpOnly cookies
    setAuthCookies(res, req, accessToken, refreshToken);

    // Send response
    res.status(200).json({
      success: true,
      message: 'Login successful!',
      data: {
        user: {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: user.role,
          avatar: user.avatar,
          plan: user.plan,
        },
        tokens: {
          accessToken,
          refreshToken,
          expiresIn: jwtConfig.expiresIn,
        },
      },
    });
  })
);

/**
 * @route   POST /api/auth/logout
 * @desc    Logout user (invalidate refresh token)
 * @access  Private
 */
router.post(
  '/logout',
  protect,
  asyncHandler(async (req, res) => {
    // Clear refresh token
    await User.findByIdAndUpdate(req.user._id, { refreshToken: null });

    // Clear HTTP-Only cookies
    clearAuthCookies(res, req);

    res.status(200).json({
      success: true,
      message: 'Logged out successfully.',
    });
  })
);

/**
 * @route   GET /api/auth/me
 * @desc    Get current logged-in user
 * @access  Private
 */
router.get(
  '/me',
  protect,
  asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id).select(
      '-refreshToken -passwordResetToken -passwordResetExpires'
    );

    res.status(200).json({
      success: true,
      data: { user },
    });
  })
);

/**
 * @route   POST /api/auth/refresh
 * @desc    Refresh access token using refresh token
 * @access  Public
 */
router.post(
  '/refresh',
  asyncHandler(async (req, res) => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        message: 'Refresh token is required.',
      });
    }

    try {
      // Verify refresh token
      const jwt = require('jsonwebtoken');
      const decoded = jwt.verify(refreshToken, jwtConfig.secret);

      // Find user with this refresh token
      const user = await User.findOne({
        _id: decoded.id,
        refreshToken: refreshToken,
      });

      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Invalid refresh token.',
        });
      }

      // Generate new access token
      const newAccessToken = user.generateAccessToken();

      // Set updated token cookie
      setAuthCookies(res, req, newAccessToken, null);

      res.status(200).json({
        success: true,
        data: {
          accessToken: newAccessToken,
          expiresIn: jwtConfig.expiresIn,
        },
      });
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired refresh token.',
      });
    }
  })
);

/**
 * @route   POST /api/auth/forgot-password
 * @desc    Request password reset
 * @access  Public
 */
router.post(
  '/forgot-password',
  passwordResetLimiter,
  asyncHandler(async (req, res) => {
    const { email } = req.body;

    const user = await User.findByEmail(email);

    if (!user) {
      // Don't reveal if email exists or not for security
      return res.status(200).json({
        success: true,
        message: 'If an account with that email exists, a password reset link has been sent.',
      });
    }

    // Generate reset token
    const resetToken = user.generatePasswordResetToken();
    await user.save();

    // Build reset URL
    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password/${resetToken}`;

    // Send password reset email
    const emailResult = await sendPasswordResetEmail(email, resetUrl, user.firstName);

    if (!emailResult.success) {
      console.warn('Email sending failed:', emailResult.message);
    }

    res.status(200).json({
      success: true,
      message: 'If an account with that email exists, a password reset link has been sent.',
      // Include token in response for development (remove in production)
      ...(process.env.NODE_ENV === 'development' && { resetToken, resetUrl }),
    });
  })
);

/**
 * @route   PUT /api/auth/reset-password/:token
 * @desc    Reset password using token
 * @access  Public
 */
router.put(
  '/reset-password/:token',
  passwordResetLimiter,
  asyncHandler(async (req, res) => {
    const { password } = req.body;

    if (!password || password.length < 8) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 8 characters.',
      });
    }

    // Hash the token from URL
    const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

    // Find user with valid reset token
    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired reset token.',
      });
    }

    // Update password
    user.password = password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Password reset successful. You can now login with your new password.',
    });
  })
);

/**
 * @route   PUT /api/auth/change-password
 * @desc    Change password for authenticated user
 * @access  Private
 */
router.put(
  '/change-password',
  protect,
  validatePasswordChange,
  asyncHandler(async (req, res) => {
    const { currentPassword, newPassword } = req.body;

    // Get user with password
    const user = await User.findById(req.user._id).select('+password');

    // Check current password
    const isMatch = await user.comparePassword(currentPassword);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Current password is incorrect.',
      });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    // Send password changed confirmation email
    sendPasswordChangedEmail(user.email, user.firstName).catch(err => {
      console.error('Failed to send password changed email:', err.message);
    });

    // Generate new tokens
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save();

    // Set cookies
    setAuthCookies(res, req, accessToken, refreshToken);

    res.status(200).json({
      success: true,
      message: 'Password changed successfully.',
      data: {
        tokens: {
          accessToken,
          refreshToken,
          expiresIn: jwtConfig.expiresIn,
        },
      },
    });
  })
);

/**
 * @route   POST /api/auth/google
 * @desc    Login/Register with Google OAuth
 * @access  Public
 */
router.post(
  '/google',
  asyncHandler(async (req, res) => {
    const { credential, clientId } = req.body;

    if (!credential) {
      return res.status(400).json({
        success: false,
        message: 'Google credential is required.',
      });
    }

    try {
      // Verify Google ID token securely (checks signature, expiration, and audience)
      const ticket = await googleClient.verifyIdToken({
        idToken: credential,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
      const payload = ticket.getPayload();

      const { email, given_name, family_name, picture, email_verified } = payload;

      if (!email_verified) {
        return res.status(400).json({
          success: false,
          message: 'Google email not verified.',
        });
      }

      // Check if user exists
      let user = await User.findByEmail(email);

      if (user) {
        // User exists - log them in
        if (!user.isActive) {
          return res.status(401).json({
            success: false,
            message: 'Your account has been deactivated. Please contact support.',
          });
        }

        // Update avatar if not set
        if (!user.avatar && picture) {
          user.avatar = picture;
        }
      } else {
        // Create new user
        user = await User.create({
          firstName: given_name || 'User',
          lastName: family_name || '',
          email: email.toLowerCase(),
          password: crypto.randomBytes(32).toString('hex'), // Random password for OAuth users
          avatar: picture,
          isEmailVerified: true,
          authProvider: 'google',
        });

        // Create analytics record for the user
        await Analytics.create({ user: user._id });
      }

      // Generate tokens
      const accessToken = user.generateAccessToken();
      const refreshToken = user.generateRefreshToken();

      // Update user login stats and save refresh token
      user.refreshToken = refreshToken;
      user.lastLogin = new Date();
      user.loginCount += 1;
      await user.save();

      // Set cookies
      setAuthCookies(res, req, accessToken, refreshToken);

      // Send response
      res.status(200).json({
        success: true,
        message: user.loginCount === 1 ? 'Account created successfully!' : 'Login successful!',
        data: {
          user: {
            id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            role: user.role,
            avatar: user.avatar,
            plan: user.plan,
          },
          tokens: {
            accessToken,
            refreshToken,
            expiresIn: jwtConfig.expiresIn,
          },
        },
      });
    } catch (error) {
      console.error('Google OAuth error:', error);
      return res.status(400).json({
        success: false,
        message: 'Invalid Google credential.',
      });
    }
  })
);

/**
 * @route   POST /api/auth/verify-email/:token
 * @desc    Verify user email and create permanent User document
 * @access  Public
 */
router.post(
  '/verify-email/:token',
  asyncHandler(async (req, res) => {
    const rawToken = req.params.token || req.query.token;
    if (!rawToken) {
      return res.status(400).json({
        success: false,
        message: 'Verification token is required.',
      });
    }

    const hashedToken = crypto.createHash('sha256').update(rawToken).digest('hex');

    // Search PendingRegistration for active matching token
    const pending = await PendingRegistration.findOne({
      verificationToken: hashedToken,
      verificationExpires: { $gt: Date.now() },
    });

    if (!pending) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired verification token.',
      });
    }

    // Atomic race-condition check: verify User document does not already exist
    let user = await User.findByEmail(pending.email);
    if (!user) {
      user = await User.create({
        firstName: pending.firstName,
        lastName: pending.lastName,
        email: pending.email,
        password: pending.password, // Pre-hashed bcrypt string
        targetRole: pending.targetRole,
        skills: pending.skills,
        isEmailVerified: true,
      });

      // Create analytics record for the user
      Analytics.create({ user: user._id }).catch(err => {
        console.warn('Analytics creation failed:', err.message || err);
      });

      // Send welcome email
      sendWelcomeEmail(user.email, user.firstName).catch(err => {
        console.warn('Welcome email sending failed:', err.message || err);
      });
    } else {
      if (!user.isEmailVerified) {
        user.isEmailVerified = true;
        await user.save();
      }
    }

    // Delete pending registration document after successful account creation
    await PendingRegistration.deleteOne({ _id: pending._id });

    // Generate tokens so user is authenticated upon verification
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    user.lastLogin = new Date();
    user.loginCount += 1;
    await user.save();

    // Set HttpOnly cookies
    setAuthCookies(res, req, accessToken, refreshToken);

    res.status(200).json({
      success: true,
      message: 'Email verified successfully! Your HireReady account has been created.',
      data: {
        user: {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: user.role,
          avatar: user.avatar,
          isEmailVerified: true,
        },
        tokens: {
          accessToken,
          refreshToken,
          expiresIn: jwtConfig.expiresIn,
        },
      },
    });
  })
);

/**
 * @route   POST /api/auth/resend-verification
 * @desc    Resend email verification
 * @access  Public
 */
router.post(
  '/resend-verification',
  passwordResetLimiter,
  asyncHandler(async (req, res) => {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required.',
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Check if verified User already exists
    const existingUser = await User.findByEmail(normalizedEmail);
    if (existingUser && existingUser.isEmailVerified) {
      return res.status(400).json({
        success: false,
        message: 'This email is already verified.',
      });
    }

    // Check PendingRegistration
    const pending = await PendingRegistration.findOne({ email: normalizedEmail });

    if (!pending) {
      // Don't reveal if pending registration exists or not for security
      return res.status(200).json({
        success: true,
        message:
          'If a pending registration for that email exists, a verification email has been sent.',
      });
    }

    // Generate new verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const hashedVerificationToken = crypto
      .createHash('sha256')
      .update(verificationToken)
      .digest('hex');
    const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);

    pending.verificationToken = hashedVerificationToken;
    pending.verificationExpires = verificationExpires;
    await pending.save();

    // Build verification URL
    const verificationUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/verify-email/${verificationToken}`;

    // Send verification email
    const emailResult = await sendVerificationEmail(
      normalizedEmail,
      verificationUrl,
      pending.firstName
    );

    if (!emailResult.success) {
      console.warn('Verification email sending failed:', emailResult.message);
    }

    res.status(200).json({
      success: true,
      message:
        'If a pending registration for that email exists, a verification email has been sent.',
      // Include token in response for development (remove in production)
      ...(process.env.NODE_ENV === 'development' && { verificationToken, verificationUrl }),
    });
  })
);

module.exports = router;
