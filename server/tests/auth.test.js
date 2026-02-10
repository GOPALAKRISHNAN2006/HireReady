const request = require('supertest');
const { app } = require('../server');

describe('Auth endpoints (basic)', () => {
  it('POST /api/auth/login should reject missing credentials', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({});

    expect(res.status).toBeGreaterThanOrEqual(400);
    expect(res.body).toHaveProperty('success', false);
  });
});
