const mongoose = require('mongoose');
const request = require('supertest');
const User = require('../models/User.model');
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

describe('User Registration & Authentication Gatekeeper', () => {
  test('Test 1 — Registration directly creates User document and returns tokens', async () => {
    if (mongoose.connection.readyState === 0) return;

    const testEmail = 'direct.reg.test@example.com';
    await User.deleteOne({ email: testEmail });

    const res = await request(app).post('/api/auth/register').send({
      firstName: 'Test',
      lastName: 'User',
      email: testEmail,
      password: 'Password123!',
      confirmPassword: 'Password123!',
    });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('user');
    expect(res.body.data).toHaveProperty('tokens');

    // User document exists in database with verified status
    const createdUser = await User.findOne({ email: testEmail });
    expect(createdUser).not.toBeNull();
    expect(createdUser.firstName).toBe('Test');
    expect(createdUser.isEmailVerified).toBe(true);

    // Cleanup
    await User.deleteOne({ email: testEmail });
  });

  test('Test 2 — User can login immediately after registration', async () => {
    if (mongoose.connection.readyState === 0) return;

    const testEmail = 'login.direct.test@example.com';
    await User.deleteOne({ email: testEmail });

    // Register
    await request(app).post('/api/auth/register').send({
      firstName: 'Direct',
      lastName: 'Login',
      email: testEmail,
      password: 'Password123!',
      confirmPassword: 'Password123!',
    });

    // Login
    const res = await request(app).post('/api/auth/login').send({
      email: testEmail,
      password: 'Password123!',
    });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('tokens');

    // Cleanup
    await User.deleteOne({ email: testEmail });
  });

  test('Test 3 — Duplicate registration with same email is rejected', async () => {
    if (mongoose.connection.readyState === 0) return;

    const testEmail = 'duplicate.test@example.com';
    await User.deleteOne({ email: testEmail });

    // First registration
    await request(app).post('/api/auth/register').send({
      firstName: 'Original',
      lastName: 'User',
      email: testEmail,
      password: 'Password123!',
      confirmPassword: 'Password123!',
    });

    // Duplicate registration attempt
    const res = await request(app).post('/api/auth/register').send({
      firstName: 'Duplicate',
      lastName: 'User',
      email: testEmail,
      password: 'Password123!',
      confirmPassword: 'Password123!',
    });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);

    // Cleanup
    await User.deleteOne({ email: testEmail });
  });

  test('Test 4 — Invalid verification token is rejected', async () => {
    const res = await request(app).post('/api/auth/verify-email/invalid-token-1234567890');

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });
});
