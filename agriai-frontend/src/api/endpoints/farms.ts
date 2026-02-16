import apiClient from '../client';
import type { Farm, Field } from '../../types';

// Farm endpoints
export const getFarms = () => apiClient.get<Farm[]>('/farms');
export const getFarm = (id: string) => apiClient.get<Farm>(`/farms/${id}`);
export const createFarm = (data: { name: string; location: string }) =>
  apiClient.post('/farms', data);
export const updateFarm = (id: string, data: { name: string; location: string }) =>
  apiClient.put(`/farms/${id}`, data);
export const deleteFarm = (id: string) => apiClient.delete(`/farms/${id}`);

// Field endpoints – corrected types
export const createField = (
  farmId: string,
  data: Omit<Field, 'id' | 'farmId' | 'createdAt' | 'updatedAt'>
) => apiClient.post(`/farms/${farmId}/fields`, data);

export const updateField = (
  fieldId: string,
  data: Partial<Omit<Field, 'id' | 'farmId' | 'createdAt' | 'updatedAt'>>
) => apiClient.put(`/fields/${fieldId}`, data);

export const deleteField = (fieldId: string) => apiClient.delete(`/fields/${fieldId}`);