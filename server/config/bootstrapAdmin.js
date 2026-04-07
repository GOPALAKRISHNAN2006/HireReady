const User = require('../models/User.model');

const DEFAULT_ADMIN_EMAIL = (process.env.DEFAULT_ADMIN_EMAIL || 'hireready007@gmail.com').toLowerCase();
const DEFAULT_ADMIN_PASSWORD = process.env.DEFAULT_ADMIN_PASSWORD || 'Hireready@12345';

async function ensureDefaultAdmin() {
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
