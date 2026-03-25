import type { AuthResponse, LoginPayload } from "../../types/auth";
import { apiCall } from "../apiClient";

export const loginAPI = async (data: LoginPayload): Promise<AuthResponse> => {
  const response = await apiCall<AuthResponse>("post", "/auth/login", data);

  if (response.token) {
    localStorage.setItem("authToken", response.token);
  }

  return response;
};
