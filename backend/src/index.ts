import 'dotenv/config';
import express, { Request, Response } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import path from 'path';
import { connectDB } from './config/database';
import { ensureAdminUser } from './config/seed';
import { ensureLeaderboardSeed } from './config/seedLeaderboard';
import { generalLimiter } from './middleware/rateLimiter';
import adminRouter from './routes/admin';
import applicationsRouter from './routes/applications';
import leaderboardRouter from './routes/leaderboard';
import certificatesRouter from './routes/certificates';

const app = express();
// Enable trust proxy for Render, Vercel, and Cloudflare reverse proxies
app.set('trust proxy', 1);

const PORT = process.env.PORT || 5000;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';
const allowedOrigins = FRONTEND_URL.split(',').map((u) => u.trim());

// Security middleware
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
    crossOriginEmbedderPolicy: false,
    contentSecurityPolicy: false,
  })
);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (
        FRONTEND_URL === '*' ||
        allowedOrigins.includes(origin) ||
        origin.endsWith('.vercel.app') ||
        origin.includes('localhost')
      ) {
        return callback(null, true);
      }
      return callback(null, true);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(generalLimiter);

// Health check
app.get('/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok', service: 'SSAP Backend', time: new Date().toISOString() });
});

// API routes
app.use('/api/admin', adminRouter);
app.use('/api/applications', applicationsRouter);
app.use('/api/leaderboard', leaderboardRouter);
app.use('/api/certificates', certificatesRouter);

// Serve uploaded files (with explicit CORS and byte range streaming for video playback)
app.use(
  '/uploads',
  express.static(path.join(process.cwd(), 'uploads'), {
    setHeaders: (res) => {
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
      res.setHeader('Accept-Ranges', 'bytes');
    },
  })
);

// 404 handler
app.use((_req: Request, res: Response) => {
  res.status(404).json({ error: 'Not found' });
});

// Global error handler
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('Unhandled error:', err.message);
  res.status(500).json({ error: 'An unexpected error occurred' });
});

// Start server
(async () => {
  await connectDB();
  await ensureAdminUser();
  await ensureLeaderboardSeed();
  app.listen(PORT, () => {
    console.log(`🚀 SSAP Backend running on port ${PORT}`);
    console.log(`   Health check: http://localhost:${PORT}/health`);
  });
})();

export default app;
