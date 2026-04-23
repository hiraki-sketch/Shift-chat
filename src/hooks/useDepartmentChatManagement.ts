import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useMemo, useState } from "react";
import {
  fetchDepartmentAnnouncements,
  insertDepartmentAnnouncement,
} from "../api/departmentAnnouncements";
import { queryKeys } from "../lib/queryKeys";
import type { User } from "../../types";

export function useDepartmentChatManagement(user: User) {
  const queryClient = useQueryClient();
  const listQueryKey = useMemo(
    () => queryKeys.departmentAnnouncements.list(user.id, user.departmentId),
    [user.id, user.departmentId]
  );

  const announcementsQuery = useQuery({
    queryKey: listQueryKey,
    enabled: Boolean(user.departmentId),
    queryFn: () => fetchDepartmentAnnouncements(user.departmentId),
  });

  const [newAnnouncement, setNewAnnouncement] = useState("");
  const [isComposing, setIsComposing] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const announcements = announcementsQuery.data ?? [];

  const canSend = newAnnouncement.trim().length > 0 && Boolean(user.departmentId) && !isSending;

  const handleToggleCompose = useCallback(() => {
    setIsComposing((prev) => !prev);
  }, []);

  const handleCancelCompose = useCallback(() => {
    setIsComposing(false);
    setNewAnnouncement("");
  }, []);

  const handleSendAnnouncement = useCallback(async (): Promise<
    { ok: true } | { ok: false; message: string }
  > => {
    if (!canSend || !user.departmentId) {
      return { ok: false, message: "部署が未設定か、入力がありません" };
    }

    const body = newAnnouncement.trim();
    const title = body.length > 20 ? `${body.slice(0, 20)}...` : body;

    setIsSending(true);
    try {
      await insertDepartmentAnnouncement({
        userId: user.id,
        departmentId: user.departmentId,
        title,
        body,
      });
    } catch (e) {
      setIsSending(false);
      const message = e instanceof Error ? e.message : "投稿に失敗しました";
      return { ok: false, message };
    }

    setIsSending(false);
    setNewAnnouncement("");
    setIsComposing(false);
    await queryClient.invalidateQueries({ queryKey: listQueryKey });
    return { ok: true };
  }, [
    canSend,
    listQueryKey,
    newAnnouncement,
    queryClient,
    user.departmentId,
    user.id,
  ]);

  return {
    state: {
      newAnnouncement,
      isComposing,
      isSending,
    },
    data: {
      announcements,
    },
    derived: {
      canSend,
    },
    utils: {},
    actions: {
      setNewAnnouncement,
      handleToggleCompose,
      handleCancelCompose,
      handleSendAnnouncement,
    },
    query: {
      isPending: announcementsQuery.isPending,
      isError: announcementsQuery.isError,
      error: announcementsQuery.error,
      refetch: announcementsQuery.refetch,
    },
  };
}
