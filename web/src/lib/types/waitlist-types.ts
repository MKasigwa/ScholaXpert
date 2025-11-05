/**
 * Waitlist API Types
 */

/**
 * Enums
 */
export enum SubscriberStatus {
  ACTIVE = "active",
  NOTIFIED = "notified",
  UNSUBSCRIBED = "unsubscribed",
}

export enum SubscriberSource {
  COMING_SOON_PAGE = "coming_soon_page",
  LANDING_PAGE = "landing_page",
  REFERRAL = "referral",
  OTHER = "other",
}

/**
 * Subscriber entity interface
 */
export interface Subscriber {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  organization?: string;
  role?: string;
  phoneNumber?: string;
  country?: string;
  status: SubscriberStatus;
  source: SubscriberSource;
  locale?: string;
  referralCode?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  metadata?: Record<string, any>;
  notifiedAt?: Date;
  unsubscribedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * DTOs (Data Transfer Objects)
 */
export interface CreateSubscriberData {
  email: string;
  firstName?: string;
  lastName?: string;
  organization?: string;
  role?: string;
  phoneNumber?: string;
  country?: string;
  source?: SubscriberSource;
  locale?: string;
  referralCode?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  metadata?: Record<string, any>;
}

export interface UpdateSubscriberData {
  firstName?: string;
  lastName?: string;
  organization?: string;
  role?: string;
  phoneNumber?: string;
  country?: string;
  status?: SubscriberStatus;
  locale?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  metadata?: Record<string, any>;
}

/**
 * Query parameters for filtering and pagination
 */
export interface SubscriberQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: "ASC" | "DESC";
  status?: SubscriberStatus;
  source?: SubscriberSource;
  startDate?: string;
  endDate?: string;
  country?: string;
  locale?: string;
}

/**
 * Paginated response for subscriber lists
 */
export interface SubscriberListResponse {
  data: Subscriber[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

/**
 * Statistics response
 */
export interface SubscriberStats {
  total: number;
  active: number;
  notified: number;
  unsubscribed: number;
  bySource: Record<string, number>;
  byCountry: Record<string, number>;
  recentSignups: number;
}

/**
 * Bulk operation response
 */
export interface BulkOperationResponse {
  updated: number;
  success: boolean;
  message?: string;
}

/**
 * Unsubscribe request
 */
export interface UnsubscribeRequest {
  email: string;
}

// Legacy type exports for backward compatibility
/** @deprecated Use CreateSubscriberData instead */
export type CreateSubscriberDto = CreateSubscriberData;

/** @deprecated Use Subscriber instead */
export type SubscriberResponseDto = Subscriber;

/** @deprecated Use SubscriberQueryParams instead */
export type SubscriberQueryDto = SubscriberQueryParams;

/** @deprecated Use SubscriberListResponse instead */
export type PaginatedSubscriberResponse = SubscriberListResponse;

/** @deprecated Use SubscriberStats instead */
export type SubscriberStatsDto = SubscriberStats;
