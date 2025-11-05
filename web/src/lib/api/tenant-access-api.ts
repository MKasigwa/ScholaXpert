import { AxiosResponse } from "axios";
import api from "../api";
import {
  AccessRequest,
  AccessRequestQueryParams,
  AccessRequestListResponse,
  CreateAccessRequestDto,
  ReviewAccessRequestDto,
  UpdateAccessRequestDto,
  AccessRequestStats,
  BulkAccessRequestResponse,
} from "../types/tenant-access-types";

export class TenantAccessApi {
  private static baseUrl = "/tenant-access";

  /**
   * Clean and prepare parameters for API requests
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private static cleanParams(params?: any): any {
    if (!params) return {};

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const cleaned: any = {};
    Object.keys(params).forEach((key) => {
      const value = params[key];
      if (value !== undefined && value !== null && value !== "") {
        if (value instanceof Date) {
          cleaned[key] = value.toISOString();
        } else if (Array.isArray(value)) {
          cleaned[key] = value.join(",");
        } else {
          cleaned[key] = value;
        }
      }
    });

    return cleaned;
  }

  /**
   * Create an access request to join a tenant
   */
  static async createAccessRequest(
    data: CreateAccessRequestDto
  ): Promise<AccessRequest> {
    const response: AxiosResponse<AccessRequest> = await api.post(
      `${this.baseUrl}/request`,
      data
    );
    return response.data;
  }

  /**
   * Get all access requests with filtering and pagination
   */
  static async getAllAccessRequests(
    params?: AccessRequestQueryParams
  ): Promise<AccessRequestListResponse> {
    const response: AxiosResponse<AccessRequestListResponse> = await api.get(
      `${this.baseUrl}/requests`,
      { params: this.cleanParams(params) }
    );
    return response.data;
  }

  /**
   * Get current user's access requests
   */
  static async getMyAccessRequests(
    params?: AccessRequestQueryParams
  ): Promise<AccessRequest[]> {
    const response: AxiosResponse<AccessRequest[]> = await api
      .get(`${this.baseUrl}/my-requests`, { params: this.cleanParams(params) })
      .then((res) => res.data);
    return response.data;
  }

  /**
   * Get tenant's pending access requests (admin only)
   */
  static async getTenantPendingRequests(
    tenantId: string
  ): Promise<AccessRequest[]> {
    const response: AxiosResponse<AccessRequest[]> = await api.get(
      `${this.baseUrl}/tenant/${tenantId}/pending`
    );
    return response.data;
  }

  /**
   * Get tenant's all access requests (admin only)
   */
  static async getTenantAccessRequests(
    tenantId: string,
    params?: AccessRequestQueryParams
  ): Promise<AccessRequestListResponse> {
    const response: AxiosResponse<AccessRequestListResponse> = await api.get(
      `${this.baseUrl}/tenant/${tenantId}/requests`,
      { params: this.cleanParams(params) }
    );
    return response.data;
  }

  /**
   * Get single access request by ID
   */
  static async getAccessRequest(id: string): Promise<AccessRequest> {
    const response: AxiosResponse<AccessRequest> = await api.get(
      `${this.baseUrl}/requests/${id}`
    );
    return response.data;
  }

  /**
   * Update an access request (before approval)
   */
  static async updateAccessRequest(
    id: string,
    data: UpdateAccessRequestDto
  ): Promise<AccessRequest> {
    const response: AxiosResponse<AccessRequest> = await api.patch(
      `${this.baseUrl}/requests/${id}`,
      data
    );
    return response.data;
  }

  /**
   * Review an access request (approve or reject)
   */
  static async reviewAccessRequest(
    id: string,
    data: ReviewAccessRequestDto
  ): Promise<AccessRequest> {
    const response: AxiosResponse<AccessRequest> = await api.patch(
      `${this.baseUrl}/requests/${id}/review`,
      data
    );
    return response.data;
  }

  /**
   * Approve an access request
   */
  static async approveAccessRequest(
    id: string,
    assignedRole?: string
  ): Promise<AccessRequest> {
    const response: AxiosResponse<{ success: boolean; data: AccessRequest }> =
      await api.patch(`${this.baseUrl}/requests/${id}/approve`, {
        assignedRole,
      });
    return response.data.data;
  }

  /**
   * Reject an access request
   */
  static async rejectAccessRequest(
    id: string,
    reviewNotes?: string
  ): Promise<AccessRequest> {
    const response: AxiosResponse<{ success: boolean; data: AccessRequest }> =
      await api.patch(`${this.baseUrl}/requests/${id}/reject`, { reviewNotes });
    return response.data.data;
  }

  /**
   * Cancel an access request
   */
  static async cancelAccessRequest(id: string): Promise<AccessRequest> {
    const response: AxiosResponse<AccessRequest> = await api.patch(
      `${this.baseUrl}/requests/${id}/cancel`
    );
    return response.data;
  }

  /**
   * Delete an access request
   */
  static async deleteAccessRequest(id: string): Promise<void> {
    await api.delete(`${this.baseUrl}/requests/${id}`);
  }

  /**
   * Get access request statistics (admin)
   */
  static async getStats(tenantId?: string): Promise<AccessRequestStats> {
    const url = tenantId
      ? `${this.baseUrl}/tenant/${tenantId}/stats`
      : `${this.baseUrl}/stats`;

    const response: AxiosResponse<{
      success: boolean;
      data: AccessRequestStats;
    }> = await api.get(url);
    return response.data.data;
  }

  /**
   * Bulk approve access requests
   */
  static async bulkApprove(
    ids: string[],
    assignedRole?: string
  ): Promise<BulkAccessRequestResponse> {
    const response: AxiosResponse<BulkAccessRequestResponse> = await api.patch(
      `${this.baseUrl}/requests/bulk/approve`,
      { ids, assignedRole }
    );
    return response.data;
  }

  /**
   * Bulk reject access requests
   */
  static async bulkReject(
    ids: string[],
    reviewNotes?: string
  ): Promise<BulkAccessRequestResponse> {
    const response: AxiosResponse<BulkAccessRequestResponse> = await api.patch(
      `${this.baseUrl}/requests/bulk/reject`,
      { ids, reviewNotes }
    );
    return response.data;
  }

  /**
   * Check if user has pending request for a tenant
   */
  static async hasPendingRequest(tenantId: string): Promise<boolean> {
    const response: AxiosResponse<{ hasPending: boolean; requestId?: string }> =
      await api.get(`${this.baseUrl}/tenant/${tenantId}/check-pending`);
    return response.data.hasPending;
  }

  /**
   * Export access requests to CSV (admin)
   */
  static async exportToCsv(params?: AccessRequestQueryParams): Promise<Blob> {
    const response: AxiosResponse<Blob> = await api.get(
      `${this.baseUrl}/export/csv`,
      {
        params: this.cleanParams(params),
        responseType: "blob",
      }
    );
    return response.data;
  }
}

export default TenantAccessApi;
