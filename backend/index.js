import express from 'express';
import cors from 'cors';
import { connectToDb } from './db.js';
import articleRoutes from './routes/articles.js';
import searchRoutes from './routes/search.js';
import analysisRoutes from './routes/analysis.js';
import moderationRoutes from './routes/moderation.js';
import scoreRoutes from './routes/scores.js';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

// CORS middleware to allow cross-origin requests (ORIGINAL - LOCAL)
//app.use(cors());

// Apply CORS 
if (process.env.NODE_ENV !== 'production') {
  app.use(cors({
    origin: 'http://localhost:3000', // Allow local frontend
    methods: 'GET,POST,PUT,DELETE,OPTIONS',
  }));
} else {
  // CORS will be handled by Vercel (vercel.json) during production
}

// Middleware to parse JSON bodies
app.use(express.json());

// Use environment variable PORT, or default to 8000
const PORT = process.env.PORT || 8000;

// Routes
app.use('/api/articles', articleRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/analysis', analysisRoutes);
app.use('/api/moderation', moderationRoutes);
app.use('/api/scores', scoreRoutes);

// Connect to the database and start the server
connectToDb(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});
