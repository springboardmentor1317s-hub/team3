// backend/index.js
import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import authRoutes from './routes/auth.routes.js';

const app = express();

// Body parser
app.use(express.json());

// CORS: allow the Vite dev server and allow credentials for future cookie support
app.use(
  cors({
    origin: ['http://localhost:5173'],
    credentials: true
  })
);

// Mount auth routes under /api/auth
app.use('/api/auth', authRoutes);

// Basic healthcheck
app.get('/', (req, res) => {
  res.send('Server Running...');
});

// Connect to MongoDB
if (!process.env.MONGO_URI) {
  console.warn('⚠️  MONGO_URI not set. Set MONGO_URI in .env before running.');
}

mongoose
  .connect(process.env.MONGO_URI || 'mongodb://localhost:27017/campuseventhub')
  .then(() => console.log('✅ MongoDB Connected'))
  .catch((err) => console.error('❌ MongoDB Connection Error:', err));

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
