/**
 * ===========================================
 * Authentication Middleware
 * ===========================================
 * 
 * Protects routes by verifying JWT tokens and user authorization.
 */

const jwt = require('jsonwebtoken');
const User = require('../models/User.model');
const jwtConfig = require('../config/jwt.config');

/**
 * Protect routes - Verify JWT token
 * Adds user object to request if authenticated
 */
const protect = async (req, res, next) => {
  try {
    let token;

    // Check for token in Authorization header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }
    // Check for token in cookies (alternative)
    else if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }

    // Make sure token exists
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to access this route. Please login.'
      });
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, jwtConfig.secret);

      // Get user from token
      const user = await User.findById(decoded.id).select('-password');

      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'User not found. Token is invalid.'
        });
      }

      // Check if user is active
      if (!user.isActive) {
        return res.status(401).json({
          success: false,
          message: 'Your account has been deactivated. Please contact support.'
        });
      }

      // Add user to request object
      req.user = user;
      next();

    } catch (error) {
      // Token verification failed
      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({
          success: false,
          message: 'Token has expired. Please login again.'
        });
      }
      
      return res.status(401).json({
        success: false,
        message: 'Not authorized to access this route.'
      });
    }

  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error during authentication.'
    });
  }
};

/**
 * Authorize specific roles
 * @param {...string} roles - Allowed roles
 */
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Not authenticated.'
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `User role '${req.user.role}' is not authorized to access this route.`
      });
    }

    next();
  };
};

/**
 * Optional authentication - doesn't fail if no token
 * Useful for public routes that behave differently for authenticated users
 */
const optionalAuth = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (token) {
      try {
        const decoded = jwt.verify(token, jwtConfig.secret);
        const user = await User.findById(decoded.id).select('-password');
        if (user && user.isActive) {
          req.user = user;
        }
      } catch (error) {
        // Token invalid, but continue without user
      }
    }

    next();
  } catch (error) {
    next();
  }
};

/**
 * Check if user owns the resource
 * @param {string} paramName - Route parameter containing resource owner ID
 */
const isOwner = (paramName = 'userId') => {
  return (req, res, next) => {
    const resourceOwnerId = req.params[paramName];
    
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Not authenticated.'
      });
    }

    // Admin can access any resource
    if (req.user.role === 'admin') {
      return next();
    }

    // Check if user owns the resource
    if (req.user._id.toString() !== resourceOwnerId) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this resource.'
      });
    }

    next();
  };
};

/**
 * Require premium plan - checks user has active basic/premium/enterprise subscription
 * Must be used AFTER protect middleware
 */
const requirePremium = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Not authenticated.'
    });
  }

  const paidPlans = ['basic', 'premium', 'enterprise'];
  const userPlan = req.user.plan || 'free';

  if (!paidPlans.includes(userPlan)) {
    return res.status(403).json({
      success: false,
      message: 'This feature requires a premium plan. Please upgrade to continue.',
      code: 'PREMIUM_REQUIRED'
    });
  }

  // Check if plan has expired
  if (req.user.planExpiresAt && new Date(req.user.planExpiresAt) < new Date()) {
    return res.status(403).json({
      success: false,
      message: 'Your premium plan has expired. Please renew to continue.',
      code: 'PLAN_EXPIRED'
    });
  }

  next();
};

module.exports = {
  protect,
  authorize,
  optionalAuth,
  isOwner,
  requirePremium
};
