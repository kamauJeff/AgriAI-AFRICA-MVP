import apiClient from '../client';

export const getFarmForecast = (farmId: string) =>
  apiClient.get(`/weather/forecast/${farmId}`);

export const setFarmLocation = (farmId: string, lat: number, lon: number) =>
  apiClient.post(`/weather/location/${farmId}`, { lat, lon });