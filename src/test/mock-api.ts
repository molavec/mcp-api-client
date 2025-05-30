import express from 'express'; 
import type { Express, Request, Response } from 'express';
import { Server } from 'http';

interface User {
  id: string;
  name: string;
  email: string;
  [key: string]: any;
}

const users: User[] = [
  { id: '1', name: 'John Doe', email: 'john@example.com' },
  { id: '2', name: 'Jane Smith', email: 'jane@example.com' },
  { id: '3', name: 'Alice Johnson', email: 'alice.johnson@example.com' },
  { id: '4', name: 'Bob Brown', email: 'bob.brown@example.com' },
  { id: '5', name: 'Charlie Green', email: 'charlie.green@example.com' },
  { id: '6', name: 'Diana Prince', email: 'diana.prince@example.com' },
  { id: '7', name: 'Eve Black', email: 'eve.black@example.com' },
  { id: '8', name: 'Frank White', email: 'frank.white@example.com' },
  { id: '9', name: 'Grace Lee', email: 'grace.lee@example.com' },
  { id: '10', name: 'Henry Ford', email: 'henry.ford@example.com' },
  { id: '11', name: 'Ivy Walker', email: 'ivy.walker@example.com' },
  { id: '12', name: 'Jack King', email: 'jack.king@example.com' },
  { id: '13', name: 'Karen Scott', email: 'karen.scott@example.com' },
  { id: '14', name: 'Leo Turner', email: 'leo.turner@example.com' },
  { id: '15', name: 'Mona Lisa', email: 'mona.lisa@example.com' },
  { id: '16', name: 'Nina Simone', email: 'nina.simone@example.com' },
  { id: '17', name: 'Oscar Wilde', email: 'oscar.wilde@example.com' },
  { id: '18', name: 'Paul Allen', email: 'paul.allen@example.com' },
  { id: '19', name: 'Quinn Fox', email: 'quinn.fox@example.com' },
  { id: '20', name: 'Rita Hayworth', email: 'rita.hayworth@example.com' }
];

const HOME_HTML = `
  <!DOCTYPE html>
  <html lang="es">
  <head>
    <meta charset="UTF-8">
    <title>MCP-API-Client</title>
    <style>
      body { font-family: sans-serif; margin: 2em; background: #f9f9f9; }
      .container { max-width: 600px; margin: auto; background: #fff; padding: 2em; border-radius: 8px; box-shadow: 0 2px 8px #0001; }
      h1 { color: #2c3e50; }
      a { color: #007acc; text-decoration: none; }
      a:hover { text-decoration: underline; }
    </style>
  </head>
  <body>
    <div class="container">
      <h1>MCP-API-Client</h1>
      <p>Este servidor de pruebas simula endpoints de usuario para desarrollo y pruebas de la <b>Model Context Protocol API Client</b>.</p>
      <p>
        <a href="https://github.com/molavec/mcp-api-client" target="_blank">Ver repositorio en GitHub</a>
      </p>
    </div>
  </body>
  </html>
`;

export const startMockServer = (): Promise<Server> => {
  const app: Express = express();
  app.use(express.json());

  // GET / returns a simple message
  app.get('/', (_req: Request, res: Response) => {
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.send(HOME_HTML);
  });

  // GET /users (no parameters and with pagination)
  app.get('/users', (req: Request, res: Response) => {
    let result = [...users];
    const { page, limit } = req.query;
    if (page !== undefined && limit !== undefined) {
      const p = parseInt(page as string);
      const l = parseInt(limit as string);
      result = result.slice((p - 1) * l, p * l);
    }
    res.json(result);
  });

  // GET /users/:id (with or without includePosts)
  app.get('/users/:id', (req: Request, res: Response) => {
    const user = users.find(u => u.id === req.params.id);
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  });

  // POST /users
  app.post('/users', (req: Request, res: Response) => {
    const newUser: User = { id: String(users.length + 1), ...req.body };
    users.push(newUser);
    res.status(201).json(newUser);
  });

  // PATCH /users/:id
  app.patch('/users/:id', (req: Request, res: Response) => {
    const idx = users.findIndex(u => u.id === req.params.id);
    if (idx !== -1) {
      users[idx] = { ...users[idx], ...req.body };
      res.json(users[idx]);
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  });

  // PUT /users/:id
  app.put('/users/:id', (req: Request, res: Response) => {
    const idx = users.findIndex(u => u.id === req.params.id);
    if (idx !== -1) {
      users[idx] = { ...req.body, id: req.params.id };
      res.json(users[idx]);
    } else {
      const newUser: User = { ...req.body, id: req.params.id };
      users.push(newUser);
      res.status(201).json(newUser);
    }
  });

  // DELETE /users/:id
  app.delete('/users/:id', (req: Request, res: Response) => {
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
