jimport express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import authRoutes from './routes/auth.routes.js';
import taskRoutes from './routes/task.routes.js';
import aiRoutes from './routes/ai.routes.js';
import plannerRoutes from './routes/planner.routes.js';
import analyticsRoutes from './routes/analytics.routes.js';

const app = express();
app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173', credentials: true }));
app.use(express.json({ limit: '1mb' }));
app.use(cookieParser());
app.use('/api/auth', rateLimit({ windowMs: 15 * 60 * 1000, limit: 30 }), authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/ai', rateLimit({ windowMs: 60 * 1000, limit: 20 }), aiRoutes);
app.use('/api/planner', plannerRoutes);
app.use('/api/analytics', analyticsRoutes);
app.get('/api/health', (_req, res) => res.json({ success: true, name: 'MONOLOGUE API' }));
app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(err.status || 500).json({ success: false, message: err.message || 'Server error' });
});
export default app;
