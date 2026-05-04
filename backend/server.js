require('dotenv').config();
const express = require('express');
const cors = require('cors');
const todoRoutes = require('./routes/todos');

const app = express();
const PORT = process.env.PORT || 5000;

app.get('/', (req, res) => {
    res.send('Todo API is running.');
});

// Middleware
app.use(cors()); // Allow requests from frontend
app.use(express.json()); // Parse JSON bodies

// Routes
app.use('/api/todos', todoRoutes);

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'OK' });
});

// Global error handler (optional)
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(PORT, () => {
console.log(`Server running at http://localhost:${PORT}`);
});

module.exports = app;