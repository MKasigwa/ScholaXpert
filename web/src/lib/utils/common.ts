import { SchoolYear } from "../types/school-year-types";

// Date utilities
export const formatDate = (date: string): string => {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

// Export utilities
export const prepareExportData = (
  years: SchoolYear[],
  includeAudit: boolean = false
) => {
  return years.map((year) => ({
    Name: year.name,
    Code: year.code,
    "Start Date": formatDate(year.startDate),
    "End Date": formatDate(year.endDate),
    Status: year.status,
    "Is Default": year.isDefault ? "Yes" : "No",
    "Created At": includeAudit
      ? new Date(year.createdAt).toLocaleString()
      : undefined,
    "Created By": includeAudit ? year.createdBy : undefined,
    "Updated At": includeAudit
      ? new Date(year.updatedAt).toLocaleString()
      : undefined,
    "Updated By": includeAudit ? year.updatedBy : undefined,
    "Deleted At":
      includeAudit && year.deletedAt
        ? new Date(year.deletedAt).toLocaleString()
        : undefined,
    "Deleted By": includeAudit ? year.deletedBy : undefined,
  }));
};

export const formatDateRange = (startDate: string, endDate: string): string => {
  const start = formatDate(startDate);
  const end = formatDate(endDate);
  return `${start} – ${end}`;
};
