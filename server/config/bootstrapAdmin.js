const User = require('../models/User.model');

const DEFAULT_ADMIN_EMAIL = (process.env.DEFAULT_ADMIN_EMAIL || '').toLowerCase();
const DEFAULT_ADMIN_PASSWORD = process.env.DEFAULT_ADMIN_PASSWORD || '';

async function ensureDefaultAdmin() {
  if (!DEFAULT_ADMIN_EMAIL || !DEFAULT_ADMIN_PASSWORD) {
    if (process.env.NODE_ENV === 'production') {
      console.error(
        '❌ CRITICAL ERROR: DEFAULT_ADMIN_EMAIL and DEFAULT_ADMIN_PASSWORD must be configured in production environment.'
      );
      process.exit(1);
    }
    // In dev, skip if credentials not explicitly configured
    return;
  }

  if (process.env.NODE_ENV === 'production') {
    const insecurePasswords = ['Hireready@12345', 'admin123', 'password', '123456'];
    if (insecurePasswords.includes(DEFAULT_ADMIN_PASSWORD)) {
      console.error(
        '❌ CRITICAL ERROR: Insecure default admin email or password is not allowed in production.'
      );
      process.exit(1);
    }
  }
  try {
    let admin = await User.findOne({ email: DEFAULT_ADMIN_EMAIL }).select('+password');

    if (!admin) {
      await User.create({
        firstName: 'HireReady',
        lastName: 'Admin',
        email: DEFAULT_ADMIN_EMAIL,
        password: DEFAULT_ADMIN_PASSWORD,
        role: 'admin',
        isActive: true,
        isEmailVerified: true,
      });
      console.log(`✅ Default admin created: ${DEFAULT_ADMIN_EMAIL}`);
      return;
    }

    let shouldSave = false;

    if (admin.role !== 'admin') {
      admin.role = 'admin';
      shouldSave = true;
    }

    if (!admin.isActive) {
      admin.isActive = true;
      shouldSave = true;
    }

    if (!admin.isEmailVerified) {
      admin.isEmailVerified = true;
      shouldSave = true;
    }

    const passwordMatches = await admin.comparePassword(DEFAULT_ADMIN_PASSWORD);
    if (!passwordMatches) {
      admin.password = DEFAULT_ADMIN_PASSWORD;
      shouldSave = true;
    }

    if (shouldSave) {
      await admin.save();
      console.log(`✅ Default admin ensured: ${DEFAULT_ADMIN_EMAIL}`);
    }
  } catch (error) {
    console.error('❌ Failed to ensure default admin:', error.message);
  }
}

module.exports = { ensureDefaultAdmin };
