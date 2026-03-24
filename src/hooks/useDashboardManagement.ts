import { useCallback, useMemo } from "react";
import type { Shift, User } from "../../types";

type UnreadIncident = {
  id: string;
  title: string;
  severity: "high" | "medium" | "low";
  shift: Shift;
  time: string;
};

type RecentAnnouncement = {
  id: string;
  title: string;
  time: string;
  pinned: boolean;
};

export function useDashboardManagement(user: User) {
  const shifts = useMemo<Shift[]>(() => ["1勤", "2勤", "3勤"], []);

  const unreadIncidents = useMemo<UnreadIncident[]>(
    () => [
      {
        id: "1",
        title: "機械異常音発生",
        severity: "high",
        shift: "2勤",
        time: "14:30",
      },
      {
        id: "2",
        title: "品質チェック要注意",
        severity: "medium",
        shift: "1勤",
        time: "10:15",
      },
    ],
    [user.department]
  );

  const recentAnnouncements = useMemo<RecentAnnouncement[]>(
    () => [
      { id: "1", title: "来週の保守点検について", time: "昨日 16:00", pinned: true },
      { id: "2", title: "安全研修のお知らせ", time: "2日前", pinned: false },
    ],
    []
  );

  const sevDot = useCallback((s: string) => {
    if (s === "high") return "bg-red-500";
    if (s === "medium") return "bg-yellow-500";
    if (s === "low") return "bg-green-500";
    return "bg-gray-400";
  }, []);

  return {
    data: {
      shifts,
      unreadIncidents,
      recentAnnouncements,
    },
    utils: {
      sevDot,
    },
  };
}

