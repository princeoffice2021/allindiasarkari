import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import {
  isAIConfigured,
  extractOfficialInformationEngine,
  generateFromApprovedFactsEngine,
  generateAIDraftEngine,
  generateAIOutlineEngine,
  generateAISEOEngine,
  generateAIFAQsEngine,
  improveAIContentEngine,
  checkAIFactsEngine,
} from './src/server/aiEngine';

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

  // API Health & Status Endpoints
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', time: new Date().toISOString() });
  });

  app.get('/api/ai/health', (req, res) => {
    const configured = isAIConfigured();
    res.json({
      status: 'ok',
      aiConfigured: configured,
      model: 'gemini-3.7-flash',
      platform: 'All India Sarkari AI Editorial Assistant',
      timestamp: new Date().toISOString(),
    });
  });

  app.get('/api/ai/status', (req, res) => {
    const configured = isAIConfigured();
    res.json({
      configured,
      model: 'gemini-3.7-flash',
      platform: 'All India Sarkari AI Editorial Assistant',
    });
  });

  // =========================================================================
  // WORKFLOW 1: EXTRACT ONLY FACTS FROM RAW OFFICIAL INFORMATION
  // =========================================================================
  app.post('/api/ai/extract-official-information', async (req, res) => {
    try {
      const result = await extractOfficialInformationEngine(req.body);
      return res.json(result);
    } catch (err: any) {
      console.error('Error extracting official information:', err);
      return res.status(500).json({ error: err.message || 'Failed to extract official information' });
    }
  });

  // =========================================================================
  // WORKFLOW 2: GENERATE ARTICLE FROM APPROVED FACTUAL INFORMATION ONLY
  // =========================================================================
  app.post('/api/ai/generate-from-approved-facts', async (req, res) => {
    try {
      const result = await generateFromApprovedFactsEngine(req.body);
      return res.json(result);
    } catch (err: any) {
      console.error('Error generating article from approved facts:', err);
      return res.status(500).json({ error: err.message || 'Failed to generate article from approved facts' });
    }
  });

  // =========================================================================
  // LEGACY & DIRECT AI ASSISTANT ENDPOINTS
  // =========================================================================
  app.post('/api/ai/generate-draft', async (req, res) => {
    try {
      const result = await generateAIDraftEngine(req.body);
      return res.json(result);
    } catch (err: any) {
      console.error('Error generating AI draft:', err);
      return res.status(500).json({ error: err.message || 'Failed to generate AI draft' });
    }
  });

  app.post('/api/ai/generate-outline', async (req, res) => {
    try {
      const result = await generateAIOutlineEngine(req.body);
      return res.json(result);
    } catch (err: any) {
      console.error('Error generating AI outline:', err);
      return res.status(500).json({ error: err.message || 'Failed to generate outline' });
    }
  });

  app.post('/api/ai/generate-seo', async (req, res) => {
    try {
      const result = await generateAISEOEngine(req.body);
      return res.json(result);
    } catch (err: any) {
      console.error('Error generating SEO:', err);
      return res.status(500).json({ error: err.message || 'Failed to generate SEO' });
    }
  });

  app.post('/api/ai/generate-faqs', async (req, res) => {
    try {
      const result = await generateAIFAQsEngine(req.body);
      return res.json(result);
    } catch (err: any) {
      console.error('Error generating FAQs:', err);
      return res.status(500).json({ error: err.message || 'Failed to generate FAQs' });
    }
  });

  app.post('/api/ai/improve-content', async (req, res) => {
    try {
      const result = await improveAIContentEngine(req.body);
      return res.json(result);
    } catch (err: any) {
      console.error('Error improving content:', err);
      return res.status(500).json({ error: err.message || 'Failed to improve content' });
    }
  });

  app.post('/api/ai/check-facts', async (req, res) => {
    try {
      const result = await checkAIFactsEngine(req.body);
      return res.json(result);
    } catch (err: any) {
      console.error('Error checking facts:', err);
      return res.status(500).json({ error: err.message || 'Failed to audit facts' });
    }
  });

  // Reject unsupported methods for /api/* routes
  app.all('/api/*', (req, res) => {
    res.status(405).json({ error: `Method ${req.method} Not Allowed on ${req.path}` });
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
