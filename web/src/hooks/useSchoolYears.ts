"use client";

import {
  useQuery,
  useMutation,
  useQueryClient,
  // UseQueryResult,
  // UseMutationResult,
} from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import SchoolYearApi from "../lib/api/school-year-api";
import {
  SchoolYear,
  SchoolYearWithStats,
  SchoolYearQueryParams,
  CreateSchoolYearDto,
  UpdateSchoolYearDto,
  SchoolYearStats,
  BulkUpdateStatusDto,
  BulkDeleteDto,
  // SetDefaultDto,
  // RestoreDto,
  // DeleteDto,
} from "../lib/types/school-year-types";

/**
 * Query Keys for React Query cache management
 */
export const schoolYearKeys = {
  all: ["school-years"] as const,
  lists: () => [...schoolYearKeys.all, "list"] as const,
  list: (params: SchoolYearQueryParams) =>
    [...schoolYearKeys.lists(), params] as const,
  details: () => [...schoolYearKeys.all, "detail"] as const,
  detail: (id: string) => [...schoolYearKeys.details(), id] as const,
  tenant: (tenantId: string) =>
    [...schoolYearKeys.all, "tenant", tenantId] as const,
  current: (tenantId: string) =>
    [...schoolYearKeys.all, "current", tenantId] as const,
  default: (tenantId: string) =>
    [...schoolYearKeys.all, "default", tenantId] as const,
  stats: (tenantId?: string) =>
    [...schoolYearKeys.all, "stats", tenantId] as const,
};

/**
 * Hook to get all school years with pagination and filtering
 */
export function useSchoolYears(
  params?: SchoolYearQueryParams & { enabled?: boolean }
) {
  const { data: session, status } = useSession();
  const { enabled, ...queryParams } = params || {};

  const query = useQuery({
    queryKey: schoolYearKeys.list(queryParams),
    queryFn: () => SchoolYearApi.getAllSchoolYears(queryParams),
    enabled: status === "authenticated" && enabled !== false,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });

  return {
    schoolYears: query.data?.data || [],
    meta: query.data?.meta,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
    isFetching: query.isFetching,
  };
}

/**
 * Hook to get school years for a specific tenant
 */
export function useSchoolYearsByTenant(
  tenantId: string | undefined,
  enabled: boolean = true
): {
  schoolYears: SchoolYearWithStats[];
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  refetch: () => void;
} {
  const { data: session, status } = useSession();

  const query = useQuery({
    queryKey: schoolYearKeys.tenant(tenantId || ""),
    queryFn: () => SchoolYearApi.getSchoolYearsByTenant(tenantId!),
    enabled: status === "authenticated" && !!tenantId && enabled,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });

  return {
    schoolYears: query.data || [],
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch as () => void,
  };
}

/**
 * Hook to get a single school year by ID
 */
