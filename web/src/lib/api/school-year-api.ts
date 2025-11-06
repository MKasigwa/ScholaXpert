import { AxiosResponse } from "axios";
import api from "../api";
import {
  SchoolYear,
  SchoolYearSummary,
  SchoolYearWithStats,
  SchoolYearQueryParams,
  SchoolYearListResponse,
  CreateSchoolYearDto,
  UpdateSchoolYearDto,
  SchoolYearStats,
  BulkUpdateStatusDto,
  BulkDeleteDto,
  SetDefaultDto,
  RestoreDto,
  DeleteDto,
  BulkOperationResponse,
} from "../types/school-year-types";

export class SchoolYearApi {
  private static baseUrl = "/school-years";

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
          cleaned[key] = value.toISOString().split("T")[0];
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
   * Get all school years with filtering and pagination
   */
  static async getAllSchoolYears(
    params?: SchoolYearQueryParams
  ): Promise<SchoolYearListResponse> {
    const response: AxiosResponse<SchoolYearListResponse> = await api
      .get(this.baseUrl, { params: this.cleanParams(params) })
      .then((res) => res.data);
    return response.data;
  }

  /**
   * Get school year summaries (lightweight)
   * For dropdowns and selectors
   */
  static async getSchoolYearSummaries(
    params?: SchoolYearQueryParams
  ): Promise<SchoolYearSummary[]> {
    const response: AxiosResponse<SchoolYearSummary[]> = await api.get(
      `${this.baseUrl}/summary`,
      { params: this.cleanParams(params) }
    );
    return response.data;
  }

  /**
   * Get single school year by ID
   */
  static async getSchoolYear(
    id: string,
    includeDeleted?: boolean
  ): Promise<SchoolYear> {
    const response: AxiosResponse<SchoolYear> = await api.get(
      `${this.baseUrl}/${id}`,
      { params: { includeDeleted } }
    );
    return response.data;
  }

  /**
   * Get school years by tenant (for switcher)
   */
  static async getSchoolYearsByTenant(
    tenantId: string
  ): Promise<SchoolYearWithStats[]> {
    const response: AxiosResponse<SchoolYearWithStats[]> = await api
      .get(`${this.baseUrl}/tenant/${tenantId}`)
      .then((res) => res.data);
    return response.data;
  }

  /**
   * Get school year by tenant and code
   */
  static async getSchoolYearByCode(
    tenantId: string,
    code: string
  ): Promise<SchoolYear> {
    const response: AxiosResponse<SchoolYear> = await api.get(
      `${this.baseUrl}/tenant/${tenantId}/code/${code}`
    );
    return response.data;
  }

  /**
   * Get current active school year for a tenant
   */
  static async getCurrentSchoolYear(tenantId: string): Promise<SchoolYear> {
    const response: AxiosResponse<SchoolYear> = await api.get(
      `${this.baseUrl}/current`,
      { params: { tenantId } }
    );
    return response.data;
  }

  /**
   * Get default school year for a tenant
   */
  static async getDefaultSchoolYear(tenantId: string): Promise<SchoolYear> {
    const response: AxiosResponse<SchoolYear> = await api.get(
      `${this.baseUrl}/default`,
      { params: { tenantId } }
    );
    return response.data;
  }

  /**
   * Get school year statistics
   */
  static async getSchoolYearStats(tenantId?: string): Promise<SchoolYearStats> {
    const response: AxiosResponse<SchoolYearStats> = await api.get(
      `${this.baseUrl}/statistics`,
      { params: { tenantId } }
    );
    return response.data;
  }

  /**
   * Create a new school year
   */
  static async createSchoolYear(
    data: CreateSchoolYearDto
  ): Promise<SchoolYear> {
    const response: AxiosResponse<SchoolYear> = await api.post(
      this.baseUrl,
      data
    );
    return response.data;
  }

  /**
   * Update a school year (PUT)
   */
  static async updateSchoolYear(
    id: string,
    data: UpdateSchoolYearDto
  ): Promise<SchoolYear> {
    const response: AxiosResponse<SchoolYear> = await api.put(
      `${this.baseUrl}/${id}`,
      data
    );
    return response.data;
  }

  /**
   * Update a school year (PATCH)
   */
  static async patchSchoolYear(
    id: string,
    data: Partial<UpdateSchoolYearDto>
  ): Promise<SchoolYear> {
    const response: AxiosResponse<SchoolYear> = await api.patch(
      `${this.baseUrl}/${id}`,
      data
    );
    return response.data;
  }

  /**
   * Set a school year as default
   */
  static async setAsDefault(
    id: string,
    data?: SetDefaultDto
  ): Promise<SchoolYear> {
    const response: AxiosResponse<SchoolYear> = await api.post(
      `${this.baseUrl}/${id}/set-default`,
      data || {}
    );
    return response.data;
  }

  /**
   * Toggle school year status (draft -> active -> archived -> draft)
   */
  static async toggleStatus(id: string): Promise<SchoolYear> {
    const response: AxiosResponse<SchoolYear> = await api.patch(
      `${this.baseUrl}/${id}/toggle-status`
    );
    return response.data;
  }

  /**
   * Activate a school year
   */
  static async activate(id: string): Promise<SchoolYear> {
    const response: AxiosResponse<SchoolYear> = await api.patch(
      `${this.baseUrl}/${id}/activate`
    );
    return response.data;
  }

  /**
   * Archive a school year
   */
  static async archive(id: string): Promise<SchoolYear> {
    const response: AxiosResponse<SchoolYear> = await api.patch(
      `${this.baseUrl}/${id}/archive`
    );
    return response.data;
  }

  /**
   * Delete a school year (soft delete)
   */
  static async deleteSchoolYear(id: string, data?: DeleteDto): Promise<void> {
    await api.delete(`${this.baseUrl}/${id}`, { data: data || {} });
  }

  /**
   * Permanently delete a school year (hard delete)
   */
  static async hardDeleteSchoolYear(id: string): Promise<void> {
    await api.delete(`${this.baseUrl}/${id}/hard`);
  }

  /**
   * Restore a soft-deleted school year
   */
  static async restoreSchoolYear(
    id: string,
    data?: RestoreDto
  ): Promise<SchoolYear> {
    const response: AxiosResponse<SchoolYear> = await api.post(
      `${this.baseUrl}/${id}/restore`,
      data || {}
    );
    return response.data;
  }

  /**
   * Bulk update status for multiple school years
   */
  static async bulkUpdateStatus(
    data: BulkUpdateStatusDto
  ): Promise<BulkOperationResponse> {
    const response: AxiosResponse<BulkOperationResponse> = await api.post(
      `${this.baseUrl}/bulk/update-status`,
      data
    );
    return response.data;
  }

  /**
   * Bulk delete school years
   */
  static async bulkDelete(data: BulkDeleteDto): Promise<BulkOperationResponse> {
    const response: AxiosResponse<BulkOperationResponse> = await api.post(
      `${this.baseUrl}/bulk/delete`,
      data
    );
    return response.data;
  }
}

export default SchoolYearApi;
