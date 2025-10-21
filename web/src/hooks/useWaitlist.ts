import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import WaitlistApi from "../lib/api/waitlist-api";
import {
  CreateSubscriberData,
  SubscriberQueryParams,
  SubscriberSource,
} from "../lib/types/waitlist-types";

/**
 * Hook for subscribing to the waitlist (public)
 */
export function useWaitlistSubscribe() {
  const [isSubmitted, setIsSubmitted] = useState(false);

  const mutation = useMutation({
    mutationFn: (data: CreateSubscriberData) => WaitlistApi.subscribe(data),
    onSuccess: () => {
      setIsSubmitted(true);
      // Auto-reset after 3 seconds
      setTimeout(() => {
        setIsSubmitted(false);
      }, 3000);
    },
  });

  return {
    subscribe: mutation.mutate,
    subscribeAsync: mutation.mutateAsync,
    isLoading: mutation.isPending,
    isError: mutation.isError,
    isSuccess: mutation.isSuccess,
    isSubmitted,
    error: mutation.error,
    reset: () => {
      mutation.reset();
      setIsSubmitted(false);
    },
  };
}

/**
 * Hook for getting all subscribers (admin)
 */
export function useWaitlistSubscribers(query?: SubscriberQueryParams) {
  return useQuery({
    queryKey: ["waitlist-subscribers", query],
    queryFn: () => WaitlistApi.getSubscribers(query),
    staleTime: 30000, // 30 seconds
  });
}

/**
 * Hook for getting waitlist statistics (admin)
 */
export function useWaitlistStats() {
  return useQuery({
    queryKey: ["waitlist-stats"],
    queryFn: () => WaitlistApi.getStats(),
    staleTime: 30000, // 30 seconds
  });
}

/**
 * Hook for marking subscriber as notified (admin)
 */
export function useMarkAsNotified() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => WaitlistApi.markAsNotified(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["waitlist-subscribers"] });
      queryClient.invalidateQueries({ queryKey: ["waitlist-stats"] });
    },
  });
}

/**
 * Hook for bulk marking subscribers as notified (admin)
 */
export function useBulkMarkAsNotified() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (ids: string[]) => WaitlistApi.bulkMarkAsNotified(ids),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["waitlist-subscribers"] });
      queryClient.invalidateQueries({ queryKey: ["waitlist-stats"] });
    },
  });
}

/**
 * Hook for unsubscribing (public)
 */
export function useWaitlistUnsubscribe() {
  return useMutation({
    mutationFn: (email: string) => WaitlistApi.unsubscribeByEmail(email),
  });
}

/**
 * Hook for deleting subscriber (admin)
 */
export function useDeleteSubscriber() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => WaitlistApi.deleteSubscriber(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["waitlist-subscribers"] });
      queryClient.invalidateQueries({ queryKey: ["waitlist-stats"] });
    },
  });
}

/**
 * Hook for exporting subscribers to CSV (admin)
 */
export function useExportSubscribers() {
  return useMutation({
    mutationFn: () => WaitlistApi.exportToCsv(),
    onSuccess: (blob) => {
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `waitlist-subscribers-${
        new Date().toISOString().split("T")[0]
      }.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    },
  });
}

/**
 * Utility function to get UTM parameters from URL
 */
export function getUtmParams() {
  if (typeof window === "undefined") return {};

  const params = new URLSearchParams(window.location.search);
  return {
    utmSource: params.get("utm_source") || undefined,
    utmMedium: params.get("utm_medium") || undefined,
    utmCampaign: params.get("utm_campaign") || undefined,
  };
}

/**
 * Utility function to build subscribe data with metadata
 */
export function buildSubscribeData(
  email: string,
  locale?: string,
  additionalData?: Partial<CreateSubscriberData>
): CreateSubscriberData {
  return {
    email,
    locale,
    source: SubscriberSource.COMING_SOON_PAGE,
    ...getUtmParams(),
    ...additionalData,
  };
}
