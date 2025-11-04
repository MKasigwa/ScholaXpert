/**
 * School Year API Types
 */

/**
 * Enums
 */
export enum SchoolYearStatus {
  DRAFT = "draft",
  ACTIVE = "active",
  ARCHIVED = "archived",
}

export enum EnrollmentStatus {
  OPEN = "open",
  CLOSED = "closed",
  PENDING = "pending",
}

export enum AcademicCalendarStatus {
  COMPLETE = "complete",
  INCOMPLETE = "incomplete",
  DRAFT = "draft",
}

/**
 * School Year entity interfaces
 */
export interface SchoolYear {
  id: string;
  tenantId: string;
  name: string;
  code: string;
  startDate: string;
  endDate: string;
  status: SchoolYearStatus | string;
  isDefault: boolean;
  description?: string;
  enrollmentStartDate?: string;
  enrollmentEndDate?: string;
  gradeSubmissionDeadline?: string;
  graduationDate?: string;
  studentCount: number;
  staffCount: number;
  classCount: number;
  termCount: number;
  enrollmentStatus: EnrollmentStatus | string;
  academicCalendarStatus: AcademicCalendarStatus | string;
  createdBy: string;
  updatedBy: string;
  deletedBy?: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
  // Computed properties
  duration?: number;
  isActive?: boolean;
  isCurrent?: boolean;
}

/**
 * School Year with statistics (for switcher)
 */
export interface SchoolYearWithStats extends SchoolYear {
  studentCount: number;
  staffCount: number;
  classCount: number;
}

/**
 * Lightweight summary for dropdowns and selectors
 */
export interface SchoolYearSummary {
  id: string;
  tenantId: string;
  name: string;
  code: string;
  startDate: string;
  endDate: string;
  status: SchoolYearStatus | string;
  isDefault: boolean;
  isActive: boolean;
  isCurrent: boolean;
}

/**
 * DTOs (Data Transfer Objects)
 */
export interface CreateSchoolYearDto {
  tenantId: string;
  name: string;
  code: string;
  startDate: string;
  endDate: string;
  status?: SchoolYearStatus | string;
  isDefault?: boolean;
  description?: string;
  enrollmentStartDate?: string;
  enrollmentEndDate?: string;
  gradeSubmissionDeadline?: string;
  graduationDate?: string;
  termCount?: number;
  enrollmentStatus?: EnrollmentStatus | string;
  academicCalendarStatus?: AcademicCalendarStatus | string;
  createdBy: string;
}

export interface UpdateSchoolYearDto {
  name?: string;
  code?: string;
  startDate?: string;
  endDate?: string;
  status?: SchoolYearStatus | string;
  isDefault?: boolean;
  description?: string;
  enrollmentStartDate?: string;
  enrollmentEndDate?: string;
  gradeSubmissionDeadline?: string;
  graduationDate?: string;
  termCount?: number;
  enrollmentStatus?: EnrollmentStatus | string;
  academicCalendarStatus?: AcademicCalendarStatus | string;
  updatedBy: string;
}

/**
 * Query parameters for filtering and pagination
 */
export interface SchoolYearQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: SchoolYearStatus | string;
  tenantId?: string;
  isDefault?: boolean;
  includeDeleted?: boolean;
  startDateFrom?: string;
  startDateTo?: string;
  endDateFrom?: string;
  endDateTo?: string;
  enrollmentStatus?: EnrollmentStatus | string;
  academicCalendarStatus?: AcademicCalendarStatus | string;
  createdBy?: string;
  updatedBy?: string;
  sortBy?:
    | "name"
    | "code"
    | "startDate"
    | "endDate"
    | "status"
    | "isDefault"
    | "createdAt"
    | "updatedAt";
  sortOrder?: "ASC" | "DESC";
}

/**
 * Paginated response
 */
export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

/**
 * School Year list response
 */
export type SchoolYearListResponse = PaginatedResponse<SchoolYear>;

/**
 * Statistics response
 */
export interface SchoolYearStats {
  totalSchoolYears: number;
  activeSchoolYears: number;
  draftSchoolYears: number;
  archivedSchoolYears: number;
  deletedSchoolYears: number;
  defaultSchoolYear?: SchoolYear;
  totalStudents: number;
  totalStaff: number;
  totalClasses: number;
  averageDuration: number;
  upcomingDeadlines: Array<{
    type: "enrollment" | "grade_submission" | "graduation";
    date: string;
    schoolYearName: string;
    daysRemaining: number;
  }>;
}

/**
 * Bulk operation DTOs
 */
export interface BulkUpdateStatusDto {
  ids: string[];
  status: SchoolYearStatus | string;
  updatedBy: string;
}

export interface BulkDeleteDto {
  ids: string[];
  deletedBy: string;
}

export interface SetDefaultDto {
  setBy?: string;
}

export interface RestoreDto {
  restoredBy?: string;
}

export interface DeleteDto {
  deletedBy?: string;
}

/**
 * Bulk operation response
 */
export interface BulkOperationResponse {
  success: boolean;
  count: number;
  message: string;
}
