import { useCallback, useEffect, useMemo, useState } from "react";
import type { AttendanceRecord, User } from "../../types";

type TodayStatus = "not_started" | "working" | "on_break" | "finished";

export function useAttendanceManagement(user: User) {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [todayStatus, setTodayStatus] = useState<TodayStatus>("not_started");

  const todayAttendance = useMemo<Partial<AttendanceRecord>>(
    () => ({
      id: "1",
      userId: user.id,
      date: new Date().toISOString().split("T")[0],
      shift: "1勤",
      clockIn: "08:00",
      status: "present",
    }),
    [user.id]
  );

  const recentAttendance = useMemo<AttendanceRecord[]>(
    () => [
      {
        id: "1",
        userId: user.id,
        date: "2024-12-19",
        shift: "1勤",
        clockIn: "08:02",
        clockOut: "16:05",
        breakStart: "12:00",
        breakEnd: "13:00",
        status: "present",
        notes: "",
      },
      {
        id: "2",
        userId: user.id,
        date: "2024-12-18",
        shift: "2勤",
        clockIn: "16:10",
        clockOut: "00:15",
        breakStart: "20:00",
        breakEnd: "21:00",
        status: "late",
        notes: "交通遅延のため遅刻",
      },
      {
        id: "3",
        userId: user.id,
        date: "2024-12-17",
        shift: "1勤",
        clockIn: "08:00",
        clockOut: "16:00",
        breakStart: "12:00",
        breakEnd: "13:00",
        status: "present",
        notes: "",
      },
    ],
    [user.id]
  );

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = useCallback((date: Date) => {
    return date.toLocaleTimeString("ja-JP", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  }, []);

  const getStatusColor = useCallback((status: string) => {
    switch (status) {
      case "present":
        return "bg-green-500";
      case "late":
        return "bg-red-500";
      case "absent":
        return "bg-gray-500";
      case "early_leave":
        return "bg-yellow-500";
      default:
        return "bg-gray-500";
    }
  }, []);

  const getStatusText = useCallback((status: string) => {
    switch (status) {
      case "present":
        return "出勤";
      case "late":
        return "遅刻";
      case "absent":
        return "欠勤";
      case "early_leave":
        return "早退";
      default:
        return "不明";
    }
  }, []);

  const handleClockIn = useCallback(() => {
    setTodayStatus("working");
    console.log("出勤打刻:", formatTime(currentTime));
  }, [currentTime, formatTime]);

  const handleClockOut = useCallback(() => {
    setTodayStatus("finished");
    console.log("退勤打刻:", formatTime(currentTime));
  }, [currentTime, formatTime]);

  const handleBreakStart = useCallback(() => {
    setTodayStatus("on_break");
    console.log("休憩開始:", formatTime(currentTime));
  }, [currentTime, formatTime]);

  const handleBreakEnd = useCallback(() => {
    setTodayStatus("working");
    console.log("休憩終了:", formatTime(currentTime));
  }, [currentTime, formatTime]);

  const calculateWorkTime = useCallback(
    (clockIn: string, clockOut: string, breakStart?: string, breakEnd?: string) => {
      const inTime = new Date(`2024-01-01 ${clockIn}`);
      const outTime = new Date(`2024-01-01 ${clockOut}`);

      let workMinutes = (outTime.getTime() - inTime.getTime()) / (1000 * 60);

      if (breakStart && breakEnd) {
        const breakStartTime = new Date(`2024-01-01 ${breakStart}`);
        const breakEndTime = new Date(`2024-01-01 ${breakEnd}`);
        const breakMinutes =
          (breakEndTime.getTime() - breakStartTime.getTime()) / (1000 * 60);
        workMinutes -= breakMinutes;
      }

      const hours = Math.floor(workMinutes / 60);
      const minutes = workMinutes % 60;
      return `${hours}時間${minutes}分`;
    },
    []
  );

  return {
    state: {
      currentTime,
      todayStatus,
    },
    data: {
      todayAttendance,
      recentAttendance,
    },
    utils: {
      formatTime,
      getStatusColor,
      getStatusText,
      calculateWorkTime,
    },
    actions: {
      handleClockIn,
      handleClockOut,
      handleBreakStart,
      handleBreakEnd,
    },
  };
}

