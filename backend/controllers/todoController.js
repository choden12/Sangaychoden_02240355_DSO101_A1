const pool = require('../config/db');

// Get all todos
const getTodos = async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT id, title, completed, created_at, updated_at FROM todos ORDER BY created_at DESC'
        );
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    }
};

// Create a new todo
const createTodo = async (req, res) => {
    const { title } = req.body;
    if (!title || title.trim() === '') {
        return res.status(400).json({ error: 'Title is required' });
    }

    try {
        const result = await pool.query(
            'INSERT INTO todos (title) VALUES ($1) RETURNING id, title, completed, created_at, updated_at',
            [title.trim()]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    }
};

// Update a todo (partial update allowed)
const updateTodo = async (req, res) => {
    const { id } = req.params;
    const { title, completed } = req.body;

    // Build dynamic SET clause
    const fields = [];
    const values = [];
    let idx = 1;

    if (title !== undefined) {
        fields.push(`title = $${idx++}`);
        values.push(title.trim());
    }
    if (completed !== undefined) {
        fields.push(`completed = $${idx++}`);
        values.push(completed);
    }

    if (fields.length === 0) {
        return res.status(400).json({ error: 'No fields to update' });
    }

    values.push(id); // for WHERE id = $last
    const query = `UPDATE todos SET ${fields.join(', ')} WHERE id = $${idx} RETURNING id, title, completed, created_at, updated_at`;

    try {
        const result = await pool.query(query, values);
        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Todo not found' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    }
};

// Delete a todo
const deleteTodo = async (req, res) => {
    const { id } = req.params;

    try {
        const result = await pool.query('DELETE FROM todos WHERE id = $1', [id]);
        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Todo not found' });
        }
        res.status(204).send(); // No content
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    }
};

module.exports = {
    getTodos,
    createTodo,
    updateTodo,
    deleteTodo,
};