/**
 * Environment validation helper
 */
const required = [
  'JWT_SECRET'
];

function validateEnv() {
  const missing = required.filter(k => !process.env[k]);
  if (missing.length > 0) {
    console.warn(`⚠️ Missing required env vars: ${missing.join(', ')}. Using defaults for development.`);
  }
}

module.exports = { validateEnv };
