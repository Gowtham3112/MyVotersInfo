import type {
  Part,
  CreatePartPayload,
  CreatePartResponse,
  UpdatePartPayload,
  PartPaginationResponse,
} from "../../types/part";

import { apiCall } from "../apiClient";


// ---------------- GET ALL PARTS ----------------
export const getAllPartsAPI = async (): Promise<Part[]> => {
  return await apiCall<Part[]>("get", "/parts/all");
};


// ---------------- GET PARTS (PAGINATION + SEARCH) ----------------
export const getPartsAPI = async (
  page: number = 1,
  limit: number = 10,
  search: string = "",
): Promise<PartPaginationResponse> => {
  return await apiCall<PartPaginationResponse>(
    "get",
    `/parts?page=${page}&limit=${limit}&search=${search}`,
  );
};


// ---------------- CREATE PART ----------------
export const createPartAPI = async (
  data: CreatePartPayload,
): Promise<CreatePartResponse> => {
  return await apiCall<CreatePartResponse>("post", "/parts", data);
};


// ---------------- UPDATE PART ----------------
export const updatePartAPI = async (
  id: number,
  data: UpdatePartPayload,
): Promise<Part> => {
  return await apiCall<Part>("patch", `/parts/${id}`, data);
};


// ---------------- DELETE PART ----------------
export const deletePartAPI = async (
  id: number,
): Promise<{ message: string }> => {
  return await apiCall<{ message: string }>("delete", `/parts/${id}`);
};

// ---------------- GET PARTS BY CATEGORY ----------------
export const getPartsByCategoryAPI = async (categoryId: number): Promise<Part[]> => {
  return await apiCall<Part[]>("get", `/parts/category/${categoryId}`);
};