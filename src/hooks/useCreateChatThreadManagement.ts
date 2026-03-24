import { useCallback, useMemo, useState } from "react";
import type { Shift, Thread, User } from "../../types";

type ShiftOrAll = Shift | "all";
type ActionResult = { ok: boolean; title: string; message: string };

export function useCreateChatThreadManagement(user: User) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedShift, setSelectedShift] = useState<ShiftOrAll>("all");
  const [isPublic, setIsPublic] = useState(true);
  const [allowFileSharing, setAllowFileSharing] = useState(true);
  const [notifyMembers, setNotifyMembers] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const shifts = useMemo<ShiftOrAll[]>(() => ["all", "1勤", "2勤", "3勤"], []);

  const templates = useMemo(
    () => [
      {
        title: "日次引き継ぎ - {shift}",
        description: "勤務帯の引き継ぎ事項や注意事項を共有するためのチャットです。",
        shift: "1勤" as ShiftOrAll,
      },
      {
        title: "設備点検連絡",
        description: "設備の点検状況や異常の報告・対応を行うためのチャットです。",
        shift: "all" as ShiftOrAll,
      },
      {
        title: "品質管理情報",
        description: "品質チェックの結果や改善提案を共有するためのチャットです。",
        shift: "all" as ShiftOrAll,
      },
      {
        title: "安全管理連絡",
        description: "安全に関する情報共有や事故報告を行うためのチャットです。",
        shift: "all" as ShiftOrAll,
      },
    ],
    []
  );

  const canSubmit = title.trim().length > 0;

  const getShiftText = useCallback((shift: ShiftOrAll) => {
    switch (shift) {
      case "all":
        return "全勤務帯";
      case "1勤":
      case "2勤":
      case "3勤":
        return shift;
      default:
        return "不明";
    }
  }, []);

  const getShiftColor = useCallback((shift: ShiftOrAll) => {
    switch (shift) {
      case "all":
        return "bg-gray-100";
      case "1勤":
        return "bg-blue-100";
      case "2勤":
        return "bg-green-100";
      case "3勤":
        return "bg-purple-100";
      default:
        return "bg-gray-100";
    }
  }, []);

  const applyTemplate = useCallback(
    (template: (typeof templates)[number]) => {
      const shiftText =
        template.shift === "all" ? "全勤務帯" : template.shift;
      setTitle(template.title.replace("{shift}", shiftText));
      setDescription(template.description);
      setSelectedShift(template.shift);
    },
    [templates]
  );

  const handleCancel = useCallback((): ActionResult => {
    if (title.trim() || description.trim()) {
      return {
        ok: false,
        title: "確認",
        message: "入力内容が破棄されますが、よろしいですか？",
      };
    }
    return { ok: true, title: "", message: "" };
  }, [description, title]);

  const handleSubmit = useCallback(async (): Promise<ActionResult> => {
    if (!title.trim()) {
      return {
        ok: false,
        title: "入力エラー",
        message: "チャットタイトルを入力してください",
      };
    }

    setIsSubmitting(true);
    const newThread: Thread = {
      id: Date.now().toString(),
      title: title.trim(),
      department: user.department,
      shift: selectedShift === "all" ? undefined : selectedShift,
      createdBy: user.displayName,
      createdAt: new Date().toISOString(),
      messageCount: 0,
    };

    console.log("新しいチャットスレッド:", {
      ...newThread,
      description,
      isPublic,
      allowFileSharing,
      notifyMembers,
    });

    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSubmitting(false);

    return {
      ok: true,
      title: "作成完了",
      message: "チャットスレッドを作成しました",
    };
  }, [
    allowFileSharing,
    description,
    isPublic,
    notifyMembers,
    selectedShift,
    title,
    user.department,
    user.displayName,
  ]);

  return {
    state: {
      title,
      description,
      selectedShift,
      isPublic,
      allowFileSharing,
      notifyMembers,
      isSubmitting,
    },
    data: {
      shifts,
      templates,
    },
    derived: {
      canSubmit,
    },
    utils: {
      getShiftText,
      getShiftColor,
    },
    actions: {
      setTitle,
      setDescription,
      setSelectedShift,
      setIsPublic,
      setAllowFileSharing,
      setNotifyMembers,
      applyTemplate,
      handleCancel,
      handleSubmit,
    },
  };
}

