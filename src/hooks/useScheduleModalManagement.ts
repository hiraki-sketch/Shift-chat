import { useEffect, useMemo, useState } from 'react';
import type { ShiftData, ShiftType } from './useScheduleTypes';

const SHIFT_OPTIONS: ShiftType[] = ['1勤', '2勤', '3勤', '1A', '3B', '指定休', '有給', '休', ''];

type UseScheduleModalManagementParams = {
  visible: boolean;
  currentData: ShiftData;
  onSave: (shiftData: ShiftData) => void;
};

export function useScheduleModalManagement({
  visible,
  currentData,
  onSave,
}: UseScheduleModalManagementParams) {
  const [selectedShift, setSelectedShift] = useState<ShiftType>('');
  const [workplace, setWorkplace] = useState('');

  useEffect(() => {
    if (!visible) return;
    setSelectedShift(currentData.shift);
    setWorkplace(currentData.workplace);
  }, [visible, currentData.shift, currentData.workplace]);

  const shiftOptions = useMemo(() => SHIFT_OPTIONS, []);

  const handleSave = () => {
    onSave({ shift: selectedShift, workplace: workplace.trim() });
  };

  return {
    state: {
      selectedShift,
      workplace,
    },
    data: {
      shiftOptions,
    },
    actions: {
      setSelectedShift,
      setWorkplace,
      handleSave,
    },
  };
}
