import { useCallback, useMemo, useState } from "react";
import type { Shift, User, WorkScheduleEntry } from "../../types";

export function useWorkScheduleManagement(user: User, selectedShift: Shift) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const scheduleEntries = useMemo<WorkScheduleEntry[]>(
    () => [
      {
        id: "1",
        userId: user.id,
        date: "2024-12-20",
        shift: "1勤",
        startTime: "08:00",
        endTime: "16:00",
        department: user.department,
        status: "confirmed",
      },
      {
        id: "2",
        userId: user.id,
        date: "2024-12-21",
        shift: "2勤",
        startTime: "16:00",
        endTime: "00:00",
        department: user.department,
        status: "scheduled",
      },
      {
        id: "3",
        userId: user.id,
        date: "2024-12-22",
        shift: "1勤",
        startTime: "08:00",
        endTime: "16:00",
        department: user.department,
        status: "scheduled",
      },
      {
        id: "4",
        userId: user.id,
        date: "2024-12-23",
        shift: "3勤",
        startTime: "00:00",
        endTime: "08:00",
        department: user.department,
        status: "scheduled",
      },
    ],
    [user.department, user.id]
  );

  const getShiftColor = useCallback((shift: Shift) => {
    switch (shift) {
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

  const getShiftTextColor = useCallback((shift: Shift) => {
    switch (shift) {
      case "1勤":
        return "text-blue-800";
      case "2勤":
        return "text-green-800";
      case "3勤":
        return "text-purple-800";
      default:
        return "text-gray-800";
    }
  }, []);

  const getStatusColor = useCallback((status: string) => {
    switch (status) {
      case "confirmed":
        return "text-green-600";
      case "scheduled":
        return "text-blue-600";
      case "completed":
        return "text-gray-600";
      default:
        return "text-gray-500";
    }
  }, []);

  const getStatusText = useCallback((status: string) => {
    switch (status) {
      case "confirmed":
        return "確定";
      case "scheduled":
        return "予定";
      case "completed":
        return "完了";
      default:
        return "不明";
    }
  }, []);

  const formatDateForComparison = useCallback((date: Date) => {
    return date.toISOString().split("T")[0];
  }, []);

  const getDaysInMonth = useCallback((date: Date): Date[] => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());

    const days: Date[] = [];
    const current = new Date(startDate);
    for (let i = 0; i < 42; i++) {
      days.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }
    return days;
  }, []);

  const previousMonth = useCallback(() => {
    setCurrentMonth(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1)
    );
  }, []);

  const nextMonth = useCallback(() => {
    setCurrentMonth(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1)
    );
  }, []);

  const filteredScheduleEntries = useMemo(
    () => scheduleEntries.filter((entry) => entry.shift === selectedShift),
    [scheduleEntries, selectedShift]
  );

  const getScheduleForDate = useCallback(
    (date: Date) => {
      const dateStr = formatDateForComparison(date);
      return filteredScheduleEntries.find((entry) => entry.date === dateStr);
    },
    [filteredScheduleEntries, formatDateForComparison]
  );

  const days = useMemo(() => getDaysInMonth(currentMonth), [currentMonth, getDaysInMonth]);
  const monthNames = useMemo(
    () => ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"],
    []
  );
  const dayNames = useMemo(() => ["日", "月", "火", "水", "木", "金", "土"], []);

  return {
    state: {
      selectedDate,
      currentMonth,
    },
    data: {
      scheduleEntries: filteredScheduleEntries,
      days,
      monthNames,
      dayNames,
    },
    utils: {
      getShiftColor,
      getShiftTextColor,
      getStatusColor,
      getStatusText,
      formatDateForComparison,
      getScheduleForDate,
    },
    actions: {
      setSelectedDate,
      previousMonth,
      nextMonth,
    },
  };
}

