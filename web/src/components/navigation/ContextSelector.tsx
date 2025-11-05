"use client";

import { useState } from "react";
import { ChevronDown, Building2, Calendar, Settings } from "lucide-react";
import { Button } from "../ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Separator } from "../ui/separator";
import { Badge } from "../ui/badge";
import { TenantSwitcher } from "./TenantSwitcher";
import { SchoolYearSwitcher } from "./SchoolYearSwitcher";
import { useAppStore } from "../../../store/useAppStore";
// import { useAppStore } from "@/store/useAppStore";

interface ContextSelectorProps {
  onCreateTenant?: () => void;
  onCreateYear?: () => void;
}

export function ContextSelector({
  onCreateTenant,
  onCreateYear,
}: ContextSelectorProps) {
  const [open, setOpen] = useState(false);

  const { selectedTenant, selectedYear } = useAppStore();

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          className="h-9 px-3 justify-start gap-2 max-w-[320px] hover:bg-muted/50 border border-transparent hover:border-border"
        >
          {selectedTenant ? (
            <div className="flex items-center gap-2 min-w-0">
              <div className="flex items-center gap-1.5">
                <Building2 className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium truncate max-w-[120px]">
                  {selectedTenant.name}
                </span>
              </div>

              {selectedYear && (
                <>
                  <span className="text-muted-foreground">•</span>
                  <div className="flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground truncate max-w-[80px]">
                      {selectedYear.name}
                    </span>
                    {(selectedYear.isDefault || selectedYear.isCurrent) && (
                      <Badge variant="secondary" className="h-4 px-1.5 text-xs">
                        Current
                      </Badge>
                    )}
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Settings className="h-4 w-4" />
              <span>Select Context</span>
            </div>
          )}
          <ChevronDown className="h-3.5 w-3.5 ml-auto opacity-50" />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-[380px] p-0" align="start">
        <div className="p-4 space-y-4">
          <div className="space-y-2">
            <h4 className="font-medium text-sm flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              Institution
            </h4>
            <TenantSwitcher compact={true} onCreateTenant={onCreateTenant} />
          </div>

          <Separator />

          <div className="space-y-2">
            <h4 className="font-medium text-sm flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              School Year
            </h4>
            <SchoolYearSwitcher
              compact={true}
              disabled={!selectedTenant}
              onCreateYear={onCreateYear}
            />
            {!selectedTenant && (
              <p className="text-xs text-muted-foreground">
                Select an institution first
              </p>
            )}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
