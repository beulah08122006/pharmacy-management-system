import api from "./api";
import type { LoginRequest, LoginResponse, AuthUser } from "../types/auth.types";

const TOKEN_KEY = "authToken";
const USER_KEY = "authUser";

const login = async (credentials: LoginRequest): Promise<LoginResponse> => {
  const response = await api.post<LoginResponse>("/auth/login", credentials);
  return response.data;
};

const persistSession = (data: LoginResponse): void => {
  localStorage.setItem(TOKEN_KEY, data.token);
  localStorage.setItem(
    USER_KEY,
    JSON.stringify({
      id: data.id,
      fullName: data.fullName,
      email: data.email,
      role: data.role,
    } as AuthUser)
  );
};

const logout = (): void => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
};

const getCurrentUser = (): AuthUser | null => {
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as AuthUser;
  } catch {
    return null;
  }
};

const isAuthenticated = (): boolean => {
  return Boolean(localStorage.getItem(TOKEN_KEY));
};

const authService = {
  login,
  persistSession,
  logout,
  getCurrentUser,
  isAuthenticated,
};

export default authService;