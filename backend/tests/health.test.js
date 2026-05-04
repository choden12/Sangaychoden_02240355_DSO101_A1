const request = require('supertest');
const app = require('../server');

describe('API Health Checks', () => {
  test('GET /health should return OK', async () => {
    const res = await request(app).get('/health');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('OK');
  });
  
  test('GET / should return message', async () => {
    const res = await request(app).get('/');
    expect(res.statusCode).toBe(200);
    expect(res.text).toContain('Todo API is running');
  });
});