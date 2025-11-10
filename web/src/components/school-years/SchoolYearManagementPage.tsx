"use client";

import { useState, useMemo, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
// import { useAppStore } from "../store/useAppStore";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import {
  Calendar,
  Plus,
  Search,
  Filter,
  Download,
  MoreVertical,
  Eye,
  Edit,
  Archive,
  Trash2,
  RotateCcw,
  Star,
  StarOff,
  AlertTriangle,
  CheckCircle,
  Clock,
  SortAsc,
  SortDesc,
  X,
  FileText,
} from "lucide-react";

// Import hooks
import {
  useSchoolYears,
  useSchoolYearStats,
  useCreateSchoolYear,
  useUpdateSchoolYear,
  useDeleteSchoolYear,
  useRestoreSchoolYear,
  useSetDefaultSchoolYear,
  useArchiveSchoolYear,
  useActivateSchoolYear,
  useBulkSchoolYearOperations,
} from "@/hooks/useSchoolYears";

// Import types
import type {
  SchoolYear,
  SchoolYearStatus,
  SchoolYearQueryParams,
  CreateSchoolYearDto,
  UpdateSchoolYearDto,
  SchoolYearStats,
} from "@/lib/types/school-year-types";

// Import sub-components from the React project (we'll use them as-is for now)
// import { SchoolYearForm } from "../../components/schoolYear/SchoolYearForm";
import { SchoolYearDetails } from "./SchoolYearDetails";
// import { AuditLogViewer } from "../../components/schoolYear/AuditLogViewer";
import { ExportDialog } from "./ExportDialog";
// import { BulkActions } from "../../components/schoolYear/BulkActions";
import { useAppStore } from "../../../store/useAppStore";

// Utility functions
const getStatusColor = (status: string) => {
  switch (status) {
    case "active":
      return "bg-green-500 text-white";
    case "draft":
      return "bg-yellow-500 text-white";
    case "archived":
      return "bg-blue-500 text-white";
    default:
      return "bg-gray-500 text-white";
  }
};

