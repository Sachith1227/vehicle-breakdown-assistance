import api from "./api";

export interface Vehicle {
  id: number;
  userId: number;
  registrationNumber: string;
  make: string;
  model: string;
  year: number;
  createdAt: string;
}

export interface VehicleInput {
  registrationNumber: string;
  make: string;
  model: string;
  year: number;
}

export const getVehicles = async () => {
  const response = await api.get("/vehicles");

  return response.data;
};

export const createVehicle = async (
  data: VehicleInput
) => {
  const response = await api.post("/vehicles", data);

  return response.data;
};

export const updateVehicle = async (
  id: number,
  data: VehicleInput
) => {
  const response = await api.put(`/vehicles/${id}`, data);

  return response.data;
};

export const deleteVehicle = async (id: number) => {
  const response = await api.delete(`/vehicles/${id}`);

  return response.data;
};