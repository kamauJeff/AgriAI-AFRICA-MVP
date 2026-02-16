import { Request, Response } from 'express';
import prisma from '../config/db';

const allowedSoilTypes = ['clay', 'sandy', 'loamy'];

export const createFarm = async (req: any, res: Response) => {
  const { name, location } = req.body;
  try {
    const farm = await prisma.farm.create({
      data: { name, location, userId: req.user.id }
    });
    res.status(201).json(farm);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create farm' });
  }
};

export const getFarms = async (req: any, res: Response) => {
  const farms = await prisma.farm.findMany({
    where: { userId: req.user.id },
    include: { fields: true }
  });
  res.json(farms);
};

export const getFarmById = async (req: any, res: Response) => {
  const farm = await prisma.farm.findFirst({
    where: { id: req.params.id, userId: req.user.id },
    include: { fields: true }
  });
  if (!farm) return res.status(404).json({ error: 'Farm not found' });
  res.json(farm);
};

export const updateFarm = async (req: any, res: Response) => {
  const { name, location } = req.body;
  const farm = await prisma.farm.findFirst({
    where: { id: req.params.id, userId: req.user.id }
  });
  if (!farm) return res.status(404).json({ error: 'Farm not found' });

  const updated = await prisma.farm.update({
    where: { id: req.params.id },
    data: { name, location }
  });
  res.json(updated);
};

export const deleteFarm = async (req: any, res: Response) => {
  const farm = await prisma.farm.findFirst({
    where: { id: req.params.id, userId: req.user.id }
  });
  if (!farm) return res.status(404).json({ error: 'Farm not found' });

  await prisma.farm.delete({ where: { id: req.params.id } });
  res.json({ message: 'Farm removed' });
};

export const createField = async (req: any, res: Response) => {
  const { name, area, soilType, crop } = req.body;
  const farmId = req.params.farmId;

  if (!allowedSoilTypes.includes(soilType)) {
    return res.status(400).json({ error: 'Invalid soil type' });
  }

  const farm = await prisma.farm.findFirst({
    where: { id: farmId, userId: req.user.id }
  });
  if (!farm) return res.status(404).json({ error: 'Farm not found' });

  const field = await prisma.field.create({
    data: { name, area, soilType, crop, farmId }
  });
  res.status(201).json(field);
};

export const updateField = async (req: any, res: Response) => {
  const { name, area, soilType, crop } = req.body;
  const fieldId = req.params.fieldId;

  if (soilType && !allowedSoilTypes.includes(soilType)) {
    return res.status(400).json({ error: 'Invalid soil type' });
  }

  const field = await prisma.field.findFirst({
    where: {
      id: fieldId,
      farm: { userId: req.user.id }
    }
  });
  if (!field) return res.status(404).json({ error: 'Field not found' });

  const updated = await prisma.field.update({
    where: { id: fieldId },
    data: { name, area, soilType, crop }
  });
  res.json(updated);
};

export const deleteField = async (req: any, res: Response) => {
  const fieldId = req.params.fieldId;
  const field = await prisma.field.findFirst({
    where: {
      id: fieldId,
      farm: { userId: req.user.id }
    }
  });
  if (!field) return res.status(404).json({ error: 'Field not found' });

  await prisma.field.delete({ where: { id: fieldId } });
  res.json({ message: 'Field removed' });
};