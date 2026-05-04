// Mock PostgreSQL for testing
const mockQuery = jest.fn();

const mockPool = {
  query: mockQuery,
  connect: jest.fn(),
  end: jest.fn(),
};

// Mock successful response for GET /api/todos
mockQuery.mockResolvedValue({
  rows: [
    { id: 1, title: 'Test Todo 1', completed: false },
    { id: 2, title: 'Test Todo 2', completed: true },
  ],
});

module.exports = { Pool: jest.fn(() => mockPool) };