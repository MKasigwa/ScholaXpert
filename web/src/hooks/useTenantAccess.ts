"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import TenantAccessApi from "../lib/api/tenant-access-api";
import {
  AccessRequestQueryParams,
  CreateAccessRequestDto,
  ReviewAccessRequestDto,
  UpdateAccessRequestDto,
} from "../lib/types/tenant-access-types";

/**
 * Hook to create an access request to join a tenant
 */
export function useCreateAccessRequest() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (data: CreateAccessRequestDto) =>
      TenantAccessApi.createAccessRequest(data),
    onSuccess: () => {
      // Invalidate my access requests query
      queryClient.invalidateQueries({ queryKey: ["myAccessRequests"] });
      queryClient.invalidateQueries({ queryKey: ["accessRequests"] });
      console.log("Access request created successfully");
    },
  });

  return {
    createRequest: mutation.mutate,
    createRequestAsync: mutation.mutateAsync,
    isLoading: mutation.isPending,
    isError: mutation.isError,
    isSuccess: mutation.isSuccess,
    error: mutation.error,
    data: mutation.data,
    reset: mutation.reset,
  };
}

/**
 * Hook to get all access requests with filters
 */
export function useAccessRequests(
  params?: AccessRequestQueryParams & { enabled?: boolean }
) {
  const { status } = useSession();
  const { enabled, ...queryParams } = params || {};

  const queryResult = useQuery({
    queryKey: ["accessRequests", queryParams],
    queryFn: () => TenantAccessApi.getAllAccessRequests(queryParams),
    enabled: status === "authenticated" && enabled !== false,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });

  return {
    requests: queryResult.data?.data || [],
    meta: queryResult.data?.meta,
    isLoading: queryResult.isLoading,
    isError: queryResult.isError,
    error: queryResult.error,
    refetch: queryResult.refetch,
    isFetching: queryResult.isFetching,
  };
}

/**
 * Hook to get current user's access requests
 */
export function useMyAccessRequests(
  params?: AccessRequestQueryParams & { enabled?: boolean }
) {
  const { status } = useSession();
  const { enabled, ...queryParams } = params || {};

  const query = useQuery({
    queryKey: ["myAccessRequests", queryParams],
    queryFn: () => TenantAccessApi.getMyAccessRequests(queryParams),
    enabled: status === "authenticated" && enabled !== false,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });

  return {
    requests: query.data || [],
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
    isFetching: query.isFetching,
  };
}

/**
 * Hook to get tenant's pending access requests (admin only)
 */
export function useTenantPendingRequests(
  tenantId: string | undefined,
  enabled: boolean = true
) {
  const { status } = useSession();

  const query = useQuery({
    queryKey: ["tenantPendingRequests", tenantId],
    queryFn: () => TenantAccessApi.getTenantPendingRequests(tenantId!),
    enabled: status === "authenticated" && !!tenantId && enabled,
    staleTime: 1 * 60 * 1000, // 1 minute
  });

  return {
    requests: query.data || [],
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
    isFetching: query.isFetching,
  };
}

/**
 * Hook to get tenant's all access requests (admin only)
 */
export function useTenantAccessRequests(
  tenantId: string | undefined,
  params?: AccessRequestQueryParams & { enabled?: boolean }
) {
  const { status } = useSession();
  const { enabled, ...queryParams } = params || {};

  const query = useQuery({
    queryKey: ["tenantAccessRequests", tenantId, queryParams],
    queryFn: () =>
      TenantAccessApi.getTenantAccessRequests(tenantId!, queryParams),
    enabled: status === "authenticated" && !!tenantId && enabled !== false,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });

  return {
    requests: query.data?.data || [],
    meta: query.data?.meta,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
    isFetching: query.isFetching,
  };
}

/**
 * Hook to get a single access request by ID
 */
export function useAccessRequest(
  id: string | undefined,
  enabled: boolean = true
) {
  const { status } = useSession();

  const query = useQuery({
    queryKey: ["accessRequest", id],
    queryFn: () => TenantAccessApi.getAccessRequest(id!),
    enabled: status === "authenticated" && !!id && enabled,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });

  return {
    request: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
}

/**
 * Hook to update an access request
 */
export function useUpdateAccessRequest(id: string) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (data: UpdateAccessRequestDto) =>
      TenantAccessApi.updateAccessRequest(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["accessRequests"] });
      queryClient.invalidateQueries({ queryKey: ["myAccessRequests"] });
      queryClient.invalidateQueries({ queryKey: ["accessRequest", id] });
      console.log("Access request updated successfully");
    },
  });

  return {
    updateRequest: mutation.mutate,
    updateRequestAsync: mutation.mutateAsync,
    isLoading: mutation.isPending,
    isError: mutation.isError,
    isSuccess: mutation.isSuccess,
    error: mutation.error,
    data: mutation.data,
    reset: mutation.reset,
  };
}

