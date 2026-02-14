import express from 'express';
import { protect } from '../middleware/auth';
import { getPrediction } from '../controllers/aiController';

const router = express.Router();

router.post('/predict', protect, getPrediction);

export default router;