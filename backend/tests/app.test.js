const request = require('supertest');
const app = require('../server');  // Now this will work!

describe('Todo API Tests', () => {
    test('GET /api/todos should return array', async () => {
        const res = await request(app).get('/api/todos');
        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
    });
    
    test('GET /health should return OK', async () => {
        const res = await request(app).get('/health');
        expect(res.statusCode).toBe(200);
        expect(res.body.status).toBe('OK');
    });
});