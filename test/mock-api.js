import express from 'express';

const users = [
  { id: '1', name: 'John Doe', email: 'john@example.com' },
  { id: '2', name: 'Jane Smith', email: 'jane@example.com' }
];

export const startMockServer = () => {
  const app = express();
  app.use(express.json());

  // GET /users (sin parámetros y con paginación)
  app.get('/users', (req, res) => {
    let result = [...users];
    const { page, limit } = req.query;
    if (page !== undefined && limit !== undefined) {
      const p = parseInt(page);
      const l = parseInt(limit);
      result = result.slice((p - 1) * l, p * l);
    }
    res.json(result);
  });

  // GET /users/:id (con o sin includePosts)
  app.get('/users/:id', (req, res) => {
    const user = users.find(u => u.id === req.params.id);
    if (user) {
      // Simula includePosts si se solicita
      if (req.query.includePosts === 'true' || req.query.includePosts === true) {
        res.json({ ...user, posts: [{ id: 1, title: 'Post de ejemplo' }] });
      } else {
        res.json(user);
      }
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  });

  // POST /users
  app.post('/users', (req, res) => {
    const newUser = { id: String(users.length + 1), ...req.body };
    users.push(newUser);
    res.status(201).json(newUser);
  });

  // PATCH /users/:id
  app.patch('/users/:id', (req, res) => {
    const idx = users.findIndex(u => u.id === req.params.id);
    if (idx !== -1) {
      users[idx] = { ...users[idx], ...req.body };
      res.json(users[idx]);
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  });

  // PUT /users/:id
  app.put('/users/:id', (req, res) => {
    const idx = users.findIndex(u => u.id === req.params.id);
    if (idx !== -1) {
      users[idx] = { ...req.body, id: req.params.id };
      res.json(users[idx]);
    } else {
      // Si no existe, crea el usuario
      const newUser = { ...req.body, id: req.params.id };
      users.push(newUser);
      res.status(201).json(newUser);
    }
  });

  // DELETE /users/:id
  app.delete('/users/:id', (req, res) => {
    const idx = users.findIndex(u => u.id === req.params.id);
    if (idx !== -1) {
      const deleted = users.splice(idx, 1)[0];
      res.json(deleted);
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  });

  // Return a Promise that resolves with the server instance
  return new Promise((resolve) => {
    const server = app.listen(3000, () => {
      console.log('Mock API server running at http://localhost:3000');
      resolve(server);
    });
  });
}