/**
 * Hook to review an access request (approve or reject)
 */
export function useReviewAccessRequest() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: ReviewAccessRequestDto }) =>
      TenantAccessApi.reviewAccessRequest(id, data),
    onSuccess: (_, variables) => {
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ["accessRequests"] });
      queryClient.invalidateQueries({ queryKey: ["tenantPendingRequests"] });
      queryClient.invalidateQueries({ queryKey: ["tenantAccessRequests"] });
      queryClient.invalidateQueries({
        queryKey: ["accessRequest", variables.id],
      });
      queryClient.invalidateQueries({ queryKey: ["accessRequestStats"] });
      console.log("Access request reviewed successfully");
    },
  });

  return {
    reviewRequest: mutation.mutate,
    reviewRequestAsync: mutation.mutateAsync,
    isLoading: mutation.isPending,
    isError: mutation.isError,
    isSuccess: mutation.isSuccess,
    error: mutation.error,
    data: mutation.data,
    reset: mutation.reset,
  };
}

/**
 * Hook to approve an access request
 */
export function useApproveAccessRequest() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({ id, assignedRole }: { id: string; assignedRole?: string }) =>
      TenantAccessApi.approveAccessRequest(id, assignedRole),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["accessRequests"] });
      queryClient.invalidateQueries({ queryKey: ["tenantPendingRequests"] });
      queryClient.invalidateQueries({ queryKey: ["tenantAccessRequests"] });
      queryClient.invalidateQueries({
        queryKey: ["accessRequest", variables.id],
      });
      queryClient.invalidateQueries({ queryKey: ["accessRequestStats"] });
      console.log("Access request approved successfully");
    },
  });

  return {
    approveRequest: mutation.mutate,
    approveRequestAsync: mutation.mutateAsync,
    isLoading: mutation.isPending,
    isError: mutation.isError,
    isSuccess: mutation.isSuccess,
    error: mutation.error,
    data: mutation.data,
    reset: mutation.reset,
  };
}

/**
 * Hook to reject an access request
 */
export function useRejectAccessRequest() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({ id, reviewNotes }: { id: string; reviewNotes?: string }) =>
      TenantAccessApi.rejectAccessRequest(id, reviewNotes),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["accessRequests"] });
      queryClient.invalidateQueries({ queryKey: ["tenantPendingRequests"] });
      queryClient.invalidateQueries({ queryKey: ["tenantAccessRequests"] });
      queryClient.invalidateQueries({
        queryKey: ["accessRequest", variables.id],
      });
      queryClient.invalidateQueries({ queryKey: ["accessRequestStats"] });
      console.log("Access request rejected successfully");
    },
  });

  return {
    rejectRequest: mutation.mutate,
    rejectRequestAsync: mutation.mutateAsync,
    isLoading: mutation.isPending,
    isError: mutation.isError,
    isSuccess: mutation.isSuccess,
    error: mutation.error,
    data: mutation.data,
    reset: mutation.reset,
  };
}

/**
 * Hook to cancel an access request
 */
export function useCancelAccessRequest() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (id: string) => TenantAccessApi.cancelAccessRequest(id),
    onSuccess: (_, id) => {
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ["myAccessRequests"] });
      queryClient.invalidateQueries({ queryKey: ["accessRequests"] });
      queryClient.invalidateQueries({ queryKey: ["accessRequest", id] });
      queryClient.invalidateQueries({ queryKey: ["accessRequestStats"] });
      console.log("Access request cancelled successfully");
    },
  });

  return {
    cancelRequest: mutation.mutate,
    cancelRequestAsync: mutation.mutateAsync,
    isLoading: mutation.isPending,
    isError: mutation.isError,
    isSuccess: mutation.isSuccess,
    error: mutation.error,
    data: mutation.data,
    reset: mutation.reset,
  };
}

/**
 * Hook to delete an access request
 */
