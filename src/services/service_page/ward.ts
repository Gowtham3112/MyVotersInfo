import type {
  Ward,
  CreateWardPayload,
  CreateWardResponse,
  UpdateWardPayload,
  WardPaginationResponse,
} from "../../types/ward";

import { apiCall } from "../apiClient";

// ---------------- GET ALL WARDS ----------------
export const getAllWardsAPI = async (): Promise<Ward[]> => {
  return await apiCall<Ward[]>("get", "/wards/all");
};

// ---------------- GET WARDS (PAGINATION + SEARCH) ----------------
export const getWardsAPI = async (
  page: number = 1,
  limit: number = 10,
  search: string = "",
): Promise<WardPaginationResponse> => {
  return await apiCall<WardPaginationResponse>(
    "get",
    `/wards?page=${page}&limit=${limit}&search=${search}`,
  );
};

// ---------------- CATEGORY BASED WARDS ----------------
export const getWardsByCategoryAPI = async (
  categoryId: number,
  partId: number,
): Promise<Ward[]> => {
  return await apiCall<Ward[]>(
    "get",
    `/wards/category?categoryId=${categoryId}&partId=${partId}`,
  );
};

// ---------------- CREATE WARD ----------------
export const createWardAPI = async (
  data: CreateWardPayload,
): Promise<CreateWardResponse> => {
  return await apiCall<CreateWardResponse>("post", "/wards", data);
};

// ---------------- UPDATE WARD ----------------
export const updateWardAPI = async (
  id: number,
  data: UpdateWardPayload,
): Promise<Ward> => {
  return await apiCall<Ward>("patch", `/wards/${id}`, data);
};

// ---------------- DELETE WARD ----------------
export const deleteWardAPI = async (
  id: number,
): Promise<{ message: string }> => {
  return await apiCall<{ message: string }>("delete", `/wards/${id}`);
};
