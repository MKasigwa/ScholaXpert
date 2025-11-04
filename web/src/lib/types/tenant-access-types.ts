import { UserRole } from "./auth-types";

/**
 * Tenant Access Request Types
 */

/**
 * Enums
 */
export enum AccessRequestStatus {
  PENDING = "pending",
  APPROVED = "approved",
  REJECTED = "rejected",
  CANCELLED = "cancelled",
}

/**
 * DTOs (Data Transfer Objects)
 */
export interface CreateAccessRequestDto {
  tenantId: string;
  requestedRole: UserRole;
  message?: string;
}

export interface ReviewAccessRequestDto {
  status: "approved" | "rejected";
  reviewNotes?: string;
  assignedRole?: UserRole;
}

export interface UpdateAccessRequestDto {
  requestedRole?: UserRole;
  message?: string;
}

/**
 * Response DTOs
 */
export interface AccessRequestUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
}

export interface AccessRequestTenant {
  id: string;
  name: string;
  code: string;
  type?: string;
}

export interface AccessRequest {
  id: string;
  userId: string;
  tenantId: string;
  requestedRole: UserRole;
  message?: string;
  status: AccessRequestStatus | string;
  reviewedBy?: string;
  reviewedAt?: Date;
  reviewNotes?: string;
  createdAt: Date;
  updatedAt: Date;
  user?: AccessRequestUser;
  tenant?: AccessRequestTenant;
}

// Alias for backward compatibility
export type AccessRequestResponseDto = AccessRequest;

/**
 * Query parameters for filtering and pagination
 */
export interface AccessRequestQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: "ASC" | "DESC";
  status?: AccessRequestStatus | string;
  tenantId?: string;
  userId?: string;
  requestedRole?: UserRole;
  startDate?: string;
  endDate?: string;
}

/**
 * Paginated response for access request lists
 */
export interface AccessRequestListResponse {
  data: AccessRequest[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

/**
 * Access request statistics response
 */
export interface AccessRequestStats {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
  cancelled: number;
  byRole: Record<string, number>;
  byTenant: Record<string, number>;
  recentRequests: number;
  averageProcessingTime?: number;
}

/**
 * Bulk operation response
 */
export interface BulkAccessRequestResponse {
  updated: number;
  success: boolean;
  message?: string;
}
