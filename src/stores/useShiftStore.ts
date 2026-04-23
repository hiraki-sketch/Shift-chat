import { create } from "zustand";

import type { Shift } from "../../types";

type ShiftStoreState = {
  selectedShift: Shift;
  setSelectedShift: (shift: Shift) => void;
};

export const useShiftStore = create<ShiftStoreState>((set) => ({
  selectedShift: "1勤",
  setSelectedShift: (shift) => set({ selectedShift: shift }),
}));
