import { AxiosResponse } from "axios";
import api from "../api";
import {
  TenantSummary,
  TenantDetail,
  TenantQueryParams,
  TenantListResponse,
  CreateTenantDto,
  CreateTenantMinimalDto,
  CreateTenantMinimalResponse,
  UpdateTenantDto,
  TenantStats,
  BulkOperationResponse,
} from "../types/tenant-types";

export class TenantApi {
  private static baseUrl = "/tenants";

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
   * Get all tenants with filtering and pagination
   */
  static async getAllTenants(
    params?: TenantQueryParams
  ): Promise<TenantListResponse> {
    const response: AxiosResponse<TenantListResponse> = await api.get(
      this.baseUrl,
      { params: this.cleanParams(params) }
    );
    return response.data;
  }

  /**
   * Get tenant summary list (lightweight)
   * For search/selection purposes
   */
  static async getTenantSummary(
    params?: TenantQueryParams
  ): Promise<TenantSummary[]> {
    const response: AxiosResponse<TenantSummary[]> = await api
      .get(`${this.baseUrl}/summary`, { params: this.cleanParams(params) })
      .then((res) => res.data);
    return response.data;
  }

  /**
   * Get single tenant by ID
   */
  static async getTenant(id: string): Promise<TenantDetail> {
    const response: AxiosResponse<TenantDetail> = await api.get(
      `${this.baseUrl}/${id}`
    );
    return response.data;
  }

  /**
   * Create a new tenant (user becomes admin)
   */
  static async createTenant(data: CreateTenantDto): Promise<TenantSummary> {
    const response: AxiosResponse<TenantSummary> = await api.post(
      this.baseUrl,
      data
    );
    return response.data;
  }

  /**
   * Create a new tenant with minimal data (user becomes admin)
   */
  static async createTenantMinimal(
    data: CreateTenantMinimalDto
  ): Promise<CreateTenantMinimalResponse> {
    const response: AxiosResponse<CreateTenantMinimalResponse> = await api
      .post(`${this.baseUrl}/minimal`, data)
      .then((res) => res.data);
    return response.data;
  }

  /**
   * Update an existing tenant
   */
  static async updateTenant(
    id: string,
    data: UpdateTenantDto
  ): Promise<TenantDetail> {
    const response: AxiosResponse<TenantDetail> = await api.patch(
      `${this.baseUrl}/${id}`,
      data
    );
    return response.data;
  }

  /**
   * Delete a tenant
   */
  static async deleteTenant(id: string): Promise<void> {
    await api.delete(`${this.baseUrl}/${id}`);
  }

  /**
   * Search tenants by name or code
   */
  static async searchTenants(searchTerm: string): Promise<TenantSummary[]> {
    const response: AxiosResponse<TenantSummary[]> = await api
      .get(`${this.baseUrl}/summary`, { params: { search: searchTerm } })
      .then((result) => {
        return result.data;
      });
    return response.data;
  }

  /**
   * Get tenant statistics (admin)
   */
  static async getStats(): Promise<TenantStats> {
    const response: AxiosResponse<{ success: boolean; data: TenantStats }> =
      await api.get(`${this.baseUrl}/stats`);
    return response.data.data;
  }

  /**
   * Activate a tenant
   */
  static async activateTenant(id: string): Promise<TenantDetail> {
    const response: AxiosResponse<{ success: boolean; data: TenantDetail }> =
      await api.patch(`${this.baseUrl}/${id}/activate`);
    return response.data.data;
  }

  /**
   * Deactivate a tenant
   */
  static async deactivateTenant(id: string): Promise<TenantDetail> {
    const response: AxiosResponse<{ success: boolean; data: TenantDetail }> =
      await api.patch(`${this.baseUrl}/${id}/deactivate`);
    return response.data.data;
  }

  /**
   * Suspend a tenant
   */
  static async suspendTenant(
    id: string,
    reason?: string
  ): Promise<TenantDetail> {
    const response: AxiosResponse<{ success: boolean; data: TenantDetail }> =
      await api.patch(`${this.baseUrl}/${id}/suspend`, { reason });
    return response.data.data;
  }

  /**
   * Bulk activate tenants
   */
  static async bulkActivate(ids: string[]): Promise<BulkOperationResponse> {
    const response: AxiosResponse<BulkOperationResponse> = await api.patch(
      `${this.baseUrl}/bulk/activate`,
      { ids }
    );
    return response.data;
  }

  /**
   * Bulk deactivate tenants
   */
  static async bulkDeactivate(ids: string[]): Promise<BulkOperationResponse> {
    const response: AxiosResponse<BulkOperationResponse> = await api.patch(
      `${this.baseUrl}/bulk/deactivate`,
      { ids }
    );
    return response.data;
  }

  /**
   * Export tenants to CSV (admin)
   */
  static async exportToCsv(params?: TenantQueryParams): Promise<Blob> {
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

export default TenantApi;
