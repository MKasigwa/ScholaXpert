import { AxiosResponse } from "axios";
import api from "../api";
import {
  LoginDto,
  RegisterDto,
  UserResponseDto,
  AuthResponseDto,
  VerifyEmailDto,
  ResendVerificationCodeDto,
  VerifyEmailResponseDto,
  ResendCodeResponseDto,
  ForgotPasswordDto,
  ForgotPasswordResponseDto,
  VerifyResetCodeDto,
  VerifyResetCodeResponseDto,
  ResetPasswordDto,
  ResetPasswordResponseDto,
} from "../types/auth-types";

export class AuthApi {
  private static baseUrl = "/auth";

  /**
   * Token storage helper methods
   */
  private static setTokens(accessToken: string, refreshToken?: string): void {
    if (typeof window !== "undefined") {
      localStorage.setItem("accessToken", accessToken);
      if (refreshToken) {
        localStorage.setItem("refreshToken", refreshToken);
      }
    }
  }

  private static setUserData(user: UserResponseDto): void {
    if (typeof window !== "undefined") {
      localStorage.setItem("user", JSON.stringify(user));
    }
  }

  private static clearTokens(): void {
    if (typeof window !== "undefined") {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");
    }
  }

  private static getAccessToken(): string | null {
    if (typeof window !== "undefined") {
      return localStorage.getItem("accessToken");
    }
    return null;
  }

  private static getRefreshToken(): string | null {
    if (typeof window !== "undefined") {
      return localStorage.getItem("refreshToken");
    }
    return null;
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
    if (response.data.data.accessToken) {
      this.setTokens(
        response.data.data.accessToken,
        response.data.data.refreshToken
      );
      this.setUserData(response.data.data.user);
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
    if (response.data.data.accessToken) {
      this.setTokens(
        response.data.data.accessToken,
        response.data.data.refreshToken
      );
      this.setUserData(response.data.data.user);
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
    if (typeof window === "undefined") return null;

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

  /**
   * Verify email with 6-digit code
   */
  static async verifyEmailWithCode(
    data: VerifyEmailDto
  ): Promise<VerifyEmailResponseDto> {
    const response: AxiosResponse<VerifyEmailResponseDto> = await api.post(
      `${this.baseUrl}/verify-email-code`,
      data
    );

    // Update stored user data if verification successful
    if (response.data.success && response.data.user) {
      this.setUserData(response.data.user as UserResponseDto);
    }

    return response.data;
  }

  /**
   * Resend verification code
   */
  static async resendVerificationCode(
    data: ResendVerificationCodeDto
  ): Promise<ResendCodeResponseDto> {
    const response: AxiosResponse<ResendCodeResponseDto> = await api.post(
      `${this.baseUrl}/resend-verification-code`,
      data
    );
    return response.data;
  }

  /**
   * Forgot password
   */
  static async forgotPassword(
    data: ForgotPasswordDto
  ): Promise<ForgotPasswordResponseDto> {
    const response: AxiosResponse<ForgotPasswordResponseDto> = await api.post(
      `${this.baseUrl}/forgot-password`,
      data
    );
    return response.data;
  }

  /**
   * Verify reset code
   */
  static async verifyResetCode(
    data: VerifyResetCodeDto
  ): Promise<VerifyResetCodeResponseDto> {
    const response: AxiosResponse<VerifyResetCodeResponseDto> = await api.post(
      `${this.baseUrl}/verify-reset-code`,
      data
    );
    return response.data;
  }

  /**
   * Reset password
   */
  static async resetPassword(
    data: ResetPasswordDto
  ): Promise<ResetPasswordResponseDto> {
    const response: AxiosResponse<ResetPasswordResponseDto> = await api.post(
      `${this.baseUrl}/reset-password`,
      data
    );
    return response.data;
  }
}

export default AuthApi;
