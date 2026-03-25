import type { Category } from "./category";
import type { Part } from "./part";


// ---------------- WARD ----------------
export interface Ward {
  id: number;
  wardNo: string;
  description?: string;
  categoryId: number;
  partId: number;
  createdAt: string;

  category?: Category;
  part?: Part;
}


// ---------------- CREATE WARD ----------------
export interface CreateWardPayload {
  wardNo: string;
  description?: string;
  categoryId: number;
  partId: number;
}

export interface CreateWardResponse {
  message: string;
  ward: Ward;
}


// ---------------- UPDATE WARD ----------------
export interface UpdateWardPayload {
  wardNo?: string;
  description?: string;
  categoryId?: number;
  partId?: number;
}


// ---------------- PAGINATION RESPONSE ----------------
export interface WardPaginationResponse {
  data: Ward[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}