import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';

// Load environment variables
dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middleware
  app.use(express.json({ limit: '10mb' }));

  // CORS for local development and production
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.header(
      'Access-Control-Allow-Headers',
      'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
    );
    if (req.method === 'OPTIONS') {
      return res.status(200).end();
    }
    next();
  });

  // General Application Health Endpoint (Non-AI)
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      environment: process.env.NODE_ENV || 'production',
      time: new Date().toISOString(),
    });
  });

  // Reject unsupported methods or missing endpoints under /api/*
  app.all('/api/*', (req, res) => {
    res.status(404).json({ error: `Endpoint ${req.path} not found` });
  });

  // Vite middleware in dev / Static serving in production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`All India Sarkari Server running on http://localhost:${PORT}`);
  });
}

startServer();
