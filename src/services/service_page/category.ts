import type {
  Category,
  CreateCategoryPayload,
  CreateCategoryResponse,
  UpdateCategoryPayload,
} from "../../types/category";

import { apiCall } from "../apiClient";

// ---------------- GET ALL CATEGORIES ----------------
export const getAllCategoriesAPI = async (): Promise<Category[]> => {
  return await apiCall<Category[]>("get", "/categories");
};

// ---------------- CREATE CATEGORY ----------------
export const createCategoryAPI = async (
  data: CreateCategoryPayload,
): Promise<CreateCategoryResponse> => {
  return await apiCall<CreateCategoryResponse>("post", "/categories", data);
};

// ---------------- UPDATE CATEGORY ----------------
export const updateCategoryAPI = async (
  id: number,
  data: UpdateCategoryPayload,
): Promise<Category> => {
  return await apiCall<Category>("patch", `/categories/${id}`, data);
};

// ---------------- DELETE CATEGORY ----------------
export const deleteCategoryAPI = async (
  id: number,
): Promise<{ message: string }> => {
  return await apiCall<{ message: string }>("delete", `/categories/${id}`);
};