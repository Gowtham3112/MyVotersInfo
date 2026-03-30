import type {
  Area,
  CreateAreaPayload,
  CreateAreaResponse,
  UpdateAreaPayload,
  AreaPaginationResponse,
} from "../../types/area";

import { apiCall } from "../apiClient";

// ---------------- GET ALL AREAS ----------------
export const getAllAreasAPI = async (): Promise<Area[]> => {
  return await apiCall<Area[]>("get", "/areas/all");
};

// ---------------- GET AREAS (PAGINATION + SEARCH) ----------------
export const getAreasPaginatedAPI = async (
  page = 1,
  limit = 10,
  search = "",
  sortBy = "createdAt",
  order = "desc"
): Promise<AreaPaginationResponse> => {
  return await apiCall(
    "get",
    `/areas/paginated?page=${page}&limit=${limit}&search=${search}&sortBy=${sortBy}&order=${order}`
  );
};

// ---------------- FILTER AREAS BY CATEGORY / PART / WARD ----------------
export const getAreasByFiltersAPI = async (filters: {
  categoryId?: number;
  partId?: number;
  wardId?: number;
}): Promise<Area[]> => {
  const queryParams = new URLSearchParams();
  if (filters.categoryId)
    queryParams.append("categoryId", String(filters.categoryId));
  if (filters.partId) queryParams.append("partId", String(filters.partId));
  if (filters.wardId) queryParams.append("wardId", String(filters.wardId));

  return await apiCall<Area[]>(
    "get",
    `/areas/filter?${queryParams.toString()}`,
  );
};

// ---------------- CREATE AREA ----------------
export const createAreaAPI = async (
  data: CreateAreaPayload,
): Promise<CreateAreaResponse> => {
  return await apiCall<CreateAreaResponse>("post", "/areas", data);
};

// ---------------- UPDATE AREA ----------------
export const updateAreaAPI = async (
  id: number,
  data: UpdateAreaPayload,
): Promise<Area> => {
  return await apiCall<Area>("patch", `/areas/${id}`, data);
};

// ---------------- DELETE AREA ----------------
export const deleteAreaAPI = async (
  id: number,
): Promise<{ message: string }> => {
  return await apiCall<{ message: string }>("delete", `/areas/${id}`);
};
