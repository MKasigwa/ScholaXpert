"use client";

import api from "@/lib/api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

// Types
export interface SchoolYear {
  id: string;
  name: string;
  code: string;
  startDate: string;
  endDate: string;
  isDefault: boolean;
  isCurrent?: boolean;
  status: string;
  description?: string;
  tenantId: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface SchoolYearQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  tenantId?: string;
  isDefault?: boolean;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface CreateSchoolYearDto {
  name: string;
  code: string;
  startDate: string;
  endDate: string;
  description?: string;
  isDefault?: boolean;
  status?: string;
  tenantId: string;
  createdBy: string;
}

export interface UpdateSchoolYearDto {
  name?: string;
  code?: string;
  startDate?: string;
  endDate?: string;
  description?: string;
  isDefault?: boolean;
  status?: string;
  updatedBy: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

/**
 * Hook to get all school years with pagination and filtering
 */
export function useSchoolYears(
  params?: SchoolYearQueryParams & { enabled?: boolean }
) {
  const { data: session, status } = useSession();
  const { enabled, ...queryParams } = params || {};

  const query = useQuery({
    queryKey: ["school-years", queryParams],
    queryFn: async () => {
      const response = await api.get<PaginatedResponse<SchoolYear>>(
        "/school-years",
        {
          params: queryParams,
        }
      );
      return response.data;
    },
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
) {
  const { data: session, status } = useSession();

  const query = useQuery({
    queryKey: ["school-years", "tenant", tenantId],
    queryFn: async () => {
      const response = await api.get<SchoolYear[]>(
        `/school-years/tenant/${tenantId}`
      );
      return response.data;
    },
    enabled: status === "authenticated" && !!tenantId && enabled,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });

  return {
    schoolYears: query.data || [],
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
}

/**
 * Hook to get a single school year by ID
 */
export function useSchoolYear(id: string | undefined, enabled: boolean = true) {
  const { data: session, status } = useSession();

  const query = useQuery({
    queryKey: ["school-year", id],
    queryFn: async () => {
      const response = await api.get<SchoolYear>(`/school-years/${id}`);
      return response.data;
    },
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
 * Hook to create a new school year
 */
export function useCreateSchoolYear() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (data: CreateSchoolYearDto) => {
      const response = await api.post<SchoolYear>("/school-years", data);
      return response.data;
    },
    onSuccess: (schoolYear) => {
      queryClient.invalidateQueries({ queryKey: ["school-years"] });
      toast.success("School year created successfully");
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || "Failed to create school year"
      );
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
    mutationFn: async (data: UpdateSchoolYearDto) => {
      const response = await api.put<SchoolYear>(`/school-years/${id}`, data);
      return response.data;
    },
    onSuccess: (schoolYear) => {
      queryClient.invalidateQueries({ queryKey: ["school-years"] });
      queryClient.invalidateQueries({ queryKey: ["school-year", id] });
      toast.success("School year updated successfully");
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || "Failed to update school year"
      );
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
 * Hook to delete a school year
 */
export function useDeleteSchoolYear() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await api.delete(`/school-years/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["school-years"] });
      toast.success("School year deleted successfully");
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || "Failed to delete school year"
      );
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
 * Hook to set a school year as default
 */
export function useSetDefaultSchoolYear() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async ({ id, setBy }: { id: string; setBy: string }) => {
      const response = await api.post<SchoolYear>(
        `/school-years/${id}/set-default`,
        { setBy }
      );
      return response.data;
    },
    onSuccess: (schoolYear) => {
      queryClient.invalidateQueries({ queryKey: ["school-years"] });
      toast.success(`${schoolYear.name} set as default`);
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || "Failed to set default school year"
      );
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
