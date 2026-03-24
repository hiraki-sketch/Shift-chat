import { useCallback, useMemo, useState } from "react";
import type { Incident, Shift, User } from "../../types";

type Severity = "low" | "medium" | "high";

type SubmitResult =
  | { ok: true; title: string; message: string }
  | { ok: false; title: string; message: string };

export function useIncidentReportManagement(user: User, selectedShift: Shift) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [severity, setSeverity] = useState<Severity>("medium");
  const [shift, setShift] = useState<Shift>(selectedShift);
  const [occurredAt, setOccurredAt] = useState("");
  const [photos, setPhotos] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showExistingReports, setShowExistingReports] = useState(false);

  const existingReports = useMemo<Incident[]>(
    () => [
      {
        id: "1",
        title: "機械異常音発生",
        description: "ライン2の機械から異常音が発生しています。すぐに点検が必要です。",
        severity: "high",
        status: "open",
        shift: "2勤",
        department: user.department,
        reportedBy: "作業者A",
        reportedAt: "2024-12-20 14:30",
        photos: [],
        comments: [],
      },
      {
        id: "2",
        title: "品質チェック要注意",
        description: "製品の寸法に若干のばらつきが見られます。",
        severity: "medium",
        status: "in_progress",
        shift: "1勤",
        department: user.department,
        reportedBy: "検査員B",
        reportedAt: "2024-12-20 10:15",
        photos: [],
        comments: [],
      },
    ],
    [user.department]
  );

  const handlePhotoUpload = useCallback(() => {
    console.log("写真アップロード機能");
  }, []);

  const removePhoto = useCallback((index: number) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const canSubmit = title.trim().length > 0 && description.trim().length > 0;

  const handleSubmit = useCallback(async (): Promise<SubmitResult> => {
    if (!canSubmit) {
      return { ok: false, title: "入力エラー", message: "必須項目を入力してください" };
    }

    setIsSubmitting(true);

    const newReport: Incident = {
      id: Date.now().toString(),
      title,
      description,
      severity,
      status: "open",
      shift,
      department: user.department,
      reportedBy: user.displayName,
      reportedAt: new Date().toISOString(),
      photos,
      comments: [],
    };

    console.log("新しい異常報告:", newReport);

    await new Promise((resolve) => setTimeout(resolve, 1000));

    setIsSubmitting(false);
    setTitle("");
    setDescription("");
    setSeverity("medium");
    setPhotos([]);
    setOccurredAt("");

    return { ok: true, title: "送信完了", message: "異常報告が送信されました" };
  }, [canSubmit, description, photos, severity, shift, title, user.department, user.displayName]);

  const getSeverityColor = useCallback((sev: string) => {
    switch (sev) {
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
    switch (sev) {
      case "high":
        return "緊急";
      case "medium":
        return "重要";
      case "low":
        return "軽微";
      default:
        return "不明";
    }
  }, []);

  const getStatusText = useCallback((status: string) => {
    switch (status) {
      case "open":
        return "未対応";
      case "in_progress":
        return "対応中";
      case "resolved":
        return "解決";
      case "closed":
        return "完了";
      default:
        return "不明";
    }
  }, []);

  const getStatusBadgeVariant = useCallback(
    (status: string): "destructive" | "default" | "secondary" | "outline" => {
      switch (status) {
        case "open":
          return "destructive";
        case "in_progress":
          return "default";
        case "resolved":
          return "secondary";
        case "closed":
          return "outline";
        default:
          return "outline";
      }
    },
    []
  );

  const generatePDF = useCallback((report: Incident) => {
    console.log("PDF生成:", report);
    return { title: "PDF生成", message: `"${report.title}" のPDFを生成しました` };
  }, []);

  return {
    state: {
      title,
      description,
      severity,
      shift,
      occurredAt,
      photos,
      isSubmitting,
      showExistingReports,
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
      getStatusText,
      getStatusBadgeVariant,
    },
    actions: {
      setTitle,
      setDescription,
      setSeverity,
      setShift,
      setOccurredAt,
      setShowExistingReports,
      handlePhotoUpload,
      removePhoto,
      handleSubmit,
      generatePDF,
    },
  };
}

