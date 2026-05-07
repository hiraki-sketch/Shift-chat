import { supabase } from "@/lib/supabase";
import type { Shift } from "../../types";

function normalizeDashboardError(error: unknown, fallback: string): string {
  if (
    error &&
    typeof error === "object" &&
    "message" in error &&
    typeof (error as { message?: unknown }).message === "string" &&
    (error as { message: string }).message.trim().length > 0
  ) {
    const raw = (error as { message: string }).message.toLowerCase();
    if (raw.includes("row-level security")) return "アクセス権限がありません";
    if (raw.includes("permission denied")) return "アクセス権限がありません";
    if (raw.includes("network")) return "ネットワークエラーが発生しました";
    if (raw.includes("timeout")) return "通信がタイムアウトしました";
  }
  return fallback;
}

export type DashboardUnreadIncident = {
  id: string;
  title: string;
  time: string;
  severity: string;
  shift: Shift;
};

export type DashboardRecentAnnouncement = {
  id: string;
  title: string;
  time: string;
  pinned: boolean;
};

export type DashboardSummary = {
  unreadIncidents: DashboardUnreadIncident[];
  recentAnnouncements: DashboardRecentAnnouncement[];
};

function formatIncidentTime(iso: string): string {
  return new Date(iso).toLocaleString("ja-JP", {
    month: "numeric",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatAnnouncementTime(iso: string): string {
  return new Date(iso).toLocaleString("ja-JP", {
    month: "numeric",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function parseShift(v: string): Shift {
  return v === "1" || v === "2" || v === "3" ? v : "1";
}

const INCIDENT_LIMIT = 3;
const ANNOUNCEMENT_LIMIT = 3;

export async function fetchDashboardSummary(params: {
  departmentId: string | null;
}): Promise<DashboardSummary> {
  if (!params.departmentId) {
    return { unreadIncidents: [], recentAnnouncements: [] };
  }

  const deptId = params.departmentId;

  const [incidentsRes, announcementsRes] = await Promise.all([
    supabase
      .from("incident_reports")
      .select("id, title, severity, shift, created_at")
      .eq("department_id", deptId)
      .is("deleted_at", null)
      .order("created_at", { ascending: false })
      .limit(INCIDENT_LIMIT),
    supabase
      .from("department_announcements")
      .select("id, title, is_pinned, created_at")
      .eq("department_id", deptId)
      .is("deleted_at", null)
      .order("is_pinned", { ascending: false })
      .order("created_at", { ascending: false })
      .limit(ANNOUNCEMENT_LIMIT),
  ]);

  if (incidentsRes.error) {
    throw new Error(
      normalizeDashboardError(incidentsRes.error, "異常報告の取得に失敗しました")
    );
  }
  if (announcementsRes.error) {
    throw new Error(
      normalizeDashboardError(announcementsRes.error, "部署連絡の取得に失敗しました")
    );
  }

  const incidentRows = incidentsRes.data ?? [];
  const unreadIncidents: DashboardUnreadIncident[] = incidentRows.map((row) => ({
    id: row.id,
    title: row.title,
    severity: row.severity,
    shift: parseShift(row.shift),
    time: formatIncidentTime(row.created_at),
  }));

  const annRows = announcementsRes.data ?? [];
  const recentAnnouncements: DashboardRecentAnnouncement[] = annRows.map((row) => ({
    id: row.id,
    title: row.title,
    pinned: row.is_pinned,
    time: formatAnnouncementTime(row.created_at),
  }));

  return { unreadIncidents, recentAnnouncements };
}
