import apiClient from '../client';

export const getPrediction = (data: { soilType: string; area: number; crop?: string }) =>
  apiClient.post('/ai/predict', data);