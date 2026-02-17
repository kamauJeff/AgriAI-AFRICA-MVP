import { Request, Response } from 'express';
import prisma from '../config/db';

export const getLatestPrices = async (req: Request, res: Response) => {
  const { crop, region } = req.query;
  const where: any = {};
  if (crop) where.crop = crop;
  if (region) where.region = region;
  const prices = await prisma.cropPrice.findMany({
    where,
    orderBy: { date: 'desc' },
    take: 20,
  });
  res.json(prices);
};

export const getCrops = async (req: Request, res: Response) => {
  const crops = await prisma.cropPrice.findMany({
    select: { crop: true },
    distinct: ['crop'],
  });
  res.json(crops.map(c => c.crop));
};

export const getRegions = async (req: Request, res: Response) => {
  const regions = await prisma.cropPrice.findMany({
    select: { region: true },
    distinct: ['region'],
  });
  res.json(regions.map(r => r.region));
};