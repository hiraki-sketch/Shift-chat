import { supabase } from "@/lib/supabase";

function normalizeDepartmentAnnouncementError(
  error: unknown,
  fallback: string
): string {
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

type DeleteDepartmentAnnouncementInput = {
  announcementId: string;
  userId: string;
  role?: "admin" | "manager" | "member";
};
type AnnouncementRow = {
  id: string;
  title: string;
  body: string;
  created_by: string | null;
  created_at: string;
  is_pinned: boolean;
};

function mapRow(
  row: AnnouncementRow,
  authorNameById: Record<string, string | null>
): DepartmentAnnouncement {
  return {
    id: row.id,
    title: row.title,
    body: row.body,
    authorId: row.created_by,
    authorName: row.created_by ? (authorNameById[row.created_by] ?? "不明") : "不明",
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
      is_pinned
    `)
    .is("deleted_at", null)
    .eq("department_id", departmentId)
    .order("is_pinned", { ascending: false })
    .order("created_at", { ascending: false })
    .limit(maxRows);
  if (error) {
    throw new Error(
      normalizeDepartmentAnnouncementError(error, "部署連絡の取得に失敗しました")
    );
  }

  const rows = (data as AnnouncementRow[] | null) ?? [];
  const authorIds = Array.from(
    new Set(
      rows
        .map((row) => row.created_by)
        .filter((id): id is string => Boolean(id))
    )
  );

  const authorNameById: Record<string, string | null> = {};
  if (authorIds.length > 0) {
    const { data: profilesData, error: profilesError } = await supabase
      .from("profiles")
      .select("id, display_name")
      .in("id", authorIds);

    if (profilesError) {
      throw new Error(
        normalizeDepartmentAnnouncementError(
          profilesError,
          "投稿者プロフィールの取得に失敗しました"
        )
      );
    }

    for (const profile of profilesData ?? []) {
      authorNameById[profile.id] = profile.display_name ?? null;
    }
  }

  return rows.map((row) => mapRow(row, authorNameById));
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

  if (error) {
    throw new Error(
      normalizeDepartmentAnnouncementError(error, "部署連絡の投稿に失敗しました")
    );
  }
}

export async function deleteDepartmentAnnouncement(
  input: DeleteDepartmentAnnouncementInput
): Promise<void> {
  const { data: target, error: fetchError } = await supabase
    .from("department_announcements")
    .select("id, created_by")
    .eq("id", input.announcementId)
    .is("deleted_at", null)
    .single();

  if (fetchError) {
    throw new Error(
      normalizeDepartmentAnnouncementError(
        fetchError,
        "削除対象の部署連絡取得に失敗しました"
      )
    );
  }

  const canDelete = target.created_by === input.userId || input.role === "admin";
  if (!canDelete) {
    throw new Error("削除権限がありません");
  }

  const { error: deleteError } = await supabase
    .from("department_announcements")
    .update({
      deleted_at: new Date().toISOString(),
    })
    .eq("id", input.announcementId);

  if (deleteError) {
    throw new Error(
      normalizeDepartmentAnnouncementError(
        deleteError,
        "部署連絡の削除に失敗しました"
      )
    );
  }
}
/** PostgREST `or` 用に、ワイルドカードや区切り文字を弱体化した検索トークン */
function sanitizeAnnouncementSearchToken(keyword: string): string {
  return keyword
    .trim()
    .replace(/[%_,]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * 部署内の部署連絡を、タイトルまたは本文の部分一致（大文字小文字区別なし）で検索する。
 * 論理削除済みは除外。著者名は別クエリで解決する。
 */
export async function searchDepartmentAnnouncements(
  departmentId: string | null,
  keyword: string
): Promise<DepartmentAnnouncement[]> {
  if (!departmentId) return [];

  const token = sanitizeAnnouncementSearchToken(keyword);
  if (!token) return [];

  const pattern = `%${token}%`;

  const { data, error } = await supabase
    .from("department_announcements")
    .select("id, title, body, created_by, created_at, is_pinned")
    .is("deleted_at", null)
    .eq("department_id", departmentId)
    .or(`title.ilike.${pattern},body.ilike.${pattern}`)
    .order("is_pinned", { ascending: false })
    .order("created_at", { ascending: false })
    .limit(10);

  if (error) {
    throw new Error(
      normalizeDepartmentAnnouncementError(error, "部署連絡の検索に失敗しました")
    );
  }

  const rows = (data as AnnouncementRow[] | null) ?? [];
  const authorIds = Array.from(
    new Set(rows.map((row) => row.created_by).filter((id): id is string => Boolean(id)))
  );

  const authorNameById: Record<string, string | null> = {};
  if (authorIds.length > 0) {
    const { data: profilesData, error: profilesError } = await supabase
      .from("profiles")
      .select("id, display_name")
      .in("id", authorIds);

    if (profilesError) {
      throw new Error(
        normalizeDepartmentAnnouncementError(
          profilesError,
          "投稿者プロフィールの取得に失敗しました"
        )
      );
    }

    for (const profile of profilesData ?? []) {
      authorNameById[profile.id] = profile.display_name ?? null;
    }
  }

  return rows.map((row) => mapRow(row, authorNameById));
}