import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import authService from "../services/authService";
import type { AuthUser, LoginRequest } from "../types/auth.types";
interface AuthContextValue {
  user: AuthUser | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  login: (credentials: LoginRequest) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(authService.getCurrentUser());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = useCallback(async (credentials: LoginRequest) => {
    setLoading(true);
    setError(null);
    try {
      const data = await authService.login(credentials);
      authService.persistSession(data);
      setUser({
        id: data.id,
        fullName: data.fullName,
        email: data.email,
        role: data.role,
      });
    } catch (err: any) {
      const message =
        typeof err?.response?.data === "string"
          ? err.response.data
          : err?.response?.data?.message ||
            err?.response?.data?.error ||
            "Invalid email or password.";
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    authService.logout();
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: Boolean(user),
        loading,
        error,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextValue => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
};