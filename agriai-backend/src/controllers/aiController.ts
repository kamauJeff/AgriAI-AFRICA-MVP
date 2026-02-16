import { Request, Response } from 'express';

export const getPrediction = async (req: Request, res: Response) => {
  const { soilType, area, crop } = req.body;

  const baseYield = soilType === 'loamy' ? 3.0 : soilType === 'clay' ? 2.2 : 1.8;
  const predictedYield = (area * baseYield).toFixed(1);
  const confidence = 0.85;

  let recommendation = '';
  if (soilType === 'loamy') {
    recommendation = 'Loamy soil is ideal for maize and wheat.';
  } else if (soilType === 'clay') {
    recommendation = 'Clay soil retains water; consider rice or leafy greens.';
  } else {
    recommendation = 'Sandy soil drains quickly; try root vegetables with irrigation.';
  }

  res.json({ predictedYield: `${predictedYield} tons`, confidence, recommendation });
};