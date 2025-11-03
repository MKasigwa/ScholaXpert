"use client";

import { useState, useEffect } from "react";
import { Check, ChevronsUpDown, Building2, Plus, Lock } from "lucide-react";
import { useTranslations } from "next-intl";
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
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
// import { useAppStore, Tenant } from "@/store/useAppStore";
import { useTenantSummary } from "@/hooks/useTenant";
import { useSession } from "next-auth/react";
import { cn } from "@/lib/utils";
import { Tenant, useAppStore } from "../../../store/useAppStore";

interface TenantSwitcherProps {
  compact?: boolean;
  onCreateTenant?: () => void;
}

export function TenantSwitcher({
  compact = false,
  onCreateTenant,
}: TenantSwitcherProps) {
  const [open, setOpen] = useState(false);
  const t = useTranslations("Dashboard.context");

  // Get session to access user's tenantId and role
  const { data: session } = useSession();

  // Get selected tenant from Zustand
  const { selectedTenant, setSelectedTenant } = useAppStore();

  // Fetch tenants from React Query
  const { tenants: tenantsList, isLoading: isLoadingTenants } =
    useTenantSummary();

  // Convert to Tenant[] format for the store
  const tenants: Tenant[] = tenantsList.map((t) => ({
    id: t.id,
    name: t.name,
    code: t.slug,
    type: "",
    status: t.status,
  }));

  // Check if user is super_admin
  const isSuperAdmin = session?.user?.role === "super_admin";

  // Check if user has a tenant
  const userTenantId = session?.user?.tenantId;

  // Auto-select user's tenant from session on mount
  useEffect(() => {
    if (userTenantId && !selectedTenant && tenants.length > 0) {
      // Find the user's tenant in the list
      const userTenant = tenants.find((t) => t.id === userTenantId);
      if (userTenant) {
        console.log("Auto-selecting user tenant:", userTenant);
        setSelectedTenant(userTenant);
      }
    }
  }, [userTenantId, selectedTenant, tenants, setSelectedTenant]);

  const handleSelectTenant = (tenant: Tenant) => {
    setSelectedTenant(tenant);
    setOpen(false);
  };

  const triggerButton = (
    <Button
      variant="outline"
      role="combobox"
      aria-expanded={open}
      disabled={!isSuperAdmin}
      className={cn(
        "justify-between",
        compact ? "w-full" : "w-[280px]",
        !isSuperAdmin && "cursor-not-allowed opacity-60"
      )}
    >
      {selectedTenant ? (
        <div className="flex items-center gap-2 truncate">
          <Building2 className="h-4 w-4 shrink-0 text-muted-foreground" />
          <span className="truncate">{selectedTenant.name}</span>
          {selectedTenant.status === "active" && (
            <Badge
              variant="secondary"
              className="ml-auto shrink-0 h-5 px-1.5 text-xs"
            >
              {t("tenant")}
            </Badge>
          )}
          {!isSuperAdmin && (
            <Lock className="h-3.5 w-3.5 ml-auto shrink-0 text-muted-foreground" />
          )}
        </div>
      ) : (
        <div className="flex items-center gap-2 text-muted-foreground">
          <Building2 className="h-4 w-4" />
          <span>{t("selectSchoolYear")}</span>
          {!isSuperAdmin && <Lock className="h-3.5 w-3.5 ml-auto shrink-0" />}
        </div>
      )}
      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
    </Button>
  );

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>{triggerButton}</PopoverTrigger>
            <PopoverContent className="w-[320px] p-0" align="start">
              <Command>
                <CommandInput placeholder={t("selectSchoolYear")} />
                <CommandList>
                  {isLoadingTenants ? (
                    <div className="py-6 text-center text-sm text-muted-foreground">
                      {t("noSchoolYear")}
                    </div>
                  ) : (
                    <>
                      <CommandEmpty>{t("noSchoolYear")}</CommandEmpty>
                      <CommandGroup heading={t("tenant")}>
                        {tenants.map((tenant) => (
                          <CommandItem
                            key={tenant.id}
                            value={tenant.name}
                            onSelect={() => handleSelectTenant(tenant)}
                            className="cursor-pointer"
                          >
                            <div className="flex items-center gap-2 flex-1">
                              <Building2 className="h-4 w-4 text-muted-foreground" />
                              <div className="flex-1 min-w-0">
                                <p className="truncate">{tenant.name}</p>
                                {tenant.code && (
                                  <p className="text-xs text-muted-foreground truncate">
                                    {tenant.code}
                                  </p>
                                )}
                              </div>
                              {selectedTenant?.id === tenant.id && (
                                <Check className="h-4 w-4 shrink-0" />
                              )}
                            </div>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </>
                  )}
                </CommandList>

                {onCreateTenant && isSuperAdmin && (
                  <>
                    <Separator />
                    <div className="p-1">
                      <Button
                        variant="ghost"
                        className="w-full justify-start h-9 px-2"
                        onClick={() => {
                          onCreateTenant();
                          setOpen(false);
                        }}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        {t("tenant")}
                      </Button>
                    </div>
                  </>
                )}
              </Command>
            </PopoverContent>
          </Popover>
        </TooltipTrigger>
        {!isSuperAdmin && (
          <TooltipContent>
            <p>{t("tenant")}</p>
          </TooltipContent>
        )}
      </Tooltip>
    </TooltipProvider>
  );
}
