export interface LoginPayload {
  email: string;
  password: string;
}

export interface AuthResponse {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  isActive: boolean;
  token: string;
}
