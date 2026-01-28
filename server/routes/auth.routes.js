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
const User = require('../models/User.model');
const Analytics = require('../models/Analytics.model');
const { protect } = require('../middleware/auth.middleware');
const { asyncHandler } = require('../middleware/errorHandler');
const { 
  validateRegistration, 
  validateLogin, 
  validatePasswordChange 
} = require('../middleware/validation.middleware');
const jwtConfig = require('../config/jwt.config');

/**
 * @route   POST /api/auth/register
 * @desc    Register new user
 * @access  Public
 */
router.post('/register', validateRegistration, asyncHandler(async (req, res) => {
  const { firstName, lastName, email, password, targetRole, skills } = req.body;

  // Check if user already exists
  const existingUser = await User.findByEmail(email);
  if (existingUser) {
    return res.status(400).json({
      success: false,
      message: 'An account with this email already exists.'
    });
  }

  // Create user
  const user = await User.create({
    firstName,
    lastName,
    email,
    password,
    targetRole: targetRole || '',
    skills: skills || []
  });

  // Create analytics record for the user
  await Analytics.create({ user: user._id });

  // Generate tokens
  const accessToken = user.generateAccessToken();
  const refreshToken = user.generateRefreshToken();

  // Save refresh token to user
  user.refreshToken = refreshToken;
  await user.save();

  // Send response
  res.status(201).json({
    success: true,
    message: 'Registration successful! Welcome to HireReady.',
    data: {
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        avatar: user.avatar
      },
      tokens: {
        accessToken,
        refreshToken,
        expiresIn: jwtConfig.expiresIn
      }
    }
  });
}));

/**
 * @route   POST /api/auth/admin/login
 * @desc    Login admin user (admin-only endpoint)
 * @access  Public (but only admin accounts will succeed)
 */
router.post('/admin/login', validateLogin, asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Find user with password field
  const user = await User.findOne({ email: email.toLowerCase() }).select('+password');

  if (!user) {
    return res.status(401).json({
      success: false,
      message: 'Invalid email or password.'
    });
  }

  // Check if account is active
  if (!user.isActive) {
    return res.status(401).json({
      success: false,
      message: 'Your account has been deactivated. Please contact support.'
    });
  }

  // Check password
  const isMatch = await user.comparePassword(password);

  if (!isMatch) {
    return res.status(401).json({
      success: false,
      message: 'Invalid email or password.'
    });
  }

  // Ensure account is admin
  if (user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'This endpoint is for admin accounts only.'
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
        avatar: user.avatar
      },
      tokens: {
        accessToken,
        refreshToken,
        expiresIn: jwtConfig.expiresIn
      }
    }
  });
}));

/**
 * @route   POST /api/auth/login
 * @desc    Login user
 * @access  Public
 */
router.post('/login', validateLogin, asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Find user with password field
  const user = await User.findOne({ email: email.toLowerCase() }).select('+password');

  if (!user) {
    return res.status(401).json({
      success: false,
      message: 'Invalid email or password.'
    });
  }

  // Check if account is active
  if (!user.isActive) {
    return res.status(401).json({
      success: false,
      message: 'Your account has been deactivated. Please contact support.'
    });
  }

  // Check password
  const isMatch = await user.comparePassword(password);

  if (!isMatch) {
    return res.status(401).json({
      success: false,
      message: 'Invalid email or password.'
    });
  }

  // Prevent admins from logging in via the regular user login
  if (user.role === 'admin') {
    return res.status(401).json({
      success: false,
      message: 'Admin accounts must sign in via the admin login page.'
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
        plan: user.plan
      },
      tokens: {
        accessToken,
        refreshToken,
        expiresIn: jwtConfig.expiresIn
      }
    }
  });
}));

/**
 * @route   POST /api/auth/logout
 * @desc    Logout user (invalidate refresh token)
 * @access  Private
 */
router.post('/logout', protect, asyncHandler(async (req, res) => {
  // Clear refresh token
  await User.findByIdAndUpdate(req.user._id, { refreshToken: null });

  res.status(200).json({
    success: true,
    message: 'Logged out successfully.'
  });
}));

/**
 * @route   GET /api/auth/me
 * @desc    Get current logged-in user
 * @access  Private
 */
router.get('/me', protect, asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id)
    .select('-refreshToken -passwordResetToken -passwordResetExpires');

  res.status(200).json({
    success: true,
    data: { user }
  });
}));

/**
 * @route   POST /api/auth/refresh
 * @desc    Refresh access token using refresh token
 * @access  Public
 */
