import { useCallback, useMemo, useState } from "react";
import type { Message, Shift, Thread, User } from "../../types";

type UseChatThreadsManagementParams = {
  user: User;
  selectedShift: Shift;
};

export function useChatThreadsManagement({
  user,
  selectedShift,
}: UseChatThreadsManagementParams) {
  const [selectedThread, setSelectedThread] = useState<Thread | null>(null);
  const [newMessage, setNewMessage] = useState("");

  const threads = useMemo<Thread[]>(
    () => [
      {
        id: "1",
        title: "1勤 日次引き継ぎ",
        department: user.department,
        shift: "1勤",
        createdBy: "班長おおやま ",
        createdAt: "2024-12-20 08:00",
        messageCount: 15,
      },
      {
        id: "2",
        title: "2勤 設備点検",
        department: user.department,
        shift: "2勤",
        createdBy: "保守 まさし",
        createdAt: "2024-12-20 16:00",
        messageCount: 8,
      },
      {
        id: "3",
        title: "3勤 清掃作業",
        department: user.department,
        shift: "3勤",
        createdBy: "清掃 まさし",
        createdAt: "2024-12-20 00:00",
        messageCount: 3,
      },
    ],
    [user.department]
  );

  const mockMessages = useMemo<Message[]>(
    () => [
      {
        id: "1",
        threadId: "1",
        author: "班長 まさし",
        body: "おはようございます。ちゃんとやりよんかいねえ!!!!!本日の作業予定を共有します。",
        createdAt: "2024-12-20 08:00",
      },
      {
        id: "2",
        threadId: "1",
        author: "作業者",
        body: "すすす、、、すいません!!!!!。ライン2の調子はどうでしょうか？",
        createdAt: "2024-12-20 08:05",
      },
    ],
    []
  );

  const threadMessages = useMemo(
    () =>
      selectedThread
        ? mockMessages.filter((m) => m.threadId === selectedThread.id)
        : [],
    [mockMessages, selectedThread]
  );

  const canSend = newMessage.trim().length > 0;
  const isSelectedShiftThreadOnly = useMemo(
    () => threads.some((t) => t.shift === selectedShift),
    [selectedShift, threads]
  );

  const handleSendMessage = useCallback(() => {
    if (!canSend || !selectedThread) return;
    console.log("新しいメッセージ:", {
      threadId: selectedThread.id,
      message: newMessage,
    });
    setNewMessage("");
  }, [canSend, newMessage, selectedThread]);

  return {
    state: {
      selectedThread,
      newMessage,
    },
    data: {
      threads,
      threadMessages,
    },
    derived: {
      canSend,
      isSelectedShiftThreadOnly,
    },
    actions: {
      setSelectedThread,
      setNewMessage,
      handleSendMessage,
    },
  };
}

