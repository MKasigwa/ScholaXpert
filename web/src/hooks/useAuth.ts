"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import AuthApi from "../lib/api/auth-api";
import {
  RegisterDto,
  LoginDto,
  VerifyEmailDto,
  ResendVerificationCodeDto,
  UserResponseDto,
  AuthResponseDto,
  VerifyEmailResponseDto,
  ResendCodeResponseDto,
  ForgotPasswordDto,
  ForgotPasswordResponseDto,
  VerifyResetCodeDto,
  VerifyResetCodeResponseDto,
  ResetPasswordDto,
  ResetPasswordResponseDto,
} from "../lib/types/auth-types";

/**
 * Hook for user registration
 */
export function useRegister() {
  const mutation = useMutation({
    mutationFn: (data: RegisterDto) => AuthApi.register(data),
    onSuccess: (data) => {
      // Token is automatically stored by AuthApi
      console.log("User registered successfully:", data.data.user);
    },
  });

  return {
    register: mutation.mutate,
    registerAsync: mutation.mutateAsync,
    isLoading: mutation.isPending,
    isError: mutation.isError,
    isSuccess: mutation.isSuccess,
    error: mutation.error,
    data: mutation.data,
    reset: mutation.reset,
  };
}

/**
 * Hook for user login
 */
export function useLogin() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (data: LoginDto) => AuthApi.login(data),
    onSuccess: (data) => {
      // Token is automatically stored by AuthApi
      // Invalidate user query to refetch user data
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
      console.log("User logged in successfully:", data.data.user);
    },
  });

  return {
    login: mutation.mutate,
    loginAsync: mutation.mutateAsync,
    isLoading: mutation.isPending,
    isError: mutation.isError,
    isSuccess: mutation.isSuccess,
    error: mutation.error,
    data: mutation.data,
    reset: mutation.reset,
  };
}

/**
 * Hook for user logout
 */
export function useLogout() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: () => AuthApi.logout(),
    onSuccess: () => {
      // Clear all cached queries
      queryClient.clear();
      console.log("User logged out successfully");
    },
  });

  return {
    logout: mutation.mutate,
    logoutAsync: mutation.mutateAsync,
    isLoading: mutation.isPending,
    isError: mutation.isError,
    isSuccess: mutation.isSuccess,
    error: mutation.error,
    reset: mutation.reset,
  };
}

/**
 * Hook to get current authenticated user
 * Uses NextAuth session if available, falls back to API call
 */
export function useCurrentUser() {
  const { data: session, status } = useSession();

  const query = useQuery({
    queryKey: ["currentUser"],
    queryFn: () => AuthApi.getCurrentUser(),
    enabled: status === "authenticated" && !session?.user,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Return NextAuth session user if available, otherwise return query result
  const user = session?.user || query.data;

  return {
    user: user as UserResponseDto | undefined,
    isLoading: status === "loading" || query.isLoading,
    isError: query.isError,
    isAuthenticated: status === "authenticated",
    error: query.error,
    refetch: query.refetch,
  };
}

/**
 * Hook to verify email with code
 */
export function useVerifyEmail() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (data: VerifyEmailDto) => AuthApi.verifyEmailWithCode(data),
    onSuccess: (data) => {
      if (data.success) {
        // Invalidate user query to refetch updated user data
        queryClient.invalidateQueries({ queryKey: ["currentUser"] });
        console.log("Email verified successfully");
      }
    },
  });

  return {
    verifyEmail: mutation.mutate,
    verifyEmailAsync: mutation.mutateAsync,
    isLoading: mutation.isPending,
    isError: mutation.isError,
    isSuccess: mutation.isSuccess,
    error: mutation.error,
    data: mutation.data,
    reset: mutation.reset,
  };
}

/**
 * Hook to resend verification code
 */
export function useResendVerificationCode() {
  const mutation = useMutation({
    mutationFn: (data: ResendVerificationCodeDto) =>
      AuthApi.resendVerificationCode(data),
  });

  return {
    resendCode: mutation.mutate,
    resendCodeAsync: mutation.mutateAsync,
    isLoading: mutation.isPending,
    isError: mutation.isError,
    isSuccess: mutation.isSuccess,
    error: mutation.error,
    data: mutation.data,
    reset: mutation.reset,
  };
}

/**
 * Hook to check authentication status
 */
export function useAuthStatus() {
  const { status } = useSession();

  return {
    isAuthenticated: status === "authenticated",
    isLoading: status === "loading",
    isUnauthenticated: status === "unauthenticated",
  };
}

/**
 * Helper function to get stored user data (synchronous)
 */
export function useStoredUser() {
  if (typeof window === "undefined") return null;
  return AuthApi.getStoredUser();
}

/**
 * Helper to clear authentication data
 */
export function useClearAuth() {
  const queryClient = useQueryClient();

  return () => {
    AuthApi.clearAuthData();
    queryClient.clear();
  };
}

/**
 * Hook for forgot password
 */
export function useForgotPassword() {
  const mutation = useMutation({
    mutationFn: (data: ForgotPasswordDto) => AuthApi.forgotPassword(data),
    onSuccess: (data) => {
      console.log("Forgot password request sent successfully:", data);
    },
  });

  return {
    forgotPassword: mutation.mutate,
    forgotPasswordAsync: mutation.mutateAsync,
    isLoading: mutation.isPending,
    isError: mutation.isError,
    isSuccess: mutation.isSuccess,
    error: mutation.error,
    data: mutation.data,
    reset: mutation.reset,
  };
}

/**
 * Hook to verify reset code
 */
export function useVerifyResetCode() {
  const mutation = useMutation({
    mutationFn: (data: VerifyResetCodeDto) => AuthApi.verifyResetCode(data),
    onSuccess: (data) => {
      console.log("Reset code verified successfully:", data);
    },
  });

  return {
    verifyResetCode: mutation.mutate,
    verifyResetCodeAsync: mutation.mutateAsync,
    isLoading: mutation.isPending,
    isError: mutation.isError,
    isSuccess: mutation.isSuccess,
    error: mutation.error,
    data: mutation.data,
    reset: mutation.reset,
  };
}

/**
 * Hook to reset password
 */
export function useResetPassword() {
  const mutation = useMutation({
    mutationFn: (data: ResetPasswordDto) => AuthApi.resetPassword(data),
    onSuccess: (data) => {
      console.log("Password reset successfully:", data);
    },
  });

  return {
    resetPassword: mutation.mutate,
    resetPasswordAsync: mutation.mutateAsync,
    isLoading: mutation.isPending,
    isError: mutation.isError,
    isSuccess: mutation.isSuccess,
    error: mutation.error,
    data: mutation.data,
    reset: mutation.reset,
  };
}
