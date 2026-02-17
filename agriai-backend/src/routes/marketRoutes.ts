import express from 'express';
import { protect } from '../middleware/auth';
import { getLatestPrices, getCrops, getRegions } from '../controllers/marketController';

const router = express.Router();

router.use(protect);

router.get('/prices', getLatestPrices);
router.get('/crops', getCrops);
router.get('/regions', getRegions);

export default router;