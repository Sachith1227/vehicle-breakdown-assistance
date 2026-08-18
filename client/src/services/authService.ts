import api from "./api";

interface RegisterData {
  name: string;
  email: string;
  password: string;

  // User role
  role: "DRIVER" | "SERVICE_PROVIDER";

  // Service provider fields
  phone?: string;
  businessName?: string;
  address?: string;
}

export const loginUser = async (data: {
  email: string;
  password: string;
}) => {
  const response = await api.post(
    "/auth/login",
    data
  );

  return response.data;
};

export const registerUser = async (
  data: RegisterData
) => {
  const response = await api.post(
    "/auth/register",
    data
  );

  return response.data;
};