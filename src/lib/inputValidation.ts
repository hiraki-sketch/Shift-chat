export const INCIDENT_REPORT_TITLE_MAX_LENGTH = 50;
export const DEPARTMENT_ANNOUNCEMENT_TITLE_MAX_LENGTH = 50;
export const CHAT_MESSAGE_MAX_LENGTH = 300;
export const BODY_MAX_LENGTH = 1500;

type ValidateTextOptions = {
  required?: boolean;
};

export function getLiveValidationMessage(
  value: string,
  label: string,
  maxLength: number,
  options: ValidateTextOptions = {}
): string | null {
  const { required = true } = options;
  if (value.length === 0) return null;
  if (required && value.trim().length === 0) {
    return `${label}を入力してください`;
  }
  if (value.length > maxLength) {
    return `${label}は${maxLength}文字以内で入力してください`;
  }
  return null;
}

export function getSubmitValidationMessage(
  value: string,
  label: string,
  maxLength: number,
  options: ValidateTextOptions = {}
): string | null {
  const { required = true } = options;
  if (required && value.trim().length === 0) {
    return `${label}を入力してください`;
  }
  if (value.length > maxLength) {
    return `${label}は${maxLength}文字以内で入力してください`;
  }
  return null;
}
