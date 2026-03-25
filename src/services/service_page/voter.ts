import axios from "axios";
import type { Voter, VoterPaginationResponse } from "../../types/voter";
import { apiCall } from "../apiClient";

// ---------------- GET ALL VOTERS ----------------

export const getAllVotersAPI = async (): Promise<Voter[]> => {
  return await apiCall<Voter[]>("get", "/voters/all");
};

// ---------------- GET VOTERS PAGINATED ----------------

export const getVotersPaginatedAPI = async (
  page: number = 1,
  limit: number = 10,
  search: string = "",
): Promise<VoterPaginationResponse> => {
  return await apiCall<VoterPaginationResponse>(
    "get",
    `/voters/paginated?page=${page}&limit=${limit}&search=${search}`,
  );
};

// ---------------- CREATE VOTER ----------------

export const createVoterAPI = async (data: FormData) => {
  return apiCall("post", "/voters", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

// ---------------- UPDATE VOTER ----------------

export const updateVoterAPI = async (id: number, data: FormData) => {
  return apiCall("patch", `/voters/${id}`, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

// ---------------- DELETE VOTER ----------------

export const deleteVoterAPI = async (
  id: number,
): Promise<{ message: string }> => {
  return await apiCall<{ message: string }>("delete", `/voters/${id}`);
};

// ---------------- EXPORT EXCEL ----------------

export const exportVotersExcelAPI = async (
  page: number,
  limit: number,
  search: string,
): Promise<Blob> => {
  const query = `?page=${page}&limit=${limit}&search=${encodeURIComponent(search)}`;

  return await apiCall<Blob>("get", `/voters/export/excel${query}`, undefined, {
    responseType: "blob",
  });
};

export const exportVotersPDFAPI = async (
  page: number,
  limit: number,
  search: string
) => {
  const res = await axios.get(
    `/api/voters/export/pdf?page=${page}&limit=${limit}&search=${search}`,
    {
      responseType: "blob",
    }
  );

  return res.data;
};