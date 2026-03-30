import type { VoterPaginationResponse } from "../../types/search";
import { apiCall } from "../apiClient";

// ---------------- SEARCH VOTERS ----------------
export const searchVotersAPI = async (
  type: string,
  query: string,
  search: string,
  page: number,
  limit: number,
): Promise<VoterPaginationResponse> => {
  return await apiCall<VoterPaginationResponse>(
    "get",
    `/search/search?type=${type}&query=${query}&search=${search}&page=${page}&limit=${limit}`,
  );
};
