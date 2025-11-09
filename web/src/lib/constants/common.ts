// Export format options
export const EXPORT_FORMATS = [
  {
    value: "csv",
    label: "CSV (Comma Separated Values)",
    description: "Simple format compatible with most spreadsheet applications",
  },
  {
    value: "xlsx",
    label: "Excel (XLSX)",
    description: "Microsoft Excel format with enhanced formatting options",
  },
] as const;
