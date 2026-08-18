import api from "./api";

export interface BreakdownRequestInput {
  vehicleId: number;
  problemType: string;
  description?: string;
  latitude: number;
  longitude: number;
}

export const createBreakdownRequest = async (
  data: BreakdownRequestInput
) => {
  const response = await api.post("/requests", data);

  return response.data;
};

export const getMyRequests = async () => {
  const response = await api.get("/requests");

  return response.data;
};

export const getRequestById = async (id: number) => {
  const response = await api.get(`/requests/${id}`);

  return response.data;
};

export const cancelRequest = async (id: number) => {
  const response = await api.patch(
    `/requests/${id}/cancel`
  );

  return response.data;
};