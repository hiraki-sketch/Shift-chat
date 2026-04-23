import { useMemo } from 'react';
import type { ShiftType } from './useScheduleTypes';

const SHIFT_COLORS: Record<ShiftType, { bg: string; text: string; border: string }> = {
  '1勤': { bg: '#3B82F6', text: '#FFFFFF', border: '#2563EB' },
  '2勤': { bg: '#22C55E', text: '#FFFFFF', border: '#16A34A' },
  '3勤': { bg: '#F97316', text: '#FFFFFF', border: '#EA580C' },
  '1A': { bg: '#8B5CF6', text: '#FFFFFF', border: '#7C3AED' },
  '3B': { bg: '#EC4899', text: '#FFFFFF', border: '#DB2777' },
  '指定休': { bg: '#6B7280', text: '#FFFFFF', border: '#4B5563' },
  '有給': { bg: '#FACC15', text: '#111827', border: '#EAB308' },
  '休': { bg: '#E5E7EB', text: '#374151', border: '#9CA3AF' },
  '': { bg: 'transparent', text: '#111827', border: 'transparent' },
};

export function useShiftCellManagement(shift: ShiftType) {
  const colors = useMemo(() => SHIFT_COLORS[shift], [shift]);
  return { colors };
}
