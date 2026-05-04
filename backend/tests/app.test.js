const request = require('supertest');
const app = require('../server');

describe('Todo API Tests', () => {
  test('GET /api/todos should return array', async () => {
    const res = await request(app).get('/api/todos');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});