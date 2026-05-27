import type { Shift } from "../../types";

export const SHIFT_ORDER: Shift[] = ["1", "2", "3"];

export function isShift(value: string): value is Shift {
  return SHIFT_ORDER.includes(value as Shift);
}

export function sortShifts(shifts: Shift[]): Shift[] {
  return [...shifts].sort(
    (a, b) => SHIFT_ORDER.indexOf(a) - SHIFT_ORDER.indexOf(b)
  );
}

export function getShiftLabel(shift: Shift): string {
  return `${shift}勤`;
}
