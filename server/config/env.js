/**
 * Environment validation helper
 */
const required = ['JWT_SECRET', 'MONGODB_URI'];

function validateEnv() {
  const missing = required.filter(k => !process.env[k]);

  if (process.env.NODE_ENV === 'production') {
    if (missing.length > 0) {
      console.error(
        `❌ CRITICAL ERROR: Missing required production environment variables: ${missing.join(', ')}`
      );
      process.exit(1);
    }

    // Check for insecure default secrets in production
    const insecureKeys = [
      'your-default-secret-key-change-in-production',
      'your-super-secret-jwt-key-change-in-production',
      'your-super-secret-jwt-key-change-in-production-1234567890',
    ];
    if (insecureKeys.includes(process.env.JWT_SECRET)) {
      console.error(
        '❌ CRITICAL ERROR: Using insecure fallback JWT_SECRET in production is not allowed.'
      );
      process.exit(1);
    }
  } else {
    if (missing.length > 0) {
      console.warn(
        `⚠️ Missing required env vars: ${missing.join(', ')}. Using defaults for development.`
      );
    }
  }
}

module.exports = { validateEnv };
