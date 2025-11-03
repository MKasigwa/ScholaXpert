import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { getSession } from "next-auth/react";
import { toast } from "sonner";
import { auth } from "./auth";

/**
 * Centralized Axios Instance for API calls
 *
 * This instance is configured to work with NextAuth.js for authentication.
 * - Automatically attaches JWT tokens from NextAuth session
 * - Handles token refresh (if implemented)
 * - Handles 401 errors by redirecting to sign-in
 * - Shows toast notifications for errors
 */

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 30000, // 30 seconds
});

/**
 * Request Interceptor
 * Attaches the JWT token from NextAuth session to every request
 */
api.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    try {
      // For client-side requests
      if (typeof window !== "undefined") {
        const session = await getSession();

        if (session?.accessToken) {
          config.headers.Authorization = `Bearer ${session.accessToken}`;
        }
      }
      // For server-side requests (Server Components, API Routes)
      // else {
      //   const session = await auth();

      //   if (session?.accessToken) {
      //     config.headers.Authorization = `Bearer ${session.accessToken}`;
      //   }
      // }
    } catch (error) {
      console.error("Error getting session in request interceptor:", error);
    }

    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

/**
 * Response Interceptor
 * Handles common error responses, especially 401 Unauthorized
 */
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config;

    // Handle 401 Unauthorized errors
    if (error.response?.status === 401) {
      // Only redirect on client-side
      if (typeof window !== "undefined") {
        // Check if we're not already on an auth page
        const isAuthPage = window.location.pathname.includes("/auth/sign-");

        if (!isAuthPage) {
          // Import signOut dynamically to avoid circular dependencies
          const { signOut } = await import("next-auth/react");

          // Sign out and redirect to sign-in page
          await signOut({
            redirect: true,
            callbackUrl: "/auth/sign-in",
          });
        }
      }
    }

    // Handle 403 Forbidden errors
    if (error.response?.status === 403) {
      console.error("Access forbidden - insufficient permissions");

      if (typeof window !== "undefined") {
        toast.error("Access forbidden - insufficient permissions");
      }
    }

    // Handle 404 Not Found errors
    if (error.response?.status === 404) {
      console.error("Resource not found:", originalRequest?.url);

      if (typeof window !== "undefined") {
        toast.error("Resource not found");
      }
    }

    // Handle 500 Internal Server Error
    if (error.response?.status === 500) {
      console.error("Server error occurred");

      if (typeof window !== "undefined") {
        toast.error("Server error occurred");
      }
    }

    // Handle network errors
    if (!error.response) {
      console.error("Network error - please check your connection");

      if (typeof window !== "undefined") {
        toast.error("Network error - please check your connection");
      }
    }

    return Promise.reject(error);
  }
);

/**
 * Helper function to get the current session token
 * Useful for custom API calls outside of the interceptor
 */
export const getAuthToken = async (): Promise<string | null> => {
  try {
    if (typeof window !== "undefined") {
      const session = await getSession();
      return session?.accessToken || null;
    } else {
      const session = await auth();
      return session?.accessToken || null;
    }
  } catch (error) {
    console.error("Error getting auth token:", error);
    return null;
  }
};

/**
 * Helper function to check if user is authenticated
 */
export const isAuthenticated = async (): Promise<boolean> => {
  try {
    if (typeof window !== "undefined") {
      const session = await getSession();
      return !!session?.accessToken;
    } else {
      const session = await auth();
      return !!session?.accessToken;
    }
  } catch (error) {
    console.error("Error checking authentication:", error);
    return false;
  }
};

/**
 * Helper function to refresh the session
 * Call this after updating user data on the backend
 */
export const refreshSession = async (): Promise<void> => {
  if (typeof window !== "undefined") {
    try {
      // Trigger a session refresh
      const event = new Event("visibilitychange");
      document.dispatchEvent(event);
    } catch (error) {
      console.error("Error refreshing session:", error);
    }
  }
};

export default api;