const formatDate = (date: string | Date) => {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const formatDateRange = (startDate: string | Date, endDate: string | Date) => {
  return `${formatDate(startDate)} - ${formatDate(endDate)}`;
};

interface LocalFilters {
  search: string;
  status: SchoolYearStatus | "all";
  showDeleted: boolean;
}

interface SortOptions {
  field: string;
  direction: "asc" | "desc";
}

export function SchoolYearManagementWithApi() {
  const t = useTranslations("SchoolYearManagement");
  const { data: session } = useSession();
  const selectedTenant = useAppStore((state) => state.selectedTenant);

  // Local state
  const [localFilters, setLocalFilters] = useState<LocalFilters>({
    search: "",
    status: "all",
    showDeleted: false,
  });
  const [sortOptions, setSortOptions] = useState<SortOptions>({
    field: "startDate",
    direction: "desc",
  });
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [modals, setModals] = useState({
    create: false,
    edit: false,
    view: false,
    delete: false,
    restore: false,
    setDefault: false,
    archive: false,
    bulkActions: false,
    export: false,
    auditLog: false,
  });
  const [selectedYear, setSelectedYear] = useState<SchoolYear | null>(null);

  // Build query params
  const queryParams: SchoolYearQueryParams = useMemo(() => {
    const params: SchoolYearQueryParams = {
      tenantId: selectedTenant?.id,
      //   sortBy: sortOptions.field,
      //   sortDirection: sortOptions.direction === "asc" ? "ASC" : "DESC",
      includeDeleted: localFilters.showDeleted,
    };

    if (localFilters.search) {
      params.search = localFilters.search;
    }

    if (localFilters.status !== "all") {
      params.status = localFilters.status;
    }

    return params;
  }, [selectedTenant?.id, localFilters, sortOptions]);

  // Fetch school years
  const { schoolYears, meta, isLoading, isError, error, refetch, isFetching } =
    useSchoolYears({
      ...queryParams,
      enabled: !!selectedTenant?.id,
    });

  // Fetch statistics
  const { stats, isLoading: statsLoading } = useSchoolYearStats(
    selectedTenant?.id,
    !!selectedTenant?.id
  );

  // Mutations
  const createMutation = useCreateSchoolYear();
  const updateMutation = useUpdateSchoolYear(selectedYear?.id || "");
  const deleteMutation = useDeleteSchoolYear();
  const restoreMutation = useRestoreSchoolYear();
  const setDefaultMutation = useSetDefaultSchoolYear();
  const archiveMutation = useArchiveSchoolYear();
  const activateMutation = useActivateSchoolYear();
  const bulkOperations = useBulkSchoolYearOperations();

  // Calculate local stats if API stats aren't available
  const localStats = useMemo(() => {
    const activeYears = schoolYears?.filter((y) => !y.deletedAt) || [];
    return {
      total: schoolYears?.length || 0,
      active: activeYears.filter((y) => y.status === "active").length,
      draft: activeYears.filter((y) => y.status === "draft").length,
      archived: activeYears.filter((y) => y.status === "archived").length,
      deleted: schoolYears?.filter((y) => y.deletedAt).length || 0,
    };
  }, [schoolYears]);

  // Find default year
  const defaultYear = useMemo(() => {
    return schoolYears?.find((y) => y.isDefault && !y.deletedAt);
  }, [schoolYears]);

  // Modal handlers
  const openModal = (modal: keyof typeof modals, year?: SchoolYear) => {
    setSelectedYear(year || null);
    setModals((prev) => ({ ...prev, [modal]: true }));
  };

  const closeModal = (modal: keyof typeof modals) => {
    setModals((prev) => ({ ...prev, [modal]: false }));
    setSelectedYear(null);
  };

  // Filter handlers
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleFilterChange = (key: keyof LocalFilters, value: any) => {
    setLocalFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleSortChange = (field: string) => {
    setSortOptions((prev) => ({
      field,
      direction:
        prev.field === field && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  const clearFilters = () => {
    setLocalFilters({
      search: "",
      status: "all",
      showDeleted: false,
    });
  };

  // Selection handlers
  const handleSelectItem = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedItems((prev) => [...prev, id]);
    } else {
      setSelectedItems((prev) => prev.filter((item) => item !== id));
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedItems(schoolYears?.map((year) => year.id) || []);
    } else {
      setSelectedItems([]);
    }
  };

  // CRUD operation handlers
  const handleCreateYear = async (data: CreateSchoolYearDto) => {
    try {
      await createMutation.createSchoolYearAsync({
        ...data,
        tenantId: selectedTenant!.id,
      });
      closeModal("create");
      refetch();
    } catch (error) {
      console.error("Create error:", error);
    }
  };

  const handleUpdateYear = async (data: UpdateSchoolYearDto) => {
    if (!selectedYear) return;
    try {
      await updateMutation.updateSchoolYearAsync(data);
      closeModal("edit");
      refetch();
    } catch (error) {
      console.error("Update error:", error);
    }
  };

  const handleDeleteYear = async () => {
    if (!selectedYear) return;
    try {
      await deleteMutation.deleteSchoolYearAsync({
        id: selectedYear.id,
        deletedBy: session?.user?.id,
      });
      closeModal("delete");
      refetch();
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  const handleRestoreYear = async () => {
    if (!selectedYear) return;
    try {
      await restoreMutation.restoreSchoolYearAsync({
        id: selectedYear.id,
        restoredBy: session?.user?.id,
      });
      closeModal("restore");
      refetch();
    } catch (error) {
      console.error("Restore error:", error);
    }
  };

  const handleSetDefault = async () => {
    if (!selectedYear) return;
    try {
      await setDefaultMutation.setDefaultSchoolYearAsync({
        id: selectedYear.id,
        setBy: session?.user?.id,
      });
      closeModal("setDefault");
      refetch();
    } catch (error) {
      console.error("Set default error:", error);
    }
  };

  const handleArchiveYear = async () => {
    if (!selectedYear) return;
    try {
      await archiveMutation.archiveSchoolYearAsync(selectedYear.id);
      closeModal("archive");
      refetch();
    } catch (error) {
      console.error("Archive error:", error);
    }
  };

  const handleActivateYear = async (year: SchoolYear) => {
    try {
      await activateMutation.activateSchoolYearAsync(year.id);
      refetch();
    } catch (error) {
      console.error("Activate error:", error);
    }
  };

  const getSortIcon = (field: string) => {
    if (sortOptions.field !== field) return null;
    return sortOptions.direction === "asc" ? (
      <SortAsc className="h-4 w-4" />
    ) : (
      <SortDesc className="h-4 w-4" />
    );
  };

  // Check if tenant is selected
  if (!selectedTenant) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-500" />
              {t("selectTenant")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">{t("errors.noTenant")}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show loading skeleton
  if (isLoading && !schoolYears) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-10 w-64" />
          <div className="flex gap-2">
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-10 w-32" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
        <Skeleton className="h-96" />
      </div>
    );
  }

  // Show error state
  if (isError && !schoolYears) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="h-5 w-5" />
              {t("errors.loadFailed")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              {error?.message || t("errors.loadFailed")}
            </p>
            <Button onClick={() => refetch()} className="w-full">
              <RotateCcw className="h-4 w-4 mr-2" />
              {t("errors.retry")}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl">{t("title")}</h3>
          <p className="text-muted-foreground">{t("description")}</p>
        </div>
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            onClick={() => refetch()}
            disabled={isFetching}
          >
            <RotateCcw
              className={`h-4 w-4 mr-2 ${isFetching ? "animate-spin" : ""}`}
            />
            {t("actions.refresh")}
          </Button>
          <Button variant="outline" onClick={() => openModal("export")}>
            <Download className="h-4 w-4 mr-2" />
            {t("actions.export")}
          </Button>
          <Button onClick={() => openModal("create")}>
            <Plus className="h-4 w-4 mr-2" />
            {t("actions.create")}
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">{t("stats.total")}</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">
              {stats?.totalSchoolYears || localStats.total}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">{t("stats.active")}</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl text-green-600">
              {stats?.activeSchoolYears || localStats.active}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">{t("stats.draft")}</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl text-yellow-600">
              {stats?.draftSchoolYears || localStats.draft}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">{t("stats.archived")}</CardTitle>
            <Archive className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl text-blue-600">
              {stats?.archivedSchoolYears || localStats.archived}
              {/* {localStats.archived} */}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">{t("stats.default")}</CardTitle>
            <Star className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-lg truncate">
              {defaultYear?.name || "None"}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            {t("filters.search")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap items-center gap-4">
            {/* Search */}
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder={t("filters.search")}
                  value={localFilters.search}
                  onChange={(e) => handleFilterChange("search", e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Status Filter */}
            <Select
              value={localFilters.status}
              onValueChange={(value) =>
                handleFilterChange("status", value as SchoolYearStatus | "all")
              }
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("filters.allStatuses")}</SelectItem>
                <SelectItem value="active">{t("filters.active")}</SelectItem>
                <SelectItem value="draft">{t("filters.draft")}</SelectItem>
                <SelectItem value="archived">
                  {t("filters.archived")}
                </SelectItem>
              </SelectContent>
            </Select>

            {/* Show Deleted Toggle */}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="showDeleted"
                checked={localFilters.showDeleted}
                onChange={(e) =>
                  handleFilterChange("showDeleted", e.target.checked)
                }
                className="h-4 w-4"
              />
              <label htmlFor="showDeleted" className="text-sm">
                {t("filters.showDeleted")}
              </label>
            </div>

            {/* Clear Filters */}
            {(localFilters.search ||
              localFilters.status !== "all" ||
              localFilters.showDeleted) && (
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                <X className="h-4 w-4 mr-2" />
                {t("filters.clearFilters")}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* School Years Table/List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>{t("title")}</CardTitle>
            {selectedItems.length > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => openModal("bulkActions")}
              >
                {t("actions.bulkActions")} ({selectedItems.length})
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {schoolYears && schoolYears.length > 0 ? (
            <div className="space-y-4">
              {schoolYears.map((year) => (
                <div
                  key={year.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <input
                      type="checkbox"
                      checked={selectedItems.includes(year.id)}
                      onChange={(e) =>
                        handleSelectItem(year.id, e.target.checked)
                      }
                      className="h-4 w-4"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium">{year.name}</h4>
                        <Badge className={getStatusColor(year.status)}>
                          {t(`status.${year.status}`)}
                        </Badge>
                        {year.isDefault && (
                          <Badge variant="outline" className="gap-1">
                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                            {t("table.isDefault")}
                          </Badge>
                        )}
                        {year.deletedAt && (
                          <Badge variant="destructive">
                            {t("status.deleted")}
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                        <span>{year.code}</span>
                        <span>•</span>
                        <span>
                          {formatDateRange(year.startDate, year.endDate)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => openModal("view", year)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    {!year.deletedAt && (
                      <>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openModal("edit", year)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openModal("delete", year)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                    {year.deletedAt && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedYear(year);
                          openModal("restore", year);
                        }}
                      >
                        <RotateCcw className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Calendar className="h-12 w-12 mx-auto text-muted-foreground/50" />
              <h3 className="mt-4 text-lg">{t("table.noResults")}</h3>
              <p className="text-muted-foreground mt-2">
                {localFilters.search || localFilters.status !== "all"
                  ? t("filters.clearFilters")
                  : t("table.noResults")}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modals */}
      {/* {modals.create && (
        <SchoolYearForm
          open={modals.create}
          onClose={() => closeModal("create")}
          onSubmit={handleCreateYear}
          isLoading={createMutation.isLoading}
          translations={t}
        />
      )} */}

      {/* {modals.edit && selectedYear && (
        <SchoolYearForm
          open={modals.edit}
          onClose={() => closeModal("edit")}
          onSubmit={handleUpdateYear}
          isLoading={updateMutation.isLoading}
          initialData={selectedYear}
          mode="edit"
          translations={t}
        />
      )}*/}

      {modals.view && selectedYear && (
        <SchoolYearDetails
          open={modals.view}
          onClose={() => closeModal("view")}
          schoolYear={selectedYear}
          // translations={t}
        />
      )}

      {modals.delete && selectedYear && (
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <p>{t("delete.description")}</p>
            <div className="flex gap-2 mt-4">
              <Button
                variant="destructive"
                onClick={handleDeleteYear}
                disabled={deleteMutation.isLoading}
              >
                {deleteMutation.isLoading
                  ? t("delete.deleting")
                  : t("delete.confirm")}
              </Button>
              <Button variant="outline" onClick={() => closeModal("delete")}>
                {t("delete.cancel")}
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {modals.restore && selectedYear && (
        <Alert>
          <AlertDescription>
            <p>{t("restore.description")}</p>
            <div className="flex gap-2 mt-4">
              <Button
                onClick={handleRestoreYear}
                disabled={restoreMutation.isLoading}
              >
                {restoreMutation.isLoading
                  ? t("restore.restoring")
                  : t("restore.confirm")}
              </Button>
              <Button variant="outline" onClick={() => closeModal("restore")}>
                {t("restore.cancel")}
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {modals.archive && selectedYear && (
        <Alert>
          <AlertDescription>
            <p>{t("archive.description")}</p>
            <div className="flex gap-2 mt-4">
              <Button
                onClick={handleArchiveYear}
                disabled={archiveMutation.isLoading}
              >
                {archiveMutation.isLoading
                  ? t("archive.archiving")
                  : t("archive.confirm")}
              </Button>
              <Button variant="outline" onClick={() => closeModal("archive")}>
                {t("archive.cancel")}
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {modals.setDefault && selectedYear && (
        <Alert>
          <AlertDescription>
            <p>{t("setDefault.description")}</p>
            <div className="flex gap-2 mt-4">
              <Button
                onClick={handleSetDefault}
                disabled={setDefaultMutation.isLoading}
              >
                {setDefaultMutation.isLoading
                  ? t("setDefault.setting")
                  : t("setDefault.confirm")}
              </Button>
              <Button
                variant="outline"
                onClick={() => closeModal("setDefault")}
              >
                {t("setDefault.cancel")}
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {modals.export && (
        <ExportDialog
          open={modals.export}
          onClose={() => closeModal("export")}
          data={schoolYears || []}
          t={t}
        />
      )}
      {/* 
      {modals.bulkActions && (
        <BulkActions
          open={modals.bulkActions}
          onClose={() => closeModal("bulkActions")}
          selectedIds={selectedItems}
          schoolYears={schoolYears || []}
          onSuccess={() => {
            setSelectedItems([]);
            refetch();
          }}
          translations={t}
        />
      )} */}
    </div>
  );
}
