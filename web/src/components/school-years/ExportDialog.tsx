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
}

export function ExportDialog({ open, onClose, data }: ExportDialogProps) {
  const [exportOptions, setExportOptions] = useState<ExportOptions>({
    format: "csv",
    includeAudit: false,
    includeDeleted: false,
  });
  const [isExporting, setIsExporting] = useState(false);

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
        toast.error("No data to export");
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

      toast.success(
        `Successfully exported ${cleanedData.length} school year${
          cleanedData.length !== 1 ? "s" : ""
        } as ${exportOptions.format.toUpperCase()}`
      );
      onClose();
    } catch (error) {
      console.error("Export error:", error);
      toast.error("Failed to export data. Please try again.");
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

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            Export School Years
          </DialogTitle>
          <DialogDescription>
            Configure export options and download your data.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Format Selection */}
          <div className="space-y-2">
            <Label>Export Format</Label>
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
                      {format.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              {selectedFormat?.description}
            </p>
          </div>

          <Separator />

          {/* Include Options */}
          <div className="space-y-4">
            <Label>Include Options</Label>

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
                  Include audit information (created/updated by, timestamps)
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
                  Include deleted school years
                </Label>
              </div>
            </div>
          </div>

          {/* Export Summary */}
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              Ready to export {getExportSummary()} school year
              {getExportSummary() !== 1 ? "s" : ""} as{" "}
              {exportOptions.format.toUpperCase()}.
            </AlertDescription>
          </Alert>

          {/* Actions */}
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleExport} disabled={isExporting}>
              {isExporting ? "Exporting..." : "Export Data"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
