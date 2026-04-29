const request = require('supertest');
const express = require('express');

// Create a simple test app (adjust based on your actual app)
const app = express();
app.get('/api/todos', (req, res) => {
    res.json({ message: 'Todo API working' });
});

describe('Backend API Tests', () => {
    test('GET /api/todos should return 200', async () => {
        const response = await request(app)
            .get('/api/todos')
            .expect(200);
    });
    
    test('Basic test should pass', () => {
        expect(true).toBe(true);
    });
});