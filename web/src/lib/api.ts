import axios from "axios";

// Create axios instance with default config
// Handle both Vite and non-Vite environments
const getApiUrl = () => {
  try {
    // Check if import.meta.env is available (Vite environment)
    if (process.env.API_URL) {
      return process.env.API_URL;
    }
  } catch (error) {
    // import.meta is not available, fall through to default
  }

  // Fallback for environments where import.meta.env is not available
  return "http://localhost:3001/api/v1";
};

export const api = axios.create({
  baseURL: getApiUrl(),
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("auth_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle common errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized - redirect to login
      localStorage.removeItem("auth_token");
      window.location.href = "/auth/sign-in";
    }
    return Promise.reject(error);
  }
);

export default api;
