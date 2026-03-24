import { useCallback, useMemo, useState } from "react";
import type { Shift, User } from "../../types";

type Priority = "high" | "medium" | "low";

type Announcement = {
  id: string;
  title: string;
  content: string;
  author: string;
  createdAt: string;
  pinned: boolean;
  priority: Priority;
  shift?: Shift;
};

export function useDepartmentChatManagement(user: User) {
  const [newAnnouncement, setNewAnnouncement] = useState("");
  const [isComposing, setIsComposing] = useState(false);

  const announcements = useMemo<Announcement[]>(
    () => [
      {
        id: "1",
        title: "来週の保守点検について",
        content:
          "来週月曜日から水曜日まで、機械の定期保守点検を実施します。作業時間は通常通りですが、一部のラインが停止する可能性があります。",
        author: "保守担当 佐藤",
        createdAt: "2024-12-20 16:00",
        pinned: true,
        priority: "high",
        shift: "1勤",
      },
      {
        id: "2",
        title: "安全研修のお知らせ",
        content:
          "来月の安全研修の日程が決定しました。全員参加必須です。詳細は後日連絡します。",
        author: "安全担当 田中",
        createdAt: "2024-12-19 14:30",
        pinned: false,
        priority: "medium",
      },
      {
        id: "3",
        title: "年末年始の勤務について",
        content:
          "年末年始の勤務スケジュールを確認してください。特別勤務手当が支給されます。",
        author: "人事部 山田",
        createdAt: "2024-12-18 10:00",
        pinned: true,
        priority: "high",
      },
      {
        id: "4",
        title: "品質管理の改善提案",
        content:
          "品質チェックの効率化について、皆様からのご意見をお待ちしています。",
        author: "品質管理 鈴木",
        createdAt: "2024-12-17 15:45",
        pinned: false,
        priority: "low",
      },
    ],
    [user.department]
  );

  const canSend = newAnnouncement.trim().length > 0;

  const getPriorityColor = useCallback((priority: string) => {
    switch (priority) {
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

  const getPriorityText = useCallback((priority: string) => {
    switch (priority) {
      case "high":
        return "重要";
      case "medium":
        return "普通";
      case "low":
        return "軽微";
      default:
        return "不明";
    }
  }, []);

  const handleToggleCompose = useCallback(() => {
    setIsComposing((prev) => !prev);
  }, []);

  const handleCancelCompose = useCallback(() => {
    setIsComposing(false);
  }, []);

  const handleSendAnnouncement = useCallback(() => {
    if (!canSend) return;
    console.log("新しい部署連絡:", newAnnouncement);
    setNewAnnouncement("");
    setIsComposing(false);
  }, [canSend, newAnnouncement]);

  return {
    state: {
      newAnnouncement,
      isComposing,
    },
    data: {
      announcements,
    },
    derived: {
      canSend,
    },
    utils: {
      getPriorityColor,
      getPriorityText,
    },
    actions: {
      setNewAnnouncement,
      handleToggleCompose,
      handleCancelCompose,
      handleSendAnnouncement,
    },
  };
}

