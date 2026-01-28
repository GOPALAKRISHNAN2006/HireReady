/**
 * ===========================================
 * JWT Configuration
 * ===========================================
 * 
 * Configuration for JSON Web Token authentication.
 */

module.exports = {
  // JWT secret key (should be in .env file in production)
  secret: process.env.JWT_SECRET || 'your-default-secret-key-change-in-production',
  
  // Token expiration time
  expiresIn: process.env.JWT_EXPIRE || '7d',
  
  // Cookie expiration (in days)
  cookieExpire: parseInt(process.env.JWT_COOKIE_EXPIRE) || 7,
  
  // Token type
  tokenType: 'Bearer',
  
  // Refresh token expiration
  refreshExpiresIn: '30d',
  
  // Algorithm used for signing
  algorithm: 'HS256'
};