router.post('/refresh', asyncHandler(async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(401).json({
      success: false,
      message: 'Refresh token is required.'
    });
  }

  try {
    // Verify refresh token
    const jwt = require('jsonwebtoken');
    const decoded = jwt.verify(refreshToken, jwtConfig.secret);

    // Find user with this refresh token
    const user = await User.findOne({
      _id: decoded.id,
      refreshToken: refreshToken
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid refresh token.'
      });
    }

    // Generate new access token
    const newAccessToken = user.generateAccessToken();

    res.status(200).json({
      success: true,
      data: {
        accessToken: newAccessToken,
        expiresIn: jwtConfig.expiresIn
      }
    });

  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired refresh token.'
    });
  }
}));

/**
 * @route   POST /api/auth/forgot-password
 * @desc    Request password reset
 * @access  Public
 */
router.post('/forgot-password', asyncHandler(async (req, res) => {
  const { email } = req.body;

  const user = await User.findByEmail(email);

  if (!user) {
    // Don't reveal if email exists or not for security
    return res.status(200).json({
      success: true,
      message: 'If an account with that email exists, a password reset link has been sent.'
    });
  }

  // Generate reset token
  const resetToken = user.generatePasswordResetToken();
  await user.save();

  // In production, send email with reset link
  // For now, just return success message
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

  // TODO: Implement email sending
  console.log('Password reset URL:', resetUrl);

  res.status(200).json({
    success: true,
    message: 'If an account with that email exists, a password reset link has been sent.',
    // Include token in response for development
    ...(process.env.NODE_ENV === 'development' && { resetToken })
  });
}));

/**
 * @route   PUT /api/auth/reset-password/:token
 * @desc    Reset password using token
 * @access  Public
 */
router.put('/reset-password/:token', asyncHandler(async (req, res) => {
  const { password } = req.body;

  if (!password || password.length < 8) {
    return res.status(400).json({
      success: false,
      message: 'Password must be at least 8 characters.'
    });
  }

  // Hash the token from URL
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  // Find user with valid reset token
  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() }
  });

  if (!user) {
    return res.status(400).json({
      success: false,
      message: 'Invalid or expired reset token.'
    });
  }

  // Update password
  user.password = password;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  res.status(200).json({
    success: true,
    message: 'Password reset successful. You can now login with your new password.'
  });
}));

/**
 * @route   PUT /api/auth/change-password
 * @desc    Change password for authenticated user
 * @access  Private
 */
router.put('/change-password', protect, validatePasswordChange, asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  // Get user with password
  const user = await User.findById(req.user._id).select('+password');

  // Check current password
  const isMatch = await user.comparePassword(currentPassword);

  if (!isMatch) {
    return res.status(401).json({
      success: false,
      message: 'Current password is incorrect.'
    });
  }

  // Update password
  user.password = newPassword;
  await user.save();

  // Generate new tokens
  const accessToken = user.generateAccessToken();
  const refreshToken = user.generateRefreshToken();

  user.refreshToken = refreshToken;
  await user.save();

  res.status(200).json({
    success: true,
    message: 'Password changed successfully.',
    data: {
      tokens: {
        accessToken,
        refreshToken,
        expiresIn: jwtConfig.expiresIn
      }
    }
  });
}));

/**
 * @route   POST /api/auth/google
 * @desc    Login/Register with Google OAuth
 * @access  Public
 */
router.post('/google', asyncHandler(async (req, res) => {
  const { credential, clientId } = req.body;

  if (!credential) {
    return res.status(400).json({
      success: false,
      message: 'Google credential is required.'
    });
  }

  try {
    // Decode the Google JWT credential
    const decoded = JSON.parse(Buffer.from(credential.split('.')[1], 'base64').toString());
    
    const { email, given_name, family_name, picture, email_verified } = decoded;

    if (!email_verified) {
      return res.status(400).json({
        success: false,
        message: 'Google email not verified.'
      });
    }

    // Check if user exists
    let user = await User.findByEmail(email);

    if (user) {
      // User exists - log them in
      if (!user.isActive) {
        return res.status(401).json({
          success: false,
          message: 'Your account has been deactivated. Please contact support.'
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
        authProvider: 'google'
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
          plan: user.plan
        },
        tokens: {
          accessToken,
          refreshToken,
          expiresIn: jwtConfig.expiresIn
        }
      }
    });
  } catch (error) {
    console.error('Google OAuth error:', error);
    return res.status(400).json({
      success: false,
      message: 'Invalid Google credential.'
    });
  }
}));

/**
 * @route   POST /api/auth/verify-email/:token
 * @desc    Verify user email
 * @access  Public
 */
router.post('/verify-email/:token', asyncHandler(async (req, res) => {
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user = await User.findOne({
    emailVerificationToken: hashedToken,
    emailVerificationExpires: { $gt: Date.now() }
  });

  if (!user) {
    return res.status(400).json({
      success: false,
      message: 'Invalid or expired verification token.'
    });
  }

  user.isEmailVerified = true;
  user.emailVerificationToken = undefined;
  user.emailVerificationExpires = undefined;
  await user.save();

  res.status(200).json({
    success: true,
    message: 'Email verified successfully.'
  });
}));

module.exports = router;
