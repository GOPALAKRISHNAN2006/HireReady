const request = require('supertest');
const { app } = require('../server');

describe('Health endpoint', () => {
  it('should return 200 and status message', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('success', true);
    expect(res.body).toHaveProperty('message');
  });
});
