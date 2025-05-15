import express from 'express';

const users = [
  { id: '1', name: 'John Doe', email: 'john@example.com' },
  { id: '2', name: 'Jane Smith', email: 'jane@example.com' }
];

export function startMockServer() {
  const app = express();
  app.use(express.json());

  app.get('/users/:id', (req, res) => {
    const user = users.find(u => u.id === req.params.id);
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  });

  app.post('/users', (req, res) => {
    const newUser = { id: String(users.length + 1), ...req.body };
    users.push(newUser);
    res.status(201).json(newUser);
  });

  // Return a Promise that resolves with the server instance
  return new Promise((resolve) => {
    const server = app.listen(3000, () => {
      console.log('Mock API server running at http://localhost:3000');
      resolve(server);
    });
  });
}
