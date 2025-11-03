import { AxiosResponse } from "axios";
import api from "../api";
import {
  RegisterDto,
  LoginDto,
  AuthResponseDto,
  UserResponseDto,
} from "../types/auth-types";

export class AuthApi {
  private static baseUrl = "/auth";

  /**
   * Token storage helper methods
   */
  private static setTokens(accessToken: string, refreshToken?: string): void {
    localStorage.setItem("accessToken", accessToken);
    if (refreshToken) {
      localStorage.setItem("refreshToken", refreshToken);
    }
  }

  private static setUserData(user: UserResponseDto): void {
    localStorage.setItem("user", JSON.stringify(user));
  }

  private static clearTokens(): void {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
  }

  private static getAccessToken(): string | null {
    return localStorage.getItem("accessToken");
  }

  private static getRefreshToken(): string | null {
    return localStorage.getItem("refreshToken");
  }

  /**
   * Register a new user
   */
  static async register(data: RegisterDto): Promise<AuthResponseDto> {
    const response: AxiosResponse<AuthResponseDto> = await api.post(
      `${this.baseUrl}/register`,
      data
    );

    // Store token and user data
    if (response.data.accessToken) {
      this.setTokens(response.data.accessToken, response.data.refreshToken);
      this.setUserData(response.data.user);
    }

    return response.data;
  }

  /**
   * Login user
   */
  static async login(data: LoginDto): Promise<AuthResponseDto> {
    const response: AxiosResponse<AuthResponseDto> = await api.post(
      `${this.baseUrl}/login`,
      data
    );

    // Store token and user data
    if (response.data.accessToken) {
      this.setTokens(response.data.accessToken, response.data.refreshToken);
      this.setUserData(response.data.user);
    }

    return response.data;
  }

  /**
   * Get current authenticated user
   */
  static async getCurrentUser(): Promise<UserResponseDto> {
    const response: AxiosResponse<UserResponseDto> = await api.get(
      `${this.baseUrl}/me`
    );
    return response.data;
  }

  /**
   * Refresh access token
   */
  static async refreshToken(): Promise<{
    accessToken: string;
    expiresIn: number;
  }> {
    const refreshToken = this.getRefreshToken();
    const response: AxiosResponse<{ accessToken: string; expiresIn: number }> =
      await api.post(`${this.baseUrl}/refresh`, { refreshToken });

    if (response.data.accessToken) {
      this.setTokens(response.data.accessToken);
    }

    return response.data;
  }

  /**
   * Logout user
   */
  static async logout(): Promise<void> {
    try {
      await api.post(`${this.baseUrl}/logout`);
    } finally {
      this.clearTokens();
    }
  }

  /**
   * Check if user is authenticated
   */
  static isAuthenticated(): boolean {
    return !!this.getAccessToken();
  }

  /**
   * Get stored user data
   */
  static getStoredUser(): UserResponseDto | null {
    const userStr = localStorage.getItem("user");
    if (!userStr) return null;

    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  }

  /**
   * Clear all authentication data (useful for logout or session cleanup)
   */
  static clearAuthData(): void {
    this.clearTokens();
  }
}

export default AuthApi;

// Legacy function exports for backward compatibility
/** @deprecated Use AuthApi.register instead */
export const register = AuthApi.register.bind(AuthApi);

/** @deprecated Use AuthApi.login instead */
export const login = AuthApi.login.bind(AuthApi);

/** @deprecated Use AuthApi.getCurrentUser instead */
export const getCurrentUser = AuthApi.getCurrentUser.bind(AuthApi);

/** @deprecated Use AuthApi.refreshToken instead */
export const refreshToken = AuthApi.refreshToken.bind(AuthApi);

/** @deprecated Use AuthApi.logout instead */
export const logout = AuthApi.logout.bind(AuthApi);

/** @deprecated Use AuthApi.isAuthenticated instead */
export const isAuthenticated = AuthApi.isAuthenticated.bind(AuthApi);

/** @deprecated Use AuthApi.getStoredUser instead */
export const getStoredUser = AuthApi.getStoredUser.bind(AuthApi);
