import type {
  AdminUser,
  CreateUserPayload,
  CreateUserResponse,
  UpdateUserPayload,
} from "../../types/admin";
import { apiCall } from "../apiClient";

// Create user
export const createUserAPI = async (
  data: CreateUserPayload,
): Promise<CreateUserResponse> => {
  return await apiCall<CreateUserResponse>("post", "/admin/users", data);
};

// Get all users
export const getAllUsersAPI = async (): Promise<AdminUser[]> => {
  return await apiCall<AdminUser[]>("get", "/admin/users");
};

// Delete user by id
export const deleteUserAPI = async (
  id: string,
): Promise<{ message: string }> => {
  return await apiCall<{ message: string }>("delete", `/admin/users/${id}`);
};

// UPDATED
export const updateUserAPI = async (
  id: string,
  data: UpdateUserPayload,
): Promise<AdminUser> => {
  return await apiCall<AdminUser>("patch", `/admin/users/${id}/status`, data);
};
