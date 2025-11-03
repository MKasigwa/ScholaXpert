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
  tenantId?: string;
  avatar?: string;
  department?: string;
  designation?: string;
  emailVerified: boolean;
  lastLoginAt?: Date;
  createdAt: Date;
}

export interface AuthResponseDto {
  accessToken: string;
  refreshToken?: string;
  user: UserResponseDto;
  expiresIn: number;
}
