import { supabase } from "@/lib/supabase";

export type DepartmentAnnouncement = {
  id: string;
  title: string;
  body: string;
  authorId: string | null;
  authorName: string | null;
  createdAt: string;
  pinned: boolean;
};

export type InsertDepartmentAnnouncementInput = {
  userId: string;
  departmentId: string | null;
  title: string;
  body: string;
};

type AnnouncementRow = {
  id: string;
  title: string;
  body: string;
  created_by: string | null;
  created_at: string;
  is_pinned: boolean;
  profiles:
    | {
        display_name: string | null;
      }[]
    | null;
};

function mapRow(row: AnnouncementRow): DepartmentAnnouncement {
  const profile = row.profiles?.[0] ?? null;

  return {
    id: row.id,
    title: row.title,
    body: row.body,
    authorId: row.created_by,
    authorName: profile?.display_name ?? null,
    createdAt: new Date(row.created_at).toLocaleString("ja-JP"),
    pinned: row.is_pinned,
  };
}

export async function fetchDepartmentAnnouncements(
  departmentId: string | null
): Promise<DepartmentAnnouncement[]> {
  if (!departmentId) return [];

  const maxRows = 3;

  const { data, error } = await supabase
    .from("department_announcements")
    .select(`
      id,
      title,
      body,
      created_by,
      created_at,
      is_pinned,
      profiles:created_by (
        display_name
      )
    `)
    .eq("department_id", departmentId)
    .order("is_pinned", { ascending: false })
    .order("created_at", { ascending: false })
    .range(0, maxRows - 1);

  if (error) throw new Error(error.message);

  const rows = (data as AnnouncementRow[] | null) ?? [];
  return rows.map(mapRow);
}

export async function insertDepartmentAnnouncement(
  input: InsertDepartmentAnnouncementInput
): Promise<void> {
  if (!input.departmentId) {
    throw new Error("部署が未設定のため投稿できません");
  }

  const { error } = await supabase.from("department_announcements").insert({
    department_id: input.departmentId,
    created_by: input.userId,
    title: input.title,
    body: input.body,
    is_pinned: false,
  });

  if (error) throw new Error(error.message);
}