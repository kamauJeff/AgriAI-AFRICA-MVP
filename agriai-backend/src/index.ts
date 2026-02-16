import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes';
import farmRoutes from './routes/farmRoutes';
import aiRoutes from './routes/aiRoutes';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/farms', farmRoutes);
app.use('/api/ai', aiRoutes);

// Health check
app.get('/', (req, res) => {
  res.send('AgriAI Africa MVP Backend');
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});