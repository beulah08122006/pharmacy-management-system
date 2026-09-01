export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  id: number;
  fullName: string;
  email: string;
  role: string;
  token: string;
  message: string;
}

export interface AuthUser {
  id: number;
  fullName: string;
  email: string;
  role: string;
}