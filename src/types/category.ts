export interface Category {
  id: number;
  name: string;
  description?: string;
  createdAt: string;
}

// CREATE
export interface CreateCategoryPayload {
  name: string;
  description?: string;
}

export interface CreateCategoryResponse {
  message: string;
  category: Category;
}

// UPDATE
export interface UpdateCategoryPayload {
  name?: string;
  description?: string;
}