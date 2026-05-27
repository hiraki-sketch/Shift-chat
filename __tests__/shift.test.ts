import { getShiftLabel, isShift, sortShifts } from "../src/utils/shift";

describe("shift utils", () => {
  it("checks valid shift values", () => {
    expect(isShift("1")).toBe(true);
    expect(isShift("4")).toBe(false);
  });

  it("sorts shifts in 1 -> 2 -> 3 order", () => {
    expect(sortShifts(["3", "1", "2"])).toEqual(["1", "2", "3"]);
  });

  it("converts shift to label", () => {
    expect(getShiftLabel("2")).toBe("2勤");
  });
});
