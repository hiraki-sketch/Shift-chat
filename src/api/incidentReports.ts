import { supabase } from "@/lib/supabase";
import { decode } from "base64-arraybuffer";
import { File } from "expo-file-system";
import type { Incident, Shift } from "../../types";

export type InsertIncidentReportInput = {
  departmentId: string | null;
  reportedBy: string;
  title: string;
  body: string;
  severity: string;
  shift: Shift;
  attachmentUrls?: string[];
};

type IncidentReportRow = {
  id: string;
  title: string;
  body: string;
  severity: string;
  shift: number;
  department_id: string;
  reported_by: string;
  profiles:
    | {
        display_name: string | null;
      }[]
    | null;
  created_at: string;
  updated_at: string;
  attachment_urls: string[] | null;
};

type UploadPhotoInput = {
  uri: string;
  mimeType?: string | null;
};

const INCIDENT_PHOTO_BUCKET = "incident-report-photos";

function parseShift(v: number): Shift {
  if (v === 1) return "1勤";
  if (v === 2) return "2勤";
  if (v === 3) return "3勤";
  return "1勤";
}

function toShiftNumber(v: Shift): number {
  if (v === "1勤") return 1;
  if (v === "2勤") return 2;
  if (v === "3勤") return 3;
  return 1;
}

function mapRow(row: IncidentReportRow): Incident {
  const profile = row.profiles?.[0] ?? null;

  return {
    id: row.id,
    title: row.title,
    body: row.body,
    attachmentUrls: row.attachment_urls ?? [],
    severity: row.severity,
    shift: parseShift(row.shift),
    departmentId: row.department_id,
    reportedBy: row.reported_by,
    reporterName: profile?.display_name ?? null,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function getContentTypeFromUri(uri: string): string {
  const lowerUri = uri.toLowerCase();

  if (lowerUri.endsWith(".png")) return "image/png";
  if (lowerUri.endsWith(".webp")) return "image/webp";
  if (lowerUri.endsWith(".heic")) return "image/heic";
  if (lowerUri.endsWith(".heif")) return "image/heif";

  return "image/jpeg";
}

function getFileExtensionFromContentType(contentType: string): string {
  if (contentType === "image/png") return "png";
  if (contentType === "image/webp") return "webp";
  if (contentType === "image/heic") return "heic";
  if (contentType === "image/heif") return "heif";
  if (contentType === "image/jpeg") return "jpg";

  return "jpg";
}

function resolveContentType(photo: UploadPhotoInput): string {
  return photo.mimeType ?? getContentTypeFromUri(photo.uri);
}

export async function fetchIncidentReports(departmentId: string | null): Promise<Incident[]> {
  if (!departmentId) return [];

  const maxRows = 3;
  const { data, error } = await supabase
    .from("incident_reports")
    .select(`
      id,
      title,
      body,
      severity,
      shift,
      department_id,
      reported_by,
      created_at,
      updated_at,
      attachment_urls,
      profiles:reported_by (
        display_name
      )
    `)
    .eq("department_id", departmentId)
    .order("created_at", { ascending: false })
    .range(0, maxRows - 1);

  if (error) throw new Error(error.message);

  const rows = (data as IncidentReportRow[] | null) ?? [];
  return rows.slice(0, maxRows).map(mapRow);
}

export async function insertIncidentReport(input: InsertIncidentReportInput): Promise<void> {
  if (!input.departmentId) {
    throw new Error("部署が未設定のため登録できません");
  }

  const normalizedAttachmentUrls = Array.from(
    new Set((input.attachmentUrls ?? []).filter((url) => typeof url === "string" && url.length > 0))
  ).slice(0, 3);

  const { error } = await supabase.from("incident_reports").insert({
    title: input.title.trim(),
    body: input.body.trim(),
    severity: input.severity,
    shift: toShiftNumber(input.shift),
    department_id: input.departmentId,
    reported_by: input.reportedBy,
    attachment_urls: normalizedAttachmentUrls,
  });

  if (error) throw new Error(error.message);
}

export async function deleteIncidentReport(params: {
  reportId: string;
  userId: string;
  role?: "admin" | "manager" | "member";
}): Promise<void> {
  const { reportId, userId, role } = params;
  const isAdmin = role === "admin";

  let query = supabase.from("incident_reports").delete().eq("id", reportId);

  if (!isAdmin) {
    query = query.eq("reported_by", userId);
  }

  const { error } = await query;
  if (error) throw new Error(error.message);
}

export async function uploadIncidentPhotos(params: {
  departmentId: string;
  userId: string;
  photos: UploadPhotoInput[];
}): Promise<string[]> {
  const { departmentId, userId, photos } = params;
  if (!photos.length) return [];

  const uploadedUrls: string[] = [];

  for (let i = 0; i < photos.length; i += 1) {
    const photo = photos[i];
    const { uri } = photo;

    const contentType = resolveContentType(photo);
    const extension = getFileExtensionFromContentType(contentType);
    const path = `${departmentId}/${userId}/${Date.now()}-${i}.${extension}`;

    const normalizedUri = uri.startsWith("file://") ? uri : `file://${uri}`;

    const file = new File(normalizedUri);
    const base64 = await file.base64();
    const arrayBuffer = decode(base64);

    const { error: uploadError } = await supabase.storage
      .from(INCIDENT_PHOTO_BUCKET)
      .upload(path, arrayBuffer, {
        contentType,
        upsert: false,
      });

    if (uploadError) {
      throw new Error(`画像アップロードに失敗しました: ${uploadError.message}`);
    }

    const { data } = supabase.storage
      .from(INCIDENT_PHOTO_BUCKET)
      .getPublicUrl(path);

    uploadedUrls.push(data.publicUrl);
  }

  return uploadedUrls;
}























































