export function useSchoolYear(
  id: string | undefined,
  includeDeleted?: boolean,
  enabled: boolean = true
) {
  const { data: session, status } = useSession();

  const query = useQuery({
    queryKey: schoolYearKeys.detail(id || ""),
    queryFn: () => SchoolYearApi.getSchoolYear(id!, includeDeleted),
    enabled: status === "authenticated" && !!id && enabled,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  return {
    schoolYear: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
}

/**
 * Hook to get current school year for a tenant
 */
export function useCurrentSchoolYear(
  tenantId: string | undefined,
  enabled: boolean = true
) {
  const { data: session, status } = useSession();

  const query = useQuery({
    queryKey: schoolYearKeys.current(tenantId || ""),
    queryFn: () => SchoolYearApi.getCurrentSchoolYear(tenantId!),
    enabled: status === "authenticated" && !!tenantId && enabled,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  return {
    schoolYear: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
}

/**
 * Hook to get default school year for a tenant
 */
export function useDefaultSchoolYear(
  tenantId: string | undefined,
  enabled: boolean = true
) {
  const { data: session, status } = useSession();

  const query = useQuery({
    queryKey: schoolYearKeys.default(tenantId || ""),
    queryFn: () => SchoolYearApi.getDefaultSchoolYear(tenantId!),
    enabled: status === "authenticated" && !!tenantId && enabled,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  return {
    schoolYear: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
}

/**
 * Hook to get school year statistics
 */
export function useSchoolYearStats(tenantId?: string, enabled: boolean = true) {
  const { data: session, status } = useSession();

  const query = useQuery({
    queryKey: schoolYearKeys.stats(tenantId),
    queryFn: () => SchoolYearApi.getSchoolYearStats(tenantId),
    enabled: status === "authenticated" && enabled,
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
 * Hook to create a new school year
 */
export function useCreateSchoolYear(): {
  createSchoolYear: (data: CreateSchoolYearDto) => void;
  createSchoolYearAsync: (data: CreateSchoolYearDto) => Promise<SchoolYear>;
  isLoading: boolean;
  isError: boolean;
  isSuccess: boolean;
  error: Error | null;
  data: SchoolYear | undefined;
  reset: () => void;
} {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (data: CreateSchoolYearDto) =>
      SchoolYearApi.createSchoolYear(data),
    onSuccess: (newSchoolYear) => {
      // Invalidate and refetch school year lists
      queryClient.invalidateQueries({ queryKey: schoolYearKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: schoolYearKeys.tenant(newSchoolYear.tenantId),
      });
      queryClient.invalidateQueries({ queryKey: schoolYearKeys.stats() });

      toast.success(
        `School year "${newSchoolYear.name}" created successfully!`
      );
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      const message =
        error?.response?.data?.message || "Failed to create school year";
      toast.error(message);
    },
  });

  return {
    createSchoolYear: mutation.mutate,
    createSchoolYearAsync: mutation.mutateAsync,
    isLoading: mutation.isPending,
    isError: mutation.isError,
    isSuccess: mutation.isSuccess,
    error: mutation.error,
    data: mutation.data,
    reset: mutation.reset,
  };
}

/**
 * Hook to update a school year
 */
export function useUpdateSchoolYear(id: string) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (data: UpdateSchoolYearDto) =>
      SchoolYearApi.updateSchoolYear(id, data),
    onSuccess: (updatedSchoolYear) => {
      // Update the school year in cache
      queryClient.setQueryData(schoolYearKeys.detail(id), updatedSchoolYear);

      // Invalidate and refetch lists
      queryClient.invalidateQueries({ queryKey: schoolYearKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: schoolYearKeys.tenant(updatedSchoolYear.tenantId),
      });
      queryClient.invalidateQueries({ queryKey: schoolYearKeys.stats() });

      toast.success(
        `School year "${updatedSchoolYear.name}" updated successfully!`
      );
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      const message =
        error?.response?.data?.message || "Failed to update school year";
      toast.error(message);
    },
  });

  return {
    updateSchoolYear: mutation.mutate,
    updateSchoolYearAsync: mutation.mutateAsync,
    isLoading: mutation.isPending,
    isError: mutation.isError,
    isSuccess: mutation.isSuccess,
    error: mutation.error,
    data: mutation.data,
    reset: mutation.reset,
  };
}

/**
 * Hook to delete a school year (soft delete)
 */
export function useDeleteSchoolYear() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({ id, deletedBy }: { id: string; deletedBy?: string }) =>
      SchoolYearApi.deleteSchoolYear(id, deletedBy ? { deletedBy } : undefined),
    onSuccess: (_, variables) => {
      // Invalidate and refetch school year lists
      queryClient.invalidateQueries({ queryKey: schoolYearKeys.lists() });
      queryClient.invalidateQueries({ queryKey: schoolYearKeys.stats() });

      toast.success("School year deleted successfully");
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      const message =
        error?.response?.data?.message || "Failed to delete school year";
      toast.error(message);
    },
  });

  return {
    deleteSchoolYear: mutation.mutate,
    deleteSchoolYearAsync: mutation.mutateAsync,
    isLoading: mutation.isPending,
    isError: mutation.isError,
    isSuccess: mutation.isSuccess,
    error: mutation.error,
    reset: mutation.reset,
  };
}

/**
 * Hook to restore a school year
 */
export function useRestoreSchoolYear() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({ id, restoredBy }: { id: string; restoredBy?: string }) =>
      SchoolYearApi.restoreSchoolYear(
        id,
        restoredBy ? { restoredBy } : undefined
      ),
    onSuccess: (restoredSchoolYear) => {
      // Invalidate and refetch school year lists
      queryClient.invalidateQueries({ queryKey: schoolYearKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: schoolYearKeys.tenant(restoredSchoolYear.tenantId),
      });
      queryClient.invalidateQueries({ queryKey: schoolYearKeys.stats() });

      toast.success(
        `School year "${restoredSchoolYear.name}" restored successfully!`
      );
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      const message =
        error?.response?.data?.message || "Failed to restore school year";
      toast.error(message);
    },
  });

  return {
    restoreSchoolYear: mutation.mutate,
    restoreSchoolYearAsync: mutation.mutateAsync,
    isLoading: mutation.isPending,
    isError: mutation.isError,
    isSuccess: mutation.isSuccess,
    error: mutation.error,
    data: mutation.data,
    reset: mutation.reset,
  };
}

/**
 * Hook to set a school year as default
 */
export function useSetDefaultSchoolYear() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({ id, setBy }: { id: string; setBy?: string }) =>
      SchoolYearApi.setAsDefault(id, setBy ? { setBy } : undefined),
    onSuccess: (defaultSchoolYear) => {
      // Invalidate and refetch school year lists
      queryClient.invalidateQueries({ queryKey: schoolYearKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: schoolYearKeys.tenant(defaultSchoolYear.tenantId),
      });
      queryClient.invalidateQueries({
        queryKey: schoolYearKeys.default(defaultSchoolYear.tenantId),
      });
      queryClient.invalidateQueries({ queryKey: schoolYearKeys.stats() });

      toast.success(`"${defaultSchoolYear.name}" set as default school year`);
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      const message =
        error?.response?.data?.message || "Failed to set default school year";
      toast.error(message);
    },
  });

  return {
    setDefaultSchoolYear: mutation.mutate,
    setDefaultSchoolYearAsync: mutation.mutateAsync,
    isLoading: mutation.isPending,
    isError: mutation.isError,
    isSuccess: mutation.isSuccess,
    error: mutation.error,
    data: mutation.data,
    reset: mutation.reset,
  };
}

