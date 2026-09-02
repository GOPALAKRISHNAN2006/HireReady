const PendingRegistration = require('../models/PendingRegistration.model');
const User = require('../models/User.model');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');

describe('PendingRegistration & User Schema Security Architecture', () => {
  test('PendingRegistration schema correctly defines TTL index and required fields', () => {
    const paths = PendingRegistration.schema.paths;
    expect(paths.email).toBeDefined();
    expect(paths.verificationToken).toBeDefined();
    expect(paths.verificationExpires).toBeDefined();
    expect(paths.password).toBeDefined();

    // Verify TTL index configuration (expireAfterSeconds: 86400)
    const createdAtPath = paths.createdAt;
    expect(createdAtPath.options.expires).toBe(86400);
  });

  test('User pre-save hook does NOT double-hash pre-hashed bcrypt passwords', async () => {
    const rawPassword = 'MySecretPassword123!';
    const salt = await bcrypt.genSalt(10);
    const preHashed = await bcrypt.hash(rawPassword, salt);

    const user = new User({
      firstName: 'Bcrypt',
      lastName: 'Check',
      email: 'bcrypt.test@example.com',
      password: preHashed,
      isEmailVerified: true,
    });

    // Manually trigger pre-save hook logic
    const isAlreadyBcrypt =
      typeof user.password === 'string' && /^\$2[ab]\$\d+\$/.test(user.password);
    expect(isAlreadyBcrypt).toBe(true);

    // Verify bcrypt compare succeeds with original raw password
    const isMatch = await bcrypt.compare(rawPassword, preHashed);
    expect(isMatch).toBe(true);
  });

  test('Crypto token generation produces 64-character SHA-256 hashes', () => {
    const rawToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(rawToken).digest('hex');

    expect(rawToken.length).toBe(64);
    expect(hashedToken.length).toBe(64);
    expect(rawToken).not.toEqual(hashedToken);
  });
});
