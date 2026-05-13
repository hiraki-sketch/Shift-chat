import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useMemo, useState } from "react";
import type { User } from "../../types";
import {
  deleteDepartmentAnnouncement,
  fetchDepartmentAnnouncements,
  insertDepartmentAnnouncement,
} from "../api/departmentAnnouncements";
import {
  BODY_MAX_LENGTH,
  DEPARTMENT_ANNOUNCEMENT_TITLE_MAX_LENGTH,
  getLiveValidationMessage,
  getSubmitValidationMessage,
} from "../lib/inputValidation";
import { queryKeys } from "../lib/queryKeys";

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

  const [announcementTitle, setAnnouncementTitle] = useState("");
  const [newAnnouncement, setNewAnnouncement] = useState("");
  const [isComposing, setIsComposing] = useState(false);

  const announcements = announcementsQuery.data ?? [];

  const createAnnouncementMutation = useMutation({
    mutationFn: insertDepartmentAnnouncement,
    onSuccess: async () => {
      setAnnouncementTitle("");
      setNewAnnouncement("");
      setIsComposing(false);
      await queryClient.invalidateQueries({ queryKey: listQueryKey });
      await queryClient.invalidateQueries({
        queryKey: queryKeys.departmentAnnouncements.all,
      });
    },
  });

  const deleteAnnouncementMutation = useMutation({
    mutationFn: async (announcementId: string) =>
      deleteDepartmentAnnouncement({
        announcementId,
        userId: user.id,
        role: user.role,
      }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: listQueryKey });
      await queryClient.invalidateQueries({
        queryKey: queryKeys.departmentAnnouncements.all,
      });
      await queryClient.invalidateQueries({
        queryKey: queryKeys.dashboard.summary(user.id, user.departmentId),
      });
    },
  });

  const isSending = createAnnouncementMutation.isPending;
  const titleError = getLiveValidationMessage(
    announcementTitle,
    "部署連絡タイトル",
    DEPARTMENT_ANNOUNCEMENT_TITLE_MAX_LENGTH
  );
  const bodyError = getLiveValidationMessage(newAnnouncement, "本文", BODY_MAX_LENGTH);
  const titleSubmitError = getSubmitValidationMessage(
    announcementTitle,
    "部署連絡タイトル",
    DEPARTMENT_ANNOUNCEMENT_TITLE_MAX_LENGTH
  );
  const bodySubmitError = getSubmitValidationMessage(
    newAnnouncement,
    "本文",
    BODY_MAX_LENGTH
  );
  const canSend = !titleSubmitError && !bodySubmitError && Boolean(user.departmentId) && !isSending;

  const handleToggleCompose = useCallback(() => {
    setIsComposing((prev) => !prev);
  }, []);

  const handleCancelCompose = useCallback(() => {
    setIsComposing(false);
    setAnnouncementTitle("");
    setNewAnnouncement("");
  }, []);

  const handleSendAnnouncement = useCallback(async (): Promise<
    { ok: true } | { ok: false; message: string }
  > => {
    if (!user.departmentId) {
      return { ok: false, message: "部署が未設定のため投稿できません" };
    }
    const validationMessage = titleSubmitError ?? bodySubmitError;
    if (validationMessage) {
      return { ok: false, message: validationMessage };
    }

    const body = newAnnouncement.trim();
    const title = announcementTitle.trim();

    try {
      await createAnnouncementMutation.mutateAsync({
        userId: user.id,
        departmentId: user.departmentId,
        title,
        body,
      });

    return { ok: true };
    } catch (e) {
      const message = e instanceof Error ? e.message : "投稿に失敗しました";
      return { ok: false, message };
  }}, [
    announcementTitle,
    createAnnouncementMutation,
    newAnnouncement,
    bodySubmitError,
    titleSubmitError,
    user.departmentId,
    user.id,
  ]);

  const canDeleteAnnouncement = useCallback(
    (announcement: { authorId: string | null }) =>
      announcement.authorId === user.id || user.role === "admin",
    [user.id, user.role]
  );

  const handleDeleteAnnouncement = useCallback(
    async (
      announcementId: string
    ): Promise<{ ok: true } | { ok: false; message: string }> => {
      try {
        await deleteAnnouncementMutation.mutateAsync(announcementId);
        return { ok: true };
      } catch (e) {
        const message = e instanceof Error ? e.message : "削除に失敗しました";
        return { ok: false, message };
      }
    },
    [deleteAnnouncementMutation]
  );
  return {
    state: {
      announcementTitle,
      newAnnouncement,
      isComposing,
      isSending,
      isDeleting: deleteAnnouncementMutation.isPending,
    },
    data: {
      announcements,
    },
    derived: {
      canSend,
      titleError,
      bodyError,
      titleLength: announcementTitle.length,
      bodyLength: newAnnouncement.length,
      titleMaxLength: DEPARTMENT_ANNOUNCEMENT_TITLE_MAX_LENGTH,
      bodyMaxLength: BODY_MAX_LENGTH,
    },
    actions: {
      setAnnouncementTitle,
      setNewAnnouncement,
      handleToggleCompose,
      handleCancelCompose,
      handleSendAnnouncement,
      handleDeleteAnnouncement,
    },
    utils: {
      canDeleteAnnouncement,
    },
    query: {
      isPending: announcementsQuery.isPending,
      isError: announcementsQuery.isError,
      error: announcementsQuery.error,
      refetch: announcementsQuery.refetch,
    },
  };
}
