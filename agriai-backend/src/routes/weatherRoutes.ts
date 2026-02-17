import express from 'express';
import { protect } from '../middleware/auth';
import { getFarmForecast, setFarmLocation } from '../controllers/weatherController';

const router = express.Router();

router.use(protect);

router.get('/forecast/:farmId', getFarmForecast);
router.post('/location/:farmId', setFarmLocation);

export default router;