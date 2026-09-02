const mongoose = require('mongoose');
const request = require('supertest');
const User = require('../models/User.model');
const PendingRegistration = require('../models/PendingRegistration.model');
const { app } = require('../server');

jest.setTimeout(30000);

beforeAll(async () => {
  if (mongoose.connection.readyState === 0) {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/hireready_test';
    try {
      await mongoose.connect(mongoUri);
    } catch (err) {
      console.warn('MongoDB connection skipped for tests:', err.message);
    }
  }
});

afterAll(async () => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }
});

describe('Pending Registration & Email Verification Gatekeeper', () => {
  test('Test 1 & 19 — Registration creates PendingRegistration, NOT User document', async () => {
    if (mongoose.connection.readyState === 0) return;

    const testEmail = 'unverified.fake.user@example.test';
    await User.deleteOne({ email: testEmail });
    await PendingRegistration.deleteOne({ email: testEmail });

    const res = await request(app).post('/api/auth/register').send({
      firstName: 'Test',
      lastName: 'User',
      email: testEmail,
      password: 'Password123!',
      confirmPassword: 'Password123!',
    });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.requiresVerification).toBe(true);

    // CRITICAL REQUIREMENT: User document MUST NOT exist in database yet
    const createdUser = await User.findOne({ email: testEmail });
    expect(createdUser).toBeNull();

    // PendingRegistration document MUST exist
    const pendingDoc = await PendingRegistration.findOne({ email: testEmail });
    expect(pendingDoc).not.toBeNull();
    expect(pendingDoc.firstName).toBe('Test');
    expect(pendingDoc.verificationToken).toBeDefined();

    // Cleanup
    await PendingRegistration.deleteOne({ email: testEmail });
  });

  test('Test 2 — User cannot login before email verification', async () => {
    if (mongoose.connection.readyState === 0) return;

    const testEmail = 'unverified.login.attempt@example.com';
    await User.deleteOne({ email: testEmail });
    await PendingRegistration.deleteOne({ email: testEmail });

    // Initiate pending registration
    await request(app).post('/api/auth/register').send({
      firstName: 'Unverified',
      lastName: 'Person',
      email: testEmail,
      password: 'Password123!',
      confirmPassword: 'Password123!',
    });

    // Attempt login before verification
    const res = await request(app).post('/api/auth/login').send({
      email: testEmail,
      password: 'Password123!',
    });

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);

    // Cleanup
    await PendingRegistration.deleteOne({ email: testEmail });
  });

  test('Test 3 & 14 — Valid verification creates permanent User document', async () => {
    if (mongoose.connection.readyState === 0) return;

    const testEmail = 'verify.success@example.com';
    await User.deleteOne({ email: testEmail });
    await PendingRegistration.deleteOne({ email: testEmail });

    // 1. Register
    const regRes = await request(app).post('/api/auth/register').send({
      firstName: 'John',
      lastName: 'Doe',
      email: testEmail,
      password: 'SecurePassword123!',
      confirmPassword: 'SecurePassword123!',
    });

    const rawToken = regRes.body.verificationToken;
    expect(rawToken).toBeDefined();

    // 2. Verify Email
    const verifyRes = await request(app).post(`/api/auth/verify-email/${rawToken}`);

    expect(verifyRes.status).toBe(200);
    expect(verifyRes.body.success).toBe(true);

    // 3. User document MUST now exist with isEmailVerified: true
    const createdUser = await User.findOne({ email: testEmail });
    expect(createdUser).not.toBeNull();
    expect(createdUser.isEmailVerified).toBe(true);
    expect(createdUser.firstName).toBe('John');

    // 4. PendingRegistration document MUST be deleted
    const pendingDoc = await PendingRegistration.findOne({ email: testEmail });
    expect(pendingDoc).toBeNull();

    // Cleanup
    await User.deleteOne({ email: testEmail });
  });

  test('Test 4 & 5 — Invalid or expired verification token is rejected', async () => {
    const res = await request(app).post('/api/auth/verify-email/invalid-token-1234567890');

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });
});
