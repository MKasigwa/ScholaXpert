"use client";

import { useState, useMemo, useEffect } from "react";
import { Check, ChevronsUpDown, Calendar, Plus, Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useSession } from "next-auth/react";
import { Button } from "../ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Badge } from "../ui/badge";
import { Separator } from "../ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
// import { useAppStore, SchoolYear } from "@/store/useAppStore";
import {
  useSchoolYearsByTenant,
  useCreateSchoolYear,
} from "@/hooks/useSchoolYears";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { SchoolYear, useAppStore } from "../../../store/useAppStore";

interface SchoolYearSwitcherProps {
  compact?: boolean;
  disabled?: boolean;
  onCreateYear?: () => void;
}

export function SchoolYearSwitcher({
  compact = false,
  disabled = false,
  onCreateYear,
}: SchoolYearSwitcherProps) {
  const [open, setOpen] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    startDate: "",
    endDate: "",
    description: "",
  });

  const t = useTranslations("Dashboard.context");
  const tDialog = useTranslations("Dashboard.createSchoolYearDialog");
  const { data: session } = useSession();

  // Get selected states from Zustand
  const { selectedTenant, selectedYear, setSelectedYear } = useAppStore();

  // Fetch school years from React Query
  const {
    schoolYears: schoolYearsList,
    isLoading: isLoadingSchoolYears,
    refetch,
  } = useSchoolYearsByTenant(selectedTenant?.id, !!selectedTenant);

  // Create school year mutation
  const { createSchoolYearAsync, isLoading: isCreating } =
    useCreateSchoolYear();

  // Convert to SchoolYear[] format for the store
  const schoolYears: SchoolYear[] = schoolYearsList.map((sy) => ({
    id: sy.id,
    name: sy.name,
    startDate: sy.startDate,
    endDate: sy.endDate,
    isDefault: sy.isDefault,
    isCurrent: sy.isCurrent,
    status: sy.status,
  }));

  // Find current/default school year
  const currentSchoolYear = useMemo(() => {
    return schoolYears.find((sy) => sy.isCurrent || sy.isDefault) || null;
  }, [schoolYears]);

  // Check if user is admin or super_admin
  const canCreateSchoolYear = useMemo(() => {
    const userRole = session?.user?.role?.toLowerCase();
    return userRole === "admin" || userRole === "super_admin";
  }, [session?.user?.role]);

  // Auto-select default school year when tenant changes
  useEffect(() => {
    if (selectedTenant && schoolYears.length > 0 && !selectedYear) {
      // Find default or current school year
      const defaultYear =
        schoolYears.find((sy) => sy.isDefault || sy.isCurrent) ||
        schoolYears[0];
      setSelectedYear(defaultYear);
    }
  }, [selectedTenant, schoolYears, selectedYear, setSelectedYear]);

  // Auto-open create dialog when tenant has no school years (only for admins)
  useEffect(() => {
    if (
      selectedTenant &&
      schoolYears.length === 0 &&
      canCreateSchoolYear &&
      !isLoadingSchoolYears
    ) {
      setCreateDialogOpen(true);
    }
  }, [
    selectedTenant,
    schoolYears.length,
    canCreateSchoolYear,
    isLoadingSchoolYears,
  ]);

  const handleSelectYear = (year: SchoolYear) => {
    setSelectedYear(year);
    setOpen(false);
  };

  const handleCreateSchoolYear = async () => {
    if (!selectedTenant || !session?.user?.id) {
      toast.error(tDialog("errors.noTenant"));
      return;
    }

    if (
      !formData.name ||
      !formData.code ||
      !formData.startDate ||
      !formData.endDate
    ) {
      toast.error(tDialog("errors.requiredFields"));
      return;
    }

    try {
      const newSchoolYear = await createSchoolYearAsync({
        name: formData.name,
        code: formData.code,
        startDate: formData.startDate,
        endDate: formData.endDate,
        description: formData.description,
        isDefault: schoolYears.length === 0, // Set as default if it's the first one
        status: "active",
        tenantId: selectedTenant.id,
        createdBy: session.user.id,
      });

      // Convert to SchoolYear format and set as selected
      const schoolYearForStore: SchoolYear = {
        id: newSchoolYear.id,
        name: newSchoolYear.name,
        startDate: newSchoolYear.startDate,
        endDate: newSchoolYear.endDate,
        isDefault: newSchoolYear.isDefault,
        isCurrent: newSchoolYear.isCurrent,
        status: newSchoolYear.status,
      };

      setSelectedYear(schoolYearForStore);
      setCreateDialogOpen(false);
      setFormData({
        name: "",
        code: "",
        startDate: "",
        endDate: "",
        description: "",
      });

      // Refetch school years to update the list
      await refetch();
    } catch (error) {
      // Error is already handled by the mutation
      console.error("Failed to create school year:", error);
    }
  };

  const triggerButton = (
    <Button
      variant="outline"
      role="combobox"
      aria-expanded={open}
      disabled={disabled}
      className={cn("justify-between", compact ? "w-full" : "w-[240px]")}
    >
      {selectedYear ? (
        <div className="flex items-center gap-2 truncate">
          <Calendar className="h-4 w-4 shrink-0 text-muted-foreground" />
          <span className="truncate">{selectedYear.name}</span>
          {(selectedYear.isDefault || selectedYear.isCurrent) && (
            <Badge
              variant="secondary"
              className="ml-auto shrink-0 h-5 px-1.5 text-xs"
            >
              {t("schoolYear")}
            </Badge>
          )}
        </div>
      ) : (
        <div className="flex items-center gap-2 text-muted-foreground">
          <Calendar className="h-4 w-4" />
          <span>{t("selectSchoolYear")}</span>
        </div>
      )}
      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
    </Button>
  );

  return (
    <>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>{triggerButton}</PopoverTrigger>
        <PopoverContent className="w-[280px] p-0" align="start">
          <Command>
            <CommandInput
              placeholder={t("searchPlaceholder") || "Search school years..."}
            />
            <CommandList>
              {isLoadingSchoolYears ? (
                <div className="py-6 text-center text-sm text-muted-foreground">
                  {t("loading") || "Loading school years..."}
                </div>
              ) : (
                <>
                  <CommandEmpty>
                    {t("noResults") || "No school year found."}
                  </CommandEmpty>

                  {currentSchoolYear && (
                    <CommandGroup heading={t("current") || "Current"}>
                      <CommandItem
                        value={currentSchoolYear.name}
                        onSelect={() => handleSelectYear(currentSchoolYear)}
                        className="cursor-pointer"
                      >
                        <div className="flex items-center gap-2 flex-1">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <div className="flex-1 min-w-0">
                            <p className="truncate">{currentSchoolYear.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(
                                currentSchoolYear.startDate
                              ).toLocaleDateString()}{" "}
                              -{" "}
                              {new Date(
                                currentSchoolYear.endDate
                              ).toLocaleDateString()}
                            </p>
                          </div>
                          {selectedYear?.id === currentSchoolYear.id && (
                            <Check className="h-4 w-4 shrink-0" />
                          )}
                        </div>
                      </CommandItem>
                    </CommandGroup>
                  )}

                  <CommandGroup heading={t("allYears") || "All School Years"}>
                    {schoolYears
                      .filter((year) => year.id !== currentSchoolYear?.id)
                      .map((year) => (
                        <CommandItem
                          key={year.id}
                          value={year.name}
                          onSelect={() => handleSelectYear(year)}
                          className="cursor-pointer"
                        >
                          <div className="flex items-center gap-2 flex-1">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <div className="flex-1 min-w-0">
                              <p className="truncate">{year.name}</p>
                              <p className="text-xs text-muted-foreground">
                                {new Date(year.startDate).toLocaleDateString()}{" "}
                                - {new Date(year.endDate).toLocaleDateString()}
                              </p>
                            </div>
                            {selectedYear?.id === year.id && (
                              <Check className="h-4 w-4 shrink-0" />
                            )}
                          </div>
                        </CommandItem>
                      ))}
                  </CommandGroup>
                </>
              )}
            </CommandList>

            {(canCreateSchoolYear || onCreateYear) && (
              <>
                <Separator />
                <div className="p-1">
                  <Button
                    variant="ghost"
                    className="w-full justify-start h-9 px-2"
                    onClick={() => {
                      if (onCreateYear) {
                        onCreateYear();
                      } else {
                        setCreateDialogOpen(true);
                      }
                      setOpen(false);
                    }}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    {t("createNew") || "Create New School Year"}
                  </Button>
                </div>
              </>
            )}
          </Command>
        </PopoverContent>
      </Popover>

      {/* Create School Year Dialog */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{tDialog("title")}</DialogTitle>
            <DialogDescription>{tDialog("description")}</DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">
                {tDialog("form.name.label")}{" "}
                <span className="text-destructive">*</span>
              </Label>
              <Input
                id="name"
                placeholder={tDialog("form.name.placeholder")}
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="code">
                {tDialog("form.code.label")}{" "}
                <span className="text-destructive">*</span>
              </Label>
              <Input
                id="code"
                placeholder={tDialog("form.code.placeholder")}
                value={formData.code}
                onChange={(e) =>
                  setFormData({ ...formData, code: e.target.value })
                }
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="startDate">
                  {tDialog("form.startDate.label")}{" "}
                  <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={(e) =>
                    setFormData({ ...formData, startDate: e.target.value })
                  }
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="endDate">
                  {tDialog("form.endDate.label")}{" "}
                  <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="endDate"
                  type="date"
                  value={formData.endDate}
                  onChange={(e) =>
                    setFormData({ ...formData, endDate: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">
                {tDialog("form.description.label")}
              </Label>
              <Textarea
                id="description"
                placeholder={tDialog("form.description.placeholder")}
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setCreateDialogOpen(false);
                setFormData({
                  name: "",
                  code: "",
                  startDate: "",
                  endDate: "",
                  description: "",
                });
              }}
              disabled={isCreating}
            >
              {tDialog("buttons.cancel")}
            </Button>
            <Button onClick={handleCreateSchoolYear} disabled={isCreating}>
              {isCreating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {tDialog("buttons.creating")}
                </>
              ) : (
                tDialog("buttons.create")
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
