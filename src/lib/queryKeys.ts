/** TanStack Query の queryKey を一元管理 */
export const queryKeys = {
  dashboard: {
    all: ["dashboard"] as const,
    summary: (userId: string, departmentId: string | null) =>
      [...queryKeys.dashboard.all, "summary", userId, departmentId ?? ""] as const,
  },
  incidentReports: {
    all: ["incidentReports"] as const,
    list: (userId: string, departmentId: string | null) =>
      [...queryKeys.incidentReports.all, "list", userId, departmentId ?? ""] as const,
  },
  departmentAnnouncements: {
    all: ["departmentAnnouncements"] as const,
    list: (userId: string, departmentId: string | null) =>
      [...queryKeys.departmentAnnouncements.all, "list", userId, departmentId ?? ""] as const,
  },
} as const;
