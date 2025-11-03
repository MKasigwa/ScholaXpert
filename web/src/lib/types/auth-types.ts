/**
 * Authentication API Types
 */

export enum UserRole {
  SUPER_ADMIN = "super_admin",
  ADMIN = "admin",
  PRINCIPAL = "principal",
  TEACHER = "teacher",
  ACCOUNTANT = "accountant",
  LIBRARIAN = "librarian",
  PARENT = "parent",
  STUDENT = "student",
  STAFF = "staff",
}

export enum UserStatus {
  ACTIVE = "active",
  INACTIVE = "inactive",
  SUSPENDED = "suspended",
  PENDING = "pending",
}

export interface RegisterDto {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  role?: UserRole;
  tenantId?: string;
  department?: string;
  designation?: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface UserResponseDto {
  id: string;
  email: string;
  username?: string;
  firstName: string;
  lastName: string;
  fullName: string;
  phoneNumber?: string;
  role: UserRole;
  status: UserStatus;
  tenantId: string;
  avatar?: string;
  department?: string;
  designation?: string;
  emailVerified: boolean;
  hasPendingRequest: boolean;
  pendingRequestId: string;
  lastLoginAt?: Date;
  createdAt: Date;
}

export interface AuthResponseDto {
  sucess: boolean;
  data: {
    accessToken: string;
    refreshToken?: string;
    user: UserResponseDto;
    expiresIn: number;
  };
  timestamp: Date;
}

export interface ResendCodeResponseDto {
  success: boolean;
  message: string;
  expiresIn: number;
}

export interface VerifyEmailDto {
  email: string;
  code: string;
}

export interface ResendVerificationCodeDto {
  email: string;
}

export interface VerifyEmailResponseDto {
  success: boolean;
  message: string;
  user?: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    emailVerified: boolean;
    emailVerifiedAt?: Date;
  };
}

// Forgot Password Types
export interface ForgotPasswordDto {
  email: string;
}

export interface ForgotPasswordResponseDto {
  success: boolean;
  message: string;
  expiresIn?: number;
}

export interface VerifyResetCodeDto {
  email: string;
  code: string;
}

export interface VerifyResetCodeResponseDto {
  success: boolean;
  message: string;
  token?: string;
}

export interface ResetPasswordDto {
  email: string;
  code: string;
  newPassword: string;
}

export interface ResetPasswordResponseDto {
  success: boolean;
  message: string;
  user?: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
  };
}
