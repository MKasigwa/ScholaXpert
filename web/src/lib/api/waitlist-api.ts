import { AxiosResponse } from "axios";
import api from "../api";
import {
  Subscriber,
  SubscriberStats,
  SubscriberQueryParams,
  SubscriberListResponse,
  CreateSubscriberData,
  UpdateSubscriberData,
  BulkOperationResponse,
  UnsubscribeRequest,
} from "../types/waitlist-types";

export class WaitlistApi {
  private static baseUrl = "/waitlist";

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
   * Subscribe to the waitlist (public endpoint)
   */
  static async subscribe(data: CreateSubscriberData): Promise<Subscriber> {
    const response: AxiosResponse<Subscriber> = await api.post(
      `${this.baseUrl}/subscribe`,
      data
    );
    return response.data;
  }

  /**
   * Get all subscribers with filtering and pagination (admin)
   */
  static async getSubscribers(
    params?: SubscriberQueryParams
  ): Promise<SubscriberListResponse> {
    const response: AxiosResponse<SubscriberListResponse> = await api.get(
      `${this.baseUrl}/subscribers`,
      { params: this.cleanParams(params) }
    );
    return response.data;
  }

  /**
   * Get a single subscriber by ID (admin)
   */
  static async getSubscriber(id: string): Promise<Subscriber> {
    const response: AxiosResponse<{ success: boolean; data: Subscriber }> =
      await api.get(`${this.baseUrl}/subscribers/${id}`);
    return response.data.data;
  }

  /**
   * Get subscriber by email (admin)
   */
  static async getSubscriberByEmail(email: string): Promise<Subscriber | null> {
    try {
      const response: AxiosResponse<{ success: boolean; data: Subscriber }> =
        await api.get(`${this.baseUrl}/subscribers/email/${email}`);
      return response.data.data;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      if (error?.response?.status === 404) {
        return null;
      }
      throw error;
    }
  }

  /**
   * Update a subscriber (admin)
   */
  static async updateSubscriber(
    id: string,
    data: UpdateSubscriberData
  ): Promise<Subscriber> {
    const response: AxiosResponse<{ success: boolean; data: Subscriber }> =
      await api.patch(`${this.baseUrl}/subscribers/${id}`, data);
    return response.data.data;
  }

  /**
   * Mark subscriber as notified (admin)
   */
  static async markAsNotified(id: string): Promise<Subscriber> {
    const response: AxiosResponse<{ success: boolean; data: Subscriber }> =
      await api.patch(`${this.baseUrl}/subscribers/${id}/notify`);
    return response.data.data;
  }

  /**
   * Bulk mark subscribers as notified (admin)
   */
  static async bulkMarkAsNotified(
    ids: string[]
  ): Promise<BulkOperationResponse> {
    const response: AxiosResponse<BulkOperationResponse> = await api.patch(
      `${this.baseUrl}/subscribers/notify/bulk`,
      { ids }
    );
    return response.data;
  }

  /**
   * Unsubscribe by email (public endpoint)
   */
  static async unsubscribeByEmail(email: string): Promise<Subscriber> {
    const response: AxiosResponse<{ success: boolean; data: Subscriber }> =
      await api.post(`${this.baseUrl}/unsubscribe`, {
        email,
      } as UnsubscribeRequest);
    return response.data.data;
  }

  /**
   * Unsubscribe by ID (admin)
   */
  static async unsubscribe(id: string): Promise<Subscriber> {
    const response: AxiosResponse<{ success: boolean; data: Subscriber }> =
      await api.patch(`${this.baseUrl}/subscribers/${id}/unsubscribe`);
    return response.data.data;
  }

  /**
   * Delete a subscriber (admin)
   */
  static async deleteSubscriber(id: string): Promise<void> {
    await api.delete(`${this.baseUrl}/subscribers/${id}`);
  }

  /**
   * Restore a deleted subscriber (admin)
   */
  static async restoreSubscriber(id: string): Promise<Subscriber> {
    const response: AxiosResponse<{ success: boolean; data: Subscriber }> =
      await api.post(`${this.baseUrl}/subscribers/${id}/restore`);
    return response.data.data;
  }

  /**
   * Get waitlist statistics (admin)
   */
  static async getStats(): Promise<SubscriberStats> {
    const response: AxiosResponse<{ success: boolean; data: SubscriberStats }> =
      await api.get(`${this.baseUrl}/stats`);
    return response.data.data;
  }

  /**
   * Export subscribers to CSV (admin)
   */
  static async exportToCsv(): Promise<Blob> {
    const response: AxiosResponse<Blob> = await api.get(
      `${this.baseUrl}/export/csv`,
      { responseType: "blob" }
    );
    return response.data;
  }

  /**
   * Export subscribers to JSON (admin)
   */
  static async exportToJson(): Promise<Blob> {
    const response: AxiosResponse<Blob> = await api.get(
      `${this.baseUrl}/export/json`,
      { responseType: "blob" }
    );
    return response.data;
  }
}

export default WaitlistApi;

// Legacy function exports for backward compatibility
/** @deprecated Use WaitlistApi.subscribe instead */
export const subscribeToWaitlist = WaitlistApi.subscribe.bind(WaitlistApi);

/** @deprecated Use WaitlistApi.getSubscribers instead */
export const getSubscribers = WaitlistApi.getSubscribers.bind(WaitlistApi);

/** @deprecated Use WaitlistApi.getSubscriber instead */
export const getSubscriberById = WaitlistApi.getSubscriber.bind(WaitlistApi);

/** @deprecated Use WaitlistApi.getSubscriberByEmail instead */
export const getSubscriberByEmail =
  WaitlistApi.getSubscriberByEmail.bind(WaitlistApi);

/** @deprecated Use WaitlistApi.markAsNotified instead */
export const markSubscriberAsNotified =
  WaitlistApi.markAsNotified.bind(WaitlistApi);

/** @deprecated Use WaitlistApi.bulkMarkAsNotified instead */
export const markManyAsNotified =
  WaitlistApi.bulkMarkAsNotified.bind(WaitlistApi);

/** @deprecated Use WaitlistApi.unsubscribeByEmail instead */
export const unsubscribeByEmail =
  WaitlistApi.unsubscribeByEmail.bind(WaitlistApi);

/** @deprecated Use WaitlistApi.unsubscribe instead */
export const unsubscribeById = WaitlistApi.unsubscribe.bind(WaitlistApi);

/** @deprecated Use WaitlistApi.deleteSubscriber instead */
export const deleteSubscriber = WaitlistApi.deleteSubscriber.bind(WaitlistApi);

/** @deprecated Use WaitlistApi.getStats instead */
export const getWaitlistStats = WaitlistApi.getStats.bind(WaitlistApi);

/** @deprecated Use WaitlistApi.exportToCsv instead */
export const exportSubscribersToCsv = WaitlistApi.exportToCsv.bind(WaitlistApi);
