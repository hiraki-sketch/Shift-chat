import { validateLiveText, validateRequiredText } from "../src/utils/validation";

describe("validation utils", () => {
  it("required validation returns error for whitespace only", () => {
    expect(validateRequiredText("   ", "本文", 10)).toBe("本文を入力してください");
  });

  it("live validation returns null for empty text", () => {
    expect(validateLiveText("", "本文", 10)).toBeNull();
  });

  it("returns max length error when exceeded", () => {
    expect(validateRequiredText("123456", "本文", 5)).toBe(
      "本文は5文字以内で入力してください"
    );
  });
});
