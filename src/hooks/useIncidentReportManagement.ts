import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useMemo, useState } from "react";
import type { Shift, User } from "../../types";
import {
  deleteIncidentReport,
  fetchIncidentReports,
  insertIncidentReport,
  type InsertIncidentReportInput,
  uploadIncidentPhotos,
} from "../api/incidentReports";
import { queryKeys } from "../lib/queryKeys";

type Severity = "low" | "medium" | "high";

type SubmitResult =
  | { ok: true; title: string; message: string }
  | { ok: false; title: string; message: string };

type SubmitIncidentReportPayload = InsertIncidentReportInput & {
  photoUris: string[];
};

async function submitIncidentReportWithPhotos(payload: SubmitIncidentReportPayload): Promise<void> {
  const { photoUris, ...insertInput } = payload;
  if (!insertInput.departmentId) {
    throw new Error("部署が未設定のため登録できません");
  }
  const photos = photoUris.map((uri) => ({
    uri,
    mimeType: undefined, 
  }));
  
  const attachmentUrls = await uploadIncidentPhotos({
    departmentId: insertInput.departmentId,
    userId: insertInput.reportedBy,
    photos,
  });
  await insertIncidentReport({ ...insertInput, attachmentUrls });
}

export function useIncidentReportManagement(user: User, selectedShift: Shift) {
  const queryClient = useQueryClient();
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [severity, setSeverity] = useState<Severity>("medium");
  const [shift, setShift] = useState<Shift>(selectedShift);
  const [showExistingReports, setShowExistingReports] = useState(false);
  const [photoUris, setPhotoUris] = useState<string[]>([]);

  useEffect(() => {
    setShift(selectedShift);
  }, [selectedShift]);

  const listQueryKey = useMemo(
    () => queryKeys.incidentReports.list(user.id, user.departmentId),
    [user.id, user.departmentId]
  );

  const reportsQuery = useQuery({
    queryKey: listQueryKey,
    enabled: Boolean(user.departmentId),
    queryFn: () => fetchIncidentReports(user.departmentId),
  });

  const submitMutation = useMutation({
    mutationFn: submitIncidentReportWithPhotos,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: listQueryKey });
      await queryClient.invalidateQueries({
        queryKey: queryKeys.dashboard.summary(user.id, user.departmentId),
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (reportId: string) =>
      deleteIncidentReport({
        reportId,
        userId: user.id,
        role: user.role,
      }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: listQueryKey });
      await queryClient.invalidateQueries({
        queryKey: queryKeys.dashboard.summary(user.id, user.departmentId),
      });
    },
  });

  const existingReports = reportsQuery.data ?? [];

  const canSubmit = title.trim().length > 0 && body.trim().length > 0;

  const handleSubmit = useCallback(async (): Promise<SubmitResult> => {
    if (!canSubmit) {
      return { ok: false, title: "入力エラー", message: "必須項目を入力してください" };
    }

    if (!user.departmentId) {
      return {
        ok: false,
        title: "登録できません",
        message: "プロフィールに部署が設定されていません",
      };
    }

    try {
      await submitMutation.mutateAsync({
        departmentId: user.departmentId,
        reportedBy: user.id,
        title: title.trim(),
        body: body.trim(),
        severity,
        shift,
        photoUris,
      });

      setTitle("");
      setBody("");
      setSeverity("medium");
      setShift(selectedShift);
      setPhotoUris([]);

      return { ok: true, title: "送信完了", message: "異常報告が送信されました" };
    } catch (e) {
      const message = e instanceof Error ? e.message : "送信に失敗しました";
      return { ok: false, title: "送信エラー", message };
    }
  }, [
    body,
    canSubmit,
    submitMutation,
    photoUris,
    selectedShift,
    severity,
    shift,
    title,
    user.departmentId,
    user.id,
  ]);

  const handlePickPhoto = useCallback(async (): Promise<SubmitResult> => {
    let ImagePickerModule: any;
    try {
      ImagePickerModule = await import("expo-image-picker");
    } catch {
      return {
        ok: false,
        title: "未対応環境",
        message:
          "このビルドには写真選択モジュールが含まれていません。開発ビルドを再作成してください。",
      };
    }

    const requestMediaLibraryPermissionsAsync =
      ImagePickerModule?.requestMediaLibraryPermissionsAsync ??
      ImagePickerModule?.default?.requestMediaLibraryPermissionsAsync;
    const launchImageLibraryAsync =
      ImagePickerModule?.launchImageLibraryAsync ??
      ImagePickerModule?.default?.launchImageLibraryAsync;

    if (
      typeof requestMediaLibraryPermissionsAsync !== "function" ||
      typeof launchImageLibraryAsync !== "function"
    ) {
      return {
        ok: false,
        title: "未対応環境",
        message:
          "このビルドでは写真選択APIを利用できません。開発ビルドを再作成してください。",
      };
    }

    try {
      const permission = await requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        return {
          ok: false,
          title: "権限エラー",
          message: "写真へのアクセス権限が必要です",
        };
      }

      const result = await launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsMultipleSelection: true,
        quality: 0.8,
        selectionLimit: 3,
      });

      if (result.canceled) {
        return { ok: true, title: "キャンセル", message: "写真の選択をキャンセルしました" };
      }

      const newUris = result.assets
        .map((asset: { uri?: string }) => asset.uri)
        .filter((uri: string | undefined): uri is string => Boolean(uri));

      setPhotoUris((prev) => [...prev, ...newUris].slice(0, 3));

      return { ok: true, title: "選択完了", message: "写真を添付しました" };
    } catch {
      return {
        ok: false,
        title: "未対応環境",
        message:
          "このビルドでは画像選択を利用できません。開発ビルドを再作成して再インストールしてください。",
      };
    }
  }, []);

  const removePhoto = useCallback((targetUri: string) => {
    setPhotoUris((prev) => prev.filter((uri) => uri !== targetUri));
  }, []);

  const canDeleteReport = useCallback(
    (report: { reportedBy: string }) => report.reportedBy === user.id || user.role === "admin",
    [user.id, user.role]
  );

  const handleDeleteReport = useCallback(
    async (reportId: string): Promise<SubmitResult> => {
      try {
        await deleteMutation.mutateAsync(reportId);
        return { ok: true, title: "削除完了", message: "異常報告を削除しました" };
      } catch (e) {
        const message = e instanceof Error ? e.message : "削除に失敗しました";
        return { ok: false, title: "削除エラー", message };
      }
    },
    [deleteMutation]
  );

  const getSeverityColor = useCallback((sev: string) => {
    const x = sev.toLowerCase();
    switch (x) {
      case "high":
        return "bg-red-500";
      case "medium":
        return "bg-yellow-500";
      case "low":
        return "bg-green-500";
      default:
        return "bg-gray-500";
    }
  }, []);

  const getSeverityText = useCallback((sev: string) => {
    const x = sev.toLowerCase();
    switch (x) {
      case "high":
        return "緊急";
      case "medium":
        return "重要";
      case "low":
        return "軽微";
      default:
        return sev || "—";
    }
  }, []);

  return {
    state: {
      title,
      body,
      severity,
      shift,
      isSubmitting: submitMutation.isPending,
      showExistingReports,
      photoUris,
    },
    data: {
      existingReports,
    },
    derived: {
      canSubmit,
    },
    utils: {
      getSeverityColor,
      getSeverityText,
      canDeleteReport,
    },
    actions: {
      setTitle,
      setBody,
      setSeverity,
      setShift,
      setShowExistingReports,
      handleSubmit,
      handlePickPhoto,
      removePhoto,
      handleDeleteReport,
    },
    query: {
      isPending: reportsQuery.isPending,
      isError: reportsQuery.isError,
      error: reportsQuery.error,
      refetch: reportsQuery.refetch,
    },
  };
}