export function useDeleteAccessRequest() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (id: string) => TenantAccessApi.deleteAccessRequest(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["accessRequests"] });
      queryClient.invalidateQueries({ queryKey: ["myAccessRequests"] });
      queryClient.invalidateQueries({ queryKey: ["tenantPendingRequests"] });
      queryClient.invalidateQueries({ queryKey: ["tenantAccessRequests"] });
      queryClient.invalidateQueries({ queryKey: ["accessRequestStats"] });
      console.log("Access request deleted successfully");
    },
  });

  return {
    deleteRequest: mutation.mutate,
    deleteRequestAsync: mutation.mutateAsync,
    isLoading: mutation.isPending,
    isError: mutation.isError,
    isSuccess: mutation.isSuccess,
    error: mutation.error,
    reset: mutation.reset,
  };
}

/**
 * Hook to get access request statistics
 */
export function useAccessRequestStats(tenantId?: string) {
  const { status } = useSession();

  const query = useQuery({
    queryKey: ["accessRequestStats", tenantId],
    queryFn: () => TenantAccessApi.getStats(tenantId),
    enabled: status === "authenticated",
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  return {
    stats: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
}

/**
 * Hook to bulk approve access requests
 */
export function useBulkApproveRequests() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({
      ids,
      assignedRole,
    }: {
      ids: string[];
      assignedRole?: string;
    }) => TenantAccessApi.bulkApprove(ids, assignedRole),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["accessRequests"] });
      queryClient.invalidateQueries({ queryKey: ["tenantPendingRequests"] });
      queryClient.invalidateQueries({ queryKey: ["tenantAccessRequests"] });
      queryClient.invalidateQueries({ queryKey: ["accessRequestStats"] });
      console.log("Access requests approved successfully");
    },
  });

  return {
    bulkApprove: mutation.mutate,
    bulkApproveAsync: mutation.mutateAsync,
    isLoading: mutation.isPending,
    isError: mutation.isError,
    isSuccess: mutation.isSuccess,
    error: mutation.error,
    data: mutation.data,
    reset: mutation.reset,
  };
}

/**
 * Hook to bulk reject access requests
 */
export function useBulkRejectRequests() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({
      ids,
      reviewNotes,
    }: {
      ids: string[];
      reviewNotes?: string;
    }) => TenantAccessApi.bulkReject(ids, reviewNotes),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["accessRequests"] });
      queryClient.invalidateQueries({ queryKey: ["tenantPendingRequests"] });
      queryClient.invalidateQueries({ queryKey: ["tenantAccessRequests"] });
      queryClient.invalidateQueries({ queryKey: ["accessRequestStats"] });
      console.log("Access requests rejected successfully");
    },
  });

  return {
    bulkReject: mutation.mutate,
    bulkRejectAsync: mutation.mutateAsync,
    isLoading: mutation.isPending,
    isError: mutation.isError,
    isSuccess: mutation.isSuccess,
    error: mutation.error,
    data: mutation.data,
    reset: mutation.reset,
  };
}

/**
 * Hook to check if user has pending request for a tenant
 */
export function useHasPendingRequestForTenant(
  tenantId: string | undefined,
  enabled: boolean = true
) {
  const { status } = useSession();

  const query = useQuery({
    queryKey: ["hasPendingRequest", tenantId],
    queryFn: () => TenantAccessApi.hasPendingRequest(tenantId!),
    enabled: status === "authenticated" && !!tenantId && enabled,
    staleTime: 1 * 60 * 1000, // 1 minute
  });

  return {
    hasPendingRequest: query.data || false,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
}

/**
 * Hook to check if user has any pending requests
 */
export function useHasPendingRequests() {
  const { requests, isLoading } = useMyAccessRequests();

  const pendingRequests = requests.filter((req) => req.status === "pending");

  return {
    hasPendingRequests: pendingRequests.length > 0,
    pendingCount: pendingRequests.length,
    pendingRequests,
    isLoading,
  };
}

/**
 * Hook to export access requests to CSV
 */
export function useExportAccessRequests() {
  const mutation = useMutation({
    mutationFn: (params?: AccessRequestQueryParams) =>
      TenantAccessApi.exportToCsv(params),
    onSuccess: (blob) => {
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `access-requests-${
        new Date().toISOString().split("T")[0]
      }.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      console.log("Access requests exported successfully");
    },
  });

  return {
    exportRequests: mutation.mutate,
    exportRequestsAsync: mutation.mutateAsync,
    isLoading: mutation.isPending,
    isError: mutation.isError,
    isSuccess: mutation.isSuccess,
    error: mutation.error,
    reset: mutation.reset,
  };
}

/**
 * Utility function to build access request data
 */
export function buildAccessRequestData(
  tenantId: string,
  requestedRole: CreateAccessRequestDto["requestedRole"],
  message?: string
): CreateAccessRequestDto {
  return {
    tenantId,
    requestedRole,
    message,
  };
}
