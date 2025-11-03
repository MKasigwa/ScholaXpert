import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import {
  UserResponseDto,
  LoginDto,
  RegisterDto,
} from "../lib/types/auth-types";
import AuthApi from "../lib/api/auth-api";

interface AuthContextType {
  user: UserResponseDto | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (credentials: LoginDto) => Promise<void>;
  register: (data: RegisterDto) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserResponseDto | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize auth state
  useEffect(() => {
    const initAuth = async () => {
      try {
        if (AuthApi.isAuthenticated()) {
          // Try to get stored user first (faster)
          const storedUser = AuthApi.getStoredUser();
          if (storedUser) {
            setUser(storedUser);
          }

          // Then refresh from API
          try {
            const currentUser = await AuthApi.getCurrentUser();
            setUser(currentUser);
          } catch (apiError) {
            // If API call fails but we have stored user, keep using it
            console.warn(
              "Failed to refresh user from API, using stored user:",
              apiError
            );
            if (!storedUser) {
              // Only clear if we don't have a stored user
              AuthApi.clearAuthData();
              setUser(null);
            }
          }
        }
      } catch (error) {
        console.error("Failed to initialize auth:", error);
        // Clear invalid auth state
        AuthApi.clearAuthData();
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (credentials: LoginDto) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await AuthApi.login(credentials);
      setUser(response.user);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      const errorMessage =
        err?.response?.data?.message || "Login failed. Please try again.";
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: RegisterDto) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await AuthApi.register(data);
      setUser(response.user);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      const errorMessage =
        err?.response?.data?.message ||
        "Registration failed. Please try again.";
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    setError(null);
    try {
      await AuthApi.logout();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error("Logout error:", err);
      // Continue with logout even if API call fails
    } finally {
      setUser(null);
      setIsLoading(false);
    }
  };

  const refreshUser = async () => {
    try {
      const currentUser = await AuthApi.getCurrentUser();
      setUser(currentUser);
    } catch (error) {
      console.error("Failed to refresh user:", error);
      setError("Failed to refresh user data");
      // If refresh fails, logout
      await logout();
    }
  };

  const clearError = () => {
    setError(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        error,
        login,
        register,
        logout,
        refreshUser,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
