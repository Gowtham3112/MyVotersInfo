export interface Category {
  id: number;
  name: string;
}

export interface Part {
  id: number;
  name: string;
  description?: string | null;
  categoryId: number;
  createdAt: string;

  category?: Category;
}

// -------- CREATE --------
export interface CreatePartPayload {
  name: string;
  description?: string;
  categoryId: number | string;
}

export interface CreatePartResponse {
  message: string;
  part: Part;
}

// -------- UPDATE --------
export interface UpdatePartPayload {
  name?: string;
  description?: string;
  categoryId?: number | string;
}

// -------- PAGINATION RESPONSE --------
export interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface PartPaginationResponse {
  data: Part[];
  pagination: Pagination;
}