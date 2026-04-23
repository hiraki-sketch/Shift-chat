import { useQuery } from "@tanstack/react-query";
import { useCallback, useMemo } from "react";
import type { Shift, User } from "../../types";
import { fetchDashboardSummary } from "../api/dashboard";
import { queryKeys } from "../lib/queryKeys";

export function useDashboardManagement(user: User) {
  const shifts = useMemo<Shift[]>(() => ["1勤", "2勤", "3勤"], []);

  const summaryQuery = useQuery({
    queryKey: queryKeys.dashboard.summary(user.id, user.departmentId),
    enabled: Boolean(user.departmentId),
    queryFn: () =>
      fetchDashboardSummary({
        departmentId: user.departmentId,
      }),
  });

  const sevDot = useCallback((s: string) => {
    const x = s.toLowerCase();
    if (x === "high") return "bg-red-500";
    if (x === "medium") return "bg-yellow-500";
    if (x === "low") return "bg-green-500";
    return "bg-gray-400";
  }, []);

  const unreadIncidents = summaryQuery.data?.unreadIncidents ?? [];
  const recentAnnouncements = summaryQuery.data?.recentAnnouncements ?? [];

  return {
    data: {
      shifts,
      unreadIncidents,
      recentAnnouncements,
    },
    utils: {
      sevDot,
    },
    query: {
      isPending: summaryQuery.isPending,
      isError: summaryQuery.isError,
      error: summaryQuery.error,
      refetch: summaryQuery.refetch,
    },
  };
}
