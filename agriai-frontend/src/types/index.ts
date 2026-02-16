export interface User {
  id: string;
  email: string;
  name: string;
}

export interface Farm {
  id: string;
  name: string;
  location: string;
  userId: string;
  fields: Field[];
  createdAt: string;
  updatedAt: string;
}

export interface Field {
  id: string;
  name: string;
  area: number;
  soilType: 'clay' | 'sandy' | 'loamy';
  crop?: string;
  farmId: string;
  createdAt: string;
  updatedAt: string;
}