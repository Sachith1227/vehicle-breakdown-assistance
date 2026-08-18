import api from "./api";

export const getPendingRequests = async () => {
  const response = await api.get(
    "/requests/pending"
  );

  return response.data;
};


export const getMyAssignedRequests = async () => {
  const response = await api.get(
    "/requests/my-assigned"
  );

  return response.data;
};


export const acceptRequest = async (
  id: number
) => {
  const response = await api.patch(
    `/requests/${id}/accept`
  );

  return response.data;
};


export const updateRequestStatus = async (
  id: number,
  status: string
) => {
  const response = await api.patch(
    `/requests/${id}/status`,
    {
      status,
    }
  );

  return response.data;
};