import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useMemo, useState } from "react";
import type { Message, Shift, Thread, User } from "../../types";
import { getChatMessages, getChatThreads, sendChatMessage } from "../api/chatThreads";
import { toJapaneseErrorMessage } from "../lib/errorMessages";
import { queryKeys } from "../lib/queryKeys";

type UseChatThreadsManagementParams = {
  user: User;
  selectedShift: Shift;
};

export function useChatThreadsManagement({
  user,
  selectedShift,
}: UseChatThreadsManagementParams) {
  const queryClient = useQueryClient();
  const [selectedThread, setSelectedThread] = useState<Thread | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const threadsQuery = useQuery<Thread[]>({
    queryKey: queryKeys.chatThreads.list(),
    queryFn: async () => {
      const data = await getChatThreads();
      // MVPでは全体チャットのみ表示
      return data.filter((thread) => thread.shift === "all");
    },
  });

  const messagesQuery = useQuery<Message[]>({
    queryKey: queryKeys.chatThreads.messages(selectedThread?.id ?? ""),
    enabled: Boolean(selectedThread?.id),
    queryFn: () => getChatMessages(selectedThread!.id),
  });

  const sendMessageMutation = useMutation({
    mutationFn: sendChatMessage,
    onSuccess: async (_data, variables) => {
      await queryClient.invalidateQueries({
        queryKey: queryKeys.chatThreads.messages(variables.threadId),
      });
      await queryClient.invalidateQueries({ queryKey: queryKeys.chatThreads.list() });
    },
  });

  const threads = useMemo(() => threadsQuery.data ?? [], [threadsQuery.data]);
  const threadMessages = useMemo(
    () => messagesQuery.data ?? [],
    [messagesQuery.data]
  );
  const isLoadingThreads = threadsQuery.isPending;
  const isLoadingMessages = messagesQuery.isPending || messagesQuery.isFetching;
  const isSendingMessage = sendMessageMutation.isPending;
  const errorMessage =
    (threadsQuery.error &&
      toJapaneseErrorMessage(threadsQuery.error, "チャットスレッドの取得に失敗しました。")) ||
    (messagesQuery.error &&
      toJapaneseErrorMessage(messagesQuery.error, "チャットメッセージの取得に失敗しました。")) ||
    (sendMessageMutation.error &&
      toJapaneseErrorMessage(sendMessageMutation.error, "チャットメッセージの送信に失敗しました。")) ||
    null;

  const canSend = newMessage.trim().length > 0 && !sendMessageMutation.isPending;

  const isSelectedShiftThreadOnly = useMemo(
    () => threads.some((t) => t.shift === selectedShift),
    [selectedShift, threads]
  );

  const handleSendMessage = useCallback(async () => {
    if (!canSend || !selectedThread) return;

    const content = newMessage.trim();
    if (!content) return;

    try {
      await sendMessageMutation.mutateAsync({
        threadId: selectedThread.id,
        userId: user.id,
        content,
      });
      setNewMessage("");
    } catch (error) {
      console.error("チャットメッセージ送信エラー:", error);
    }
  }, [canSend, newMessage, selectedThread, sendMessageMutation, user.id]);

  return {
    state: {
      selectedThread,
      newMessage,
      isLoadingThreads,
      isLoadingMessages,
      isSendingMessage,
      errorMessage,
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