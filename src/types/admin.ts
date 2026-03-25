export type AdminRole = "ADMIN" | "USER";

export interface AdminUser {
  userSpaces: any;
  id: string;
  email: string;
  firstName: string;
  password:string;
  lastName?: string | null;
  role: AdminRole;
  isActive: boolean;
  createdAt: string;

  message?: string;
}

export interface CreateUserPayload {
  email: string;
  firstName: string;
  lastName?: string;
}

export interface CreateUserResponse {
  id: string;
  email: string;
  firstName: string;
  lastName?: string;
  message: string;
}

export interface UpdateUserPayload {
  isActive: boolean;
}