/**
 * Hook to toggle school year status
 */
export function useToggleSchoolYearStatus() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (id: string) => SchoolYearApi.toggleStatus(id),
    onSuccess: (schoolYear) => {
      // Update the school year in cache
      queryClient.setQueryData(
        schoolYearKeys.detail(schoolYear.id),
        schoolYear
      );

      // Invalidate and refetch lists
      queryClient.invalidateQueries({ queryKey: schoolYearKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: schoolYearKeys.tenant(schoolYear.tenantId),
      });
      queryClient.invalidateQueries({ queryKey: schoolYearKeys.stats() });

      toast.success(`Status changed to ${schoolYear.status}`);
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      const message =
        error?.response?.data?.message || "Failed to toggle status";
      toast.error(message);
    },
  });

  return {
    toggleStatus: mutation.mutate,
    toggleStatusAsync: mutation.mutateAsync,
    isLoading: mutation.isPending,
    isError: mutation.isError,
    isSuccess: mutation.isSuccess,
    error: mutation.error,
    data: mutation.data,
    reset: mutation.reset,
  };
}

/**
 * Hook to activate a school year
 */
export function useActivateSchoolYear() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (id: string) => SchoolYearApi.activate(id),
    onSuccess: (schoolYear) => {
      queryClient.setQueryData(
        schoolYearKeys.detail(schoolYear.id),
        schoolYear
      );
      queryClient.invalidateQueries({ queryKey: schoolYearKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: schoolYearKeys.tenant(schoolYear.tenantId),
      });
      queryClient.invalidateQueries({ queryKey: schoolYearKeys.stats() });

      toast.success(`School year "${schoolYear.name}" activated`);
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      const message =
        error?.response?.data?.message || "Failed to activate school year";
      toast.error(message);
    },
  });

  return {
    activateSchoolYear: mutation.mutate,
    activateSchoolYearAsync: mutation.mutateAsync,
    isLoading: mutation.isPending,
    isError: mutation.isError,
    isSuccess: mutation.isSuccess,
    error: mutation.error,
    data: mutation.data,
    reset: mutation.reset,
  };
}

