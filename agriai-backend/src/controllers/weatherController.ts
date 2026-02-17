import { Request, Response } from 'express';
import prisma from '../config/db';
import { getForecast } from '../services/weatherService';

export const getFarmForecast = async (req: any, res: Response) => {
  const farmId = req.params.farmId;
  const farm = await prisma.farm.findFirst({
    where: { id: farmId, userId: req.user.id },
  });
  if (!farm) return res.status(404).json({ error: 'Farm not found' });
  if (!farm.lat || !farm.lon) {
    return res.status(400).json({ error: 'Farm location not set' });
  }
  try {
    const forecast = await getForecast(farm.lat, farm.lon);
    res.json(forecast);
  } catch (err) {
    res.status(500).json({ error: 'Weather service unavailable' });
  }
};

// Optional: set farm location
export const setFarmLocation = async (req: any, res: Response) => {
  const { lat, lon } = req.body;
  const farmId = req.params.farmId;
  const farm = await prisma.farm.updateMany({
    where: { id: farmId, userId: req.user.id },
    data: { lat, lon },
  });
  if (farm.count === 0) return res.status(404).json({ error: 'Farm not found' });
  res.json({ message: 'Location updated' });
};