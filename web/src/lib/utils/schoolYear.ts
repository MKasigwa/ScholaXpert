// Status color utilities
export const getStatusColor = (status: string): string => {
  const colors: Record<string, string> = {
    draft: "bg-gray-50 text-gray-700 border-gray-200",
    active: "bg-green-50 text-green-700 border-green-200",
    archived: "bg-blue-50 text-blue-700 border-blue-200",
    deleted: "bg-red-50 text-red-700 border-red-200",
  };
  return colors[status] || "bg-gray-50 text-gray-700 border-gray-200";
};
