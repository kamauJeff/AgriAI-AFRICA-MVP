import apiClient from '../client';

export const getPrices = (crop?: string, region?: string) => {
  const params = new URLSearchParams();
  if (crop) params.append('crop', crop);
  if (region) params.append('region', region);
  return apiClient.get(`/market/prices?${params.toString()}`);
};
export const getCrops = () => apiClient.get('/market/crops');
export const getRegions = () => apiClient.get('/market/regions');