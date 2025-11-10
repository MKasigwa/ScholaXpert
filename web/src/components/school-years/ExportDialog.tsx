import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Checkbox } from "../ui/checkbox";
import { Separator } from "../ui/separator";
import { Alert, AlertDescription } from "../ui/alert";
import { Download, FileText, Info } from "lucide-react";
// import { SchoolYear, ExportOptions } from "./types";
// import { prepareExportData } from "./utils";
// import { EXPORT_FORMATS } from "./constants";
import { toast } from "sonner";
import * as XLSX from "xlsx";
import { SchoolYear } from "@/lib/types/school-year-types";
import { ExportOptions } from "@/lib/types/common";
import { prepareExportData } from "@/lib/utils/common";
import { EXPORT_FORMATS } from "@/lib/constants/common";

interface ExportDialogProps {
  open: boolean;
  onClose: () => void;
  data: SchoolYear[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  t?: any; // Translation function (optional)
}

// Default translations (fallback for React app)
const defaultTranslations = {
  title: "Export School Years",
  description: "Configure export options and download your data.",
  format: {
    label: "Export Format",
    csv: "CSV (Comma Separated Values)",
    csvDescription:
      "Simple format compatible with most spreadsheet applications",
    excel: "Excel (XLSX)",
    excelDescription: "Microsoft Excel format with enhanced formatting options",
  },
  includeOptions: "Include Options",
  includeAudit: "Include audit information (created/updated by, timestamps)",
  includeDeleted: "Include deleted school years",
  summary: {
    ready: "Ready to export",
    schoolYear: "school year",
    schoolYears: "school years",
    as: "as",
  },
  buttons: {
    cancel: "Cancel",
    export: "Export Data",
    exporting: "Exporting...",
  },
  success: "Successfully exported {count} school year(s) as {format}",
  error: "Failed to export data. Please try again.",
  noData: "No data to export",
};

export function ExportDialog({ open, onClose, data, t }: ExportDialogProps) {
  const [exportOptions, setExportOptions] = useState<ExportOptions>({
    format: "csv",
    includeAudit: false,
    includeDeleted: false,
  });
  const [isExporting, setIsExporting] = useState(false);

  // Use translations if provided, otherwise use defaults
  const translations = t
    ? {
        title: t("export.title"),
        description: t("export.description"),
        format: {
          label: t("export.format.label"),
          csv: t("export.format.csv"),
          csvDescription: t("export.format.csvDescription"),
          excel: t("export.format.excel"),
          excelDescription: t("export.format.excelDescription"),
        },
        includeOptions: t("export.includeOptions"),
        includeAudit: t("export.includeAudit"),
        includeDeleted: t("export.includeDeleted"),
        summary: {
          ready: t("export.summary.ready"),
          schoolYear: t("export.summary.schoolYear"),
          schoolYears: t("export.summary.schoolYears"),
          as: t("export.summary.as"),
        },
        buttons: {
          cancel: t("export.buttons.cancel"),
          export: t("export.buttons.export"),
          exporting: t("export.buttons.exporting"),
        },
        success: t("export.success"),
        error: t("export.error"),
        noData: t("export.summary.noData"),
      }
    : defaultTranslations;

  const downloadFile = (
    content: string | Blob,
    filename: string,
    type: string
  ) => {
    const blob =
      typeof content === "string" ? new Blob([content], { type }) : content;
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const convertToCSV = (data: any[]): string => {
    if (data.length === 0) return "";

    // Get headers (filter out undefined keys)
    const headers = Object.keys(data[0]).filter(
      (key) => data[0][key] !== undefined
    );

    // Create CSV header row
    const csvHeaders = headers.join(",");

    // Create CSV data rows
    const csvRows = data.map((row) => {
      return headers
        .map((header) => {
          const value = row[header];
          // Escape quotes and wrap in quotes if contains comma or newline
          if (value === null || value === undefined) return "";
          const stringValue = String(value);
          if (
            stringValue.includes(",") ||
            stringValue.includes("\n") ||
            stringValue.includes('"')
          ) {
            return `"${stringValue.replace(/"/g, '""')}"`;
          }
          return stringValue;
        })
        .join(",");
    });

    return [csvHeaders, ...csvRows].join("\n");
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const exportToExcel = (data: any[], filename: string) => {
    // Create a new workbook
    const wb = XLSX.utils.book_new();

    // Convert data to worksheet
    const ws = XLSX.utils.json_to_sheet(data);

    // Auto-size columns
    const colWidths = Object.keys(data[0] || {}).map((key) => ({
      wch:
        Math.max(
          key.length,
          ...data.map((row) => String(row[key] || "").length)
        ) + 2,
    }));
    ws["!cols"] = colWidths;

    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(wb, ws, "School Years");

    // Generate Excel file
    XLSX.writeFile(wb, filename);
  };

  const handleExport = async () => {
    setIsExporting(true);

    try {
      // Filter data based on options
      let exportData = data;
      if (!exportOptions.includeDeleted) {
        exportData = exportData.filter((item) => !item.deletedAt);
      }

      if (exportData.length === 0) {
        toast.error(translations.noData);
        setIsExporting(false);
        return;
      }

      // Prepare export data
      const preparedData = prepareExportData(
        exportData,
        exportOptions.includeAudit
      );

      // Remove undefined properties
      const cleanedData = preparedData.map((item) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const cleaned: any = {};
        Object.keys(item).forEach((key) => {
          if (item[key as keyof typeof item] !== undefined) {
            cleaned[key] = item[key as keyof typeof item];
          }
        });
        return cleaned;
      });

      // Generate filename with timestamp
      const timestamp = new Date().toISOString().split("T")[0];
      const filename = `school-years-${timestamp}`;

      // Export based on format
      if (exportOptions.format === "csv") {
        const csvContent = convertToCSV(cleanedData);
        downloadFile(csvContent, `${filename}.csv`, "text/csv;charset=utf-8;");
      } else if (exportOptions.format === "xlsx") {
        exportToExcel(cleanedData, `${filename}.xlsx`);
      }

      const successMessage = translations.success
        .replace("{count}", cleanedData.length.toString())
        .replace("{format}", exportOptions.format.toUpperCase());
      toast.success(successMessage);
      onClose();
    } catch (error) {
      console.error("Export error:", error);
      toast.error(translations.error);
    } finally {
      setIsExporting(false);
    }
  };

  const getExportSummary = () => {
    let count = data.length;
    if (!exportOptions.includeDeleted) {
      count = data.filter((item) => !item.deletedAt).length;
    }
    return count;
  };

  const selectedFormat = EXPORT_FORMATS.find(
    (f) => f.value === exportOptions.format
  );

  // Get format description based on selected format
  const getFormatDescription = () => {
    if (exportOptions.format === "csv") {
      return translations.format.csvDescription;
    } else if (exportOptions.format === "xlsx") {
      return translations.format.excelDescription;
    }
    return "";
  };

  // Get format label based on selected format
  const getFormatLabel = (value: string) => {
    if (value === "csv") {
      return translations.format.csv;
    } else if (value === "xlsx") {
      return translations.format.excel;
    }
    return value.toUpperCase();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            {translations.title}
          </DialogTitle>
          <DialogDescription>{translations.description}</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Format Selection */}
          <div className="space-y-2">
            <Label>{translations.format.label}</Label>
            <Select
              value={exportOptions.format}
              onValueChange={(value) =>
                setExportOptions((prev) => ({
                  ...prev,
                  format: value as "csv" | "xlsx",
                }))
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {EXPORT_FORMATS.map((format) => (
                  <SelectItem key={format.value} value={format.value}>
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      {getFormatLabel(format.value)}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              {getFormatDescription()}
            </p>
          </div>

          <Separator />

          {/* Include Options */}
          <div className="space-y-4">
            <Label>{translations.includeOptions}</Label>

            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="includeAudit"
                  checked={exportOptions.includeAudit}
                  onCheckedChange={(checked) =>
                    setExportOptions((prev) => ({
                      ...prev,
                      includeAudit: checked as boolean,
                    }))
                  }
                />
                <Label htmlFor="includeAudit" className="text-sm font-normal">
                  {translations.includeAudit}
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="includeDeleted"
                  checked={exportOptions.includeDeleted}
                  onCheckedChange={(checked) =>
                    setExportOptions((prev) => ({
                      ...prev,
                      includeDeleted: checked as boolean,
                    }))
                  }
                />
                <Label htmlFor="includeDeleted" className="text-sm font-normal">
                  {translations.includeDeleted}
                </Label>
              </div>
            </div>
          </div>

          {/* Export Summary */}
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              {translations.summary.ready} {getExportSummary()}{" "}
              {getExportSummary() !== 1
                ? translations.summary.schoolYears
                : translations.summary.schoolYear}{" "}
              {translations.summary.as} {exportOptions.format.toUpperCase()}.
            </AlertDescription>
          </Alert>

          {/* Actions */}
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>
              {translations.buttons.cancel}
            </Button>
            <Button onClick={handleExport} disabled={isExporting}>
              {isExporting
                ? translations.buttons.exporting
                : translations.buttons.export}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
