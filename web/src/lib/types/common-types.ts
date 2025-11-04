// Common API types shared across modules

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
}

export interface BaseQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: "ASC" | "DESC";
}

export interface ApiErrorResponse {
  message: string;
  statusCode: number;
  error: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  details?: any[];
}