/**
 * Hook to archive a school year
 */
export function useArchiveSchoolYear() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (id: string) => SchoolYearApi.archive(id),
    onSuccess: (schoolYear) => {
      queryClient.setQueryData(
        schoolYearKeys.detail(schoolYear.id),
        schoolYear
      );
      queryClient.invalidateQueries({ queryKey: schoolYearKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: schoolYearKeys.tenant(schoolYear.tenantId),
      });
      queryClient.invalidateQueries({ queryKey: schoolYearKeys.stats() });

      toast.success(`School year "${schoolYear.name}" archived`);
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      const message =
        error?.response?.data?.message || "Failed to archive school year";
      toast.error(message);
    },
  });

  return {
    archiveSchoolYear: mutation.mutate,
    archiveSchoolYearAsync: mutation.mutateAsync,
    isLoading: mutation.isPending,
    isError: mutation.isError,
    isSuccess: mutation.isSuccess,
    error: mutation.error,
    data: mutation.data,
    reset: mutation.reset,
  };
}

/**
 * Hook for bulk operations
 */
export function useBulkSchoolYearOperations() {
  const queryClient = useQueryClient();

  const bulkUpdateStatus = useMutation({
    mutationFn: (data: BulkUpdateStatusDto) =>
      SchoolYearApi.bulkUpdateStatus(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: schoolYearKeys.lists() });
      queryClient.invalidateQueries({ queryKey: schoolYearKeys.stats() });

      toast.success(`Updated status for ${variables.ids.length} school years`);
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      const message =
        error?.response?.data?.message || "Failed to update school years";
      toast.error(message);
    },
  });

  const bulkDelete = useMutation({
    mutationFn: (data: BulkDeleteDto) => SchoolYearApi.bulkDelete(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: schoolYearKeys.lists() });
      queryClient.invalidateQueries({ queryKey: schoolYearKeys.stats() });

      toast.success(`Deleted ${variables.ids.length} school years`);
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      const message =
        error?.response?.data?.message || "Failed to delete school years";
      toast.error(message);
    },
  });

  return {
    bulkUpdateStatus: {
      mutate: bulkUpdateStatus.mutate,
      mutateAsync: bulkUpdateStatus.mutateAsync,
      isLoading: bulkUpdateStatus.isPending,
      isError: bulkUpdateStatus.isError,
      isSuccess: bulkUpdateStatus.isSuccess,
      error: bulkUpdateStatus.error,
      reset: bulkUpdateStatus.reset,
    },
    bulkDelete: {
      mutate: bulkDelete.mutate,
      mutateAsync: bulkDelete.mutateAsync,
      isLoading: bulkDelete.isPending,
      isError: bulkDelete.isError,
      isSuccess: bulkDelete.isSuccess,
      error: bulkDelete.error,
      reset: bulkDelete.reset,
    },
  };
}

/**
 * Utility hook to manage school year cache
 */
export function useSchoolYearCache() {
  const queryClient = useQueryClient();

  const clearCache = () => {
    queryClient.removeQueries({ queryKey: schoolYearKeys.all });
  };

  const prefetchSchoolYear = (id: string, includeDeleted?: boolean) => {
    queryClient.prefetchQuery({
      queryKey: schoolYearKeys.detail(id),
      queryFn: () => SchoolYearApi.getSchoolYear(id, includeDeleted),
      staleTime: 5 * 60 * 1000,
    });
  };

  const prefetchSchoolYears = (params?: SchoolYearQueryParams) => {
    queryClient.prefetchQuery({
      queryKey: schoolYearKeys.list(params || {}),
      queryFn: () => SchoolYearApi.getAllSchoolYears(params),
      staleTime: 2 * 60 * 1000,
    });
  };

  const prefetchTenantSchoolYears = (tenantId: string) => {
    queryClient.prefetchQuery({
      queryKey: schoolYearKeys.tenant(tenantId),
      queryFn: () => SchoolYearApi.getSchoolYearsByTenant(tenantId),
      staleTime: 2 * 60 * 1000,
    });
  };

  return {
    clearCache,
    prefetchSchoolYear,
    prefetchSchoolYears,
    prefetchTenantSchoolYears,
  };
}
