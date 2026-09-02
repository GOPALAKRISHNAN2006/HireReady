/**
 * ===========================================
 * JWT Configuration
 * ===========================================
 *
 * Configuration for JSON Web Token authentication.
 */

const jwtSecret = process.env.JWT_SECRET;

if (!jwtSecret && process.env.NODE_ENV === 'production') {
  console.error('❌ CRITICAL CONFIGURATION ERROR: JWT_SECRET environment variable is missing.');
  process.exit(1);
}

module.exports = {
  // JWT secret key (must be configured in environment)
  secret: jwtSecret || 'dev-only-secret-key-replace-in-env',

  // Token expiration time
  expiresIn: process.env.JWT_EXPIRE || '7d',

  // Cookie expiration (in days)
  cookieExpire: parseInt(process.env.JWT_COOKIE_EXPIRE) || 7,

  // Token type
  tokenType: 'Bearer',

  // Refresh token expiration
  refreshExpiresIn: '30d',

  // Algorithm used for signing
  algorithm: 'HS256',
};
