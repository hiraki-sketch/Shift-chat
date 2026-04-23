import { useMemo } from 'react';
import type { ShiftType } from './useScheduleTypes';

const SHIFT_OPTIONS: ShiftType[] = [
  '1勤',
  '2勤',
  '3勤',
  '1A',
  '3B',
  '指定休',
  '有給',
  '休',
];

export function useShiftSelectorManagement() {
  const shiftOptions = useMemo(() => SHIFT_OPTIONS, []);
  return { shiftOptions };
}
