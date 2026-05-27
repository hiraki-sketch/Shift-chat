export type ValidationOptions = {
  required?: boolean;
};

export function validateRequiredText(
  value: string,
  label: string,
  maxLength: number,
  options: ValidationOptions = {}
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

export function validateLiveText(
  value: string,
  label: string,
  maxLength: number,
  options: ValidationOptions = {}
): string | null {
  const { required = true } = options;

  if (value.length === 0) {
    return null;
  }

  if (required && value.trim().length === 0) {
    return `${label}を入力してください`;
  }

  if (value.length > maxLength) {
    return `${label}は${maxLength}文字以内で入力してください`;
  }

  return null;
}
