/**
 * Tenant API Types
 */

/**
 * Enums
 */
export enum TenantType {
  SCHOOL = "school",
  UNIVERSITY = "university",
  TRAINING_CENTER = "training_center",
  COLLEGE = "college",
  INSTITUTE = "institute",
  ACADEMY = "academy",
  OTHER = "other",
}

export enum TenantStatus {
  ACTIVE = "active",
  INACTIVE = "inactive",
  SUSPENDED = "suspended",
  TRIAL = "trial",
  PENDING = "pending",
}

/**
 * Tenant entity interfaces
 */
export interface TenantAddress {
  street: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
}

export interface TenantSchoolInfo {
  establishedYear?: number;
  principalName?: string;
  studentCapacity?: number;
  website?: string;
}

export interface TenantSummary {
  id: string;
  name: string;
  slug: string;
  status: TenantStatus | string;
  email?: string;
  phone?: string;
  logoUrl?: string;
  address?: TenantAddress;
  createdAt: Date;
  updatedAt?: Date;
}

export interface TenantDetail extends TenantSummary {
  address: TenantAddress;
  schoolInfo?: TenantSchoolInfo;
  totalUsers?: number;
  totalStudents?: number;
  subscriptionPlan?: string;
  subscriptionExpiresAt?: Date;
}

// Alias for backward compatibility
export type Tenant = TenantSummary;

/**
 * DTOs (Data Transfer Objects)
 */
export interface CreateTenantDto {
  name: string;
  code: string;
  type: TenantType | string;
  email: string;
  phone: string;
  address: TenantAddress;
  schoolInfo?: TenantSchoolInfo;
  logoUrl?: string;
}

/**
 * Minimal DTO for quick tenant creation
 * Only requires 4 fields + optional address
 */
export interface CreateTenantMinimalDto {
  name: string;
  code: string;
  email: string;
  phone: string;
  // Optional address fields
  street?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
}

/**
 * Response from creating a minimal tenant
 * Includes both tenant and updated user information
 */
export interface CreateTenantMinimalResponse {
  tenant: TenantSummary;
  user?: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
    tenantId: string;
    emailVerified: boolean;
  };
}

export interface UpdateTenantDto {
  name?: string;
  code?: string;
  type?: TenantType | string;
  email?: string;
  phone?: string;
  address?: TenantAddress;
  schoolInfo?: TenantSchoolInfo;
  logoUrl?: string;
  status?: TenantStatus;
}

/**
 * Query parameters for filtering and pagination
 */
export interface TenantQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: "ASC" | "DESC";
  status?: TenantStatus;
  type?: TenantType;
  country?: string;
  startDate?: string;
  endDate?: string;
}

/**
 * Paginated response for tenant lists
 */
export interface TenantListResponse {
  data: TenantSummary[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

/**
 * Tenant statistics response
 */
export interface TenantStats {
  total: number;
  active: number;
  inactive: number;
  suspended: number;
  trial: number;
  byType: Record<string, number>;
  byCountry: Record<string, number>;
  recentlyCreated: number;
  totalUsers: number;
  totalStudents: number;
}

/**
 * Bulk operation response
 */
export interface BulkOperationResponse {
  updated: number;
  success: boolean;
  message?: string;
}
