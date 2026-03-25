// ---------------- AREA TYPE ----------------
export interface Area {
  id: number;
  name: string; // Area Name
  description?: string;
  categoryId: number;
  partId: number;
  wardId: number;
  createdAt: string;

  category?: { id: number; name: string }; // Optional included relation
  part?: { id: number; name: string };
  ward?: { id: number; wardNo: string };
}

// ---------------- CREATE AREA PAYLOAD ----------------
export interface CreateAreaPayload {
  name: string;
  description?: string;
  categoryId: number;
  partId: number;
  wardId: number;
}

// ---------------- CREATE AREA RESPONSE ----------------
export interface CreateAreaResponse {
  message: string;
  area: Area;
}

// ---------------- UPDATE AREA PAYLOAD ----------------
export interface UpdateAreaPayload {
  name: string;
  description?: string;
  categoryId: number;
  partId: number;
  wardId: number;
}

// ---------------- PAGINATION RESPONSE ----------------
export interface AreaPaginationResponse {
  data: Area[];
  pagination: {
    totalRecords: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
