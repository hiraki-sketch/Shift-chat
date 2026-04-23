import { useCallback, useMemo, useState } from "react";
import type { Shift, User, VacationRequest } from "../../types";

export type VacationType =
  | "paid_leave"
  | "sick_leave"
  | "personal_leave"
  | "compensatory_leave";

type SubmitResult =
  | { ok: true; title: string; message: string }
  | { ok: false; title: string; message: string };

export function useVacationManagement(user: User, selectedShift: Shift) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [vacationType, setVacationType] = useState<VacationType>("paid_leave");
  const [reason, setReason] = useState("");

  // モック有給データ（将来的には API/DB から取得）
  const vacationBalance = useMemo(
    () => ({
      totalDays: 20,
      usedDays: 8,
      remainingDays: 12,
      expiringSoon: 5, // 来年3月末で失効予定
    }),
    []
  );

  // モック申請データ（ユーザーIDだけ依存）
  const vacationRequests = useMemo<VacationRequest[]>(
    () => [
      {
        id: "1",
        userId: user.id,
        shift: "1勤",
        startDate: "2024-12-25",
        endDate: "2024-12-27",
        type: "paid_leave",
        reason: "年末年始休暇",
        status: "approved",
        requestedAt: "2024-12-10 09:00",
        approvedBy: "部長 山田",
        approvedAt: "2024-12-10 14:30",
      },
      {
        id: "2",
        userId: user.id,
        shift: "2勤",
        startDate: "2024-12-30",
        endDate: "2024-12-30",
        type: "personal_leave",
        reason: "家族の用事",
        status: "pending",
        requestedAt: "2024-12-15 11:20",
      },
      {
        id: "3",
        userId: user.id,
        shift: "1勤",
        startDate: "2024-11-20",
        endDate: "2024-11-21",
        type: "paid_leave",
        reason: "リフレッシュ休暇",
        status: "approved",
        requestedAt: "2024-11-05 10:15",
        approvedBy: "部長 山田",
        approvedAt: "2024-11-05 16:45",
      },
      {
        id: "4",
        userId: user.id,
        shift: "3勤",
        startDate: "2024-11-01",
        endDate: "2024-11-01",
        type: "sick_leave",
        reason: "体調不良",
        status: "rejected",
        requestedAt: "2024-10-30 08:30",
        rejectionReason: "事前申請が必要です",
      },
    ],
    [user.id]
  );

  const filteredVacationRequests = useMemo(
    () => vacationRequests.filter((request) => request.shift === selectedShift),
    [selectedShift, vacationRequests]
  );

  const getStatusColor = useCallback((status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-500";
      case "pending":
        return "bg-yellow-500";
      case "rejected":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  }, []);

  const getStatusText = useCallback((status: string) => {
    switch (status) {
      case "approved":
        return "承認済み";
      case "pending":
        return "承認待ち";
      case "rejected":
        return "却下";
      default:
        return "不明";
    }
  }, []);

  const getStatusIcon = useCallback((status: string) => {
    switch (status) {
      case "approved":
        return "✅";
      case "pending":
        return "⏰";
      case "rejected":
        return "❌";
      default:
        return "❓";
    }
  }, []);

  const getTypeText = useCallback((type: string) => {
    switch (type) {
      case "paid_leave":
        return "有給休暇";
      case "sick_leave":
        return "病気休暇";
      case "personal_leave":
        return "私用休暇";
      case "compensatory_leave":
        return "代休";
      default:
        return "不明";
    }
  }, []);

  const calculateDays = useCallback((start: string, end: string) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  }, []);

  const handleSubmitRequest = useCallback((): SubmitResult => {
    if (!startDate || !endDate || !reason.trim()) {
      return {
        ok: false,
        title: "エラー",
        message: "すべての項目を入力してください",
      };
    }

    const newRequest: VacationRequest = {
      id: Date.now().toString(),
      userId: user.id,
      shift: selectedShift,
      startDate,
      endDate,
      type: vacationType,
      reason,
      status: "pending",
      requestedAt: new Date().toISOString(),
    };

    console.log("新しい休暇申請:", newRequest);

    // フォームをリセット
    setStartDate("");
    setEndDate("");
    setReason("");
    setVacationType("paid_leave");
    setIsModalOpen(false);

    return {
      ok: true,
      title: "完了",
      message: "休暇申請を提出しました",
    };
  }, [endDate, reason, selectedShift, startDate, user.id, vacationType]);

  return {
    state: {
      isModalOpen,
      startDate,
      endDate,
      vacationType,
      reason,
    },
    data: {
      vacationBalance,
      vacationRequests: filteredVacationRequests,
    },
    utils: {
      getStatusColor,
      getStatusText,
      getStatusIcon,
      getTypeText,
      calculateDays,
    },
    actions: {
      setIsModalOpen,
      setStartDate,
      setEndDate,
      setVacationType,
      setReason,
      handleSubmitRequest,
    },
  };
}

