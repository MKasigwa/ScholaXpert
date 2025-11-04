"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import TenantApi from "../lib/api/tenant-api";
import {
  TenantQueryParams,
  CreateTenantDto,
  CreateTenantMinimalDto,
  UpdateTenantDto,
} from "../lib/types/tenant-types";

/**
 * Hook to get all tenants with optional search and pagination
 */
export function useTenants(params?: TenantQueryParams & { enabled?: boolean }) {
  const { status } = useSession();
  const { enabled, ...queryParams } = params || {};

  const query = useQuery({
    queryKey: ["tenants", queryParams],
    queryFn: () => TenantApi.getAllTenants(queryParams),
    enabled: status === "authenticated" && enabled !== false,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });

  return {
    tenants: query.data?.data || [],
    meta: query.data?.meta,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
    isFetching: query.isFetching,
  };
}

/**
 * Hook to get tenant summary list (lightweight)
 */
export function useTenantSummary(
  params?: TenantQueryParams & { enabled?: boolean }
) {
  const { status } = useSession();
  const { enabled, ...queryParams } = params || {};

  const query = useQuery({
    queryKey: ["tenants", "summary", queryParams],
    queryFn: () => TenantApi.getTenantSummary(queryParams),
    enabled: status === "authenticated" && enabled !== false,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });

  return {
    tenants: query.data || [],
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
    isFetching: query.isFetching,
  };
}

/**
 * Hook to get a single tenant by ID
 */
export function useTenant(id: string | undefined, enabled: boolean = true) {
  const { status } = useSession();

  const query = useQuery({
    queryKey: ["tenant", id],
    queryFn: () => TenantApi.getTenant(id!),
    enabled: status === "authenticated" && !!id && enabled,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  return {
    tenant: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
}

/**
 * Hook to create a new tenant
 * Note: Session update should be handled in the component after successful creation
 */
export function useCreateTenant() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (data: CreateTenantDto) => TenantApi.createTenant(data),
    onSuccess: async (tenant) => {
      // Invalidate tenants list to refresh data
      queryClient.invalidateQueries({ queryKey: ["tenants"] });

      console.log("Tenant created successfully:", tenant);
    },
  });

  return {
    createTenant: mutation.mutate,
    createTenantAsync: mutation.mutateAsync,
    isLoading: mutation.isPending,
    isError: mutation.isError,
    isSuccess: mutation.isSuccess,
    error: mutation.error,
    data: mutation.data,
    reset: mutation.reset,
  };
}

/**
 * Hook to create a new tenant with minimal data
 * Note: Session update should be handled in the component after successful creation
 */
export function useCreateTenantMinimal() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (data: CreateTenantMinimalDto) =>
      TenantApi.createTenantMinimal(data),
    onSuccess: async (response) => {
      // Invalidate tenants list to refresh data
      queryClient.invalidateQueries({ queryKey: ["tenants"] });

      console.log("Tenant created successfully:", response.tenant);
    },
  });

  return {
    createTenantMinimal: mutation.mutate,
    createTenantMinimalAsync: mutation.mutateAsync,
    isLoading: mutation.isPending,
    isError: mutation.isError,
    isSuccess: mutation.isSuccess,
    error: mutation.error,
    data: mutation.data,
    reset: mutation.reset,
  };
}

/**
 * Hook to update a tenant
 */
export function useUpdateTenant(id: string) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (data: UpdateTenantDto) => TenantApi.updateTenant(id, data),
    onSuccess: (updatedTenant) => {
      // Invalidate tenants list and single tenant queries
      queryClient.invalidateQueries({ queryKey: ["tenants"] });
      queryClient.invalidateQueries({ queryKey: ["tenant", id] });

      console.log("Tenant updated successfully:", updatedTenant);
    },
  });

  return {
    updateTenant: mutation.mutate,
    updateTenantAsync: mutation.mutateAsync,
    isLoading: mutation.isPending,
    isError: mutation.isError,
    isSuccess: mutation.isSuccess,
    error: mutation.error,
    data: mutation.data,
    reset: mutation.reset,
  };
}

/**
 * Hook to delete a tenant
 */
export function useDeleteTenant() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (id: string) => TenantApi.deleteTenant(id),
    onSuccess: () => {
      // Invalidate tenants list
      queryClient.invalidateQueries({ queryKey: ["tenants"] });

      console.log("Tenant deleted successfully");
    },
  });

  return {
    deleteTenant: mutation.mutate,
    deleteTenantAsync: mutation.mutateAsync,
    isLoading: mutation.isPending,
    isError: mutation.isError,
    isSuccess: mutation.isSuccess,
    error: mutation.error,
    reset: mutation.reset,
  };
}

/**
 * Hook to search tenants by name or code
 */
export function useSearchTenants(searchTerm: string, enabled: boolean = true) {
  const { status } = useSession();

  const query = useQuery({
    queryKey: ["tenants", "search", searchTerm],
    queryFn: () => TenantApi.searchTenants(searchTerm),
    enabled: status === "authenticated" && enabled && searchTerm.length > 0,
    staleTime: 1 * 60 * 1000, // 1 minute
  });

  console.log("Query result", query.data);

  return {
    results: query.data || [],
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
    isFetching: query.isFetching,
  };
}

/**
 * Hook to get tenant statistics
 */
export function useTenantStats() {
  const { status } = useSession();

  const query = useQuery({
    queryKey: ["tenants", "stats"],
    queryFn: () => TenantApi.getStats(),
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
 * Hook to activate a tenant
 */
export function useActivateTenant() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (id: string) => TenantApi.activateTenant(id),
    onSuccess: (tenant, id) => {
      queryClient.invalidateQueries({ queryKey: ["tenants"] });
      queryClient.invalidateQueries({ queryKey: ["tenant", id] });
      queryClient.invalidateQueries({ queryKey: ["tenants", "stats"] });

      console.log("Tenant activated successfully:", tenant);
    },
  });

  return {
    activateTenant: mutation.mutate,
    activateTenantAsync: mutation.mutateAsync,
    isLoading: mutation.isPending,
    isError: mutation.isError,
    isSuccess: mutation.isSuccess,
    error: mutation.error,
    data: mutation.data,
    reset: mutation.reset,
  };
}

/**
 * Hook to deactivate a tenant
 */
export function useDeactivateTenant() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (id: string) => TenantApi.deactivateTenant(id),
    onSuccess: (tenant, id) => {
      queryClient.invalidateQueries({ queryKey: ["tenants"] });
      queryClient.invalidateQueries({ queryKey: ["tenant", id] });
      queryClient.invalidateQueries({ queryKey: ["tenants", "stats"] });

      console.log("Tenant deactivated successfully:", tenant);
    },
  });

  return {
    deactivateTenant: mutation.mutate,
    deactivateTenantAsync: mutation.mutateAsync,
    isLoading: mutation.isPending,
    isError: mutation.isError,
    isSuccess: mutation.isSuccess,
    error: mutation.error,
    data: mutation.data,
    reset: mutation.reset,
  };
}

/**
 * Hook to suspend a tenant
 */
export function useSuspendTenant() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({ id, reason }: { id: string; reason?: string }) =>
      TenantApi.suspendTenant(id, reason),
    onSuccess: (tenant, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["tenants"] });
      queryClient.invalidateQueries({ queryKey: ["tenant", id] });
      queryClient.invalidateQueries({ queryKey: ["tenants", "stats"] });

      console.log("Tenant suspended successfully:", tenant);
    },
  });

  return {
    suspendTenant: mutation.mutate,
    suspendTenantAsync: mutation.mutateAsync,
    isLoading: mutation.isPending,
    isError: mutation.isError,
    isSuccess: mutation.isSuccess,
    error: mutation.error,
    data: mutation.data,
    reset: mutation.reset,
  };
}

/**
 * Hook for bulk activate tenants
 */
export function useBulkActivateTenants() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (ids: string[]) => TenantApi.bulkActivate(ids),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tenants"] });
      queryClient.invalidateQueries({ queryKey: ["tenants", "stats"] });

      console.log("Tenants activated successfully");
    },
  });

  return {
    bulkActivate: mutation.mutate,
    bulkActivateAsync: mutation.mutateAsync,
    isLoading: mutation.isPending,
    isError: mutation.isError,
    isSuccess: mutation.isSuccess,
    error: mutation.error,
    data: mutation.data,
    reset: mutation.reset,
  };
}

/**
 * Hook for bulk deactivate tenants
 */
export function useBulkDeactivateTenants() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (ids: string[]) => TenantApi.bulkDeactivate(ids),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tenants"] });
      queryClient.invalidateQueries({ queryKey: ["tenants", "stats"] });

      console.log("Tenants deactivated successfully");
    },
  });

  return {
    bulkDeactivate: mutation.mutate,
    bulkDeactivateAsync: mutation.mutateAsync,
    isLoading: mutation.isPending,
    isError: mutation.isError,
    isSuccess: mutation.isSuccess,
    error: mutation.error,
    data: mutation.data,
    reset: mutation.reset,
  };
}

/**
 * Hook to export tenants to CSV
 */
export function useExportTenants() {
  const mutation = useMutation({
    mutationFn: (params?: TenantQueryParams) => TenantApi.exportToCsv(params),
    onSuccess: (blob) => {
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `tenants-${new Date().toISOString().split("T")[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      console.log("Tenants exported successfully");
    },
  });

  return {
    exportTenants: mutation.mutate,
    exportTenantsAsync: mutation.mutateAsync,
    isLoading: mutation.isPending,
    isError: mutation.isError,
    isSuccess: mutation.isSuccess,
    error: mutation.error,
    reset: mutation.reset,
  };
}

/**
 * Hook to get current user's tenant
 */
export function useCurrentTenant() {
  const { data: session } = useSession();
  const tenantId = session?.user?.tenantId;

  return useTenant(tenantId, !!tenantId);
}

/**
 * Hook to check if user has a tenant
 */
export function useHasTenant() {
  const { data: session } = useSession();

  return {
    hasTenant: !!session?.user?.tenantId,
    tenantId: session?.user?.tenantId,
    isLoading: !session,
  };
}

/**
 * Utility function to build create tenant data
 */
export function buildCreateTenantData(
  basicInfo: {
    name: string;
    code: string;
    type: string;
    email: string;
    phone: string;
  },
  address: {
    street: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
  },
  schoolInfo?: {
    establishedYear?: number;
    principalName?: string;
    studentCapacity?: number;
    website?: string;
  }
): CreateTenantDto {
  return {
    ...basicInfo,
    address,
    schoolInfo,
  };
}
