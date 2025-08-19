import type { ReactNode } from "react";

export function getHelperText(
  disabled: boolean | undefined,
  error: string | undefined,
  helperText: ReactNode | undefined,
  hasEmptyHelper: boolean | undefined
): ReactNode | string | undefined {
  if (disabled === true) {
    return hasEmptyHelper === true ? " " : undefined;
  }

  if (error !== undefined && error.length > 0) {
    return error;
  }

  if (helperText !== undefined) {
    return helperText;
  }

  return hasEmptyHelper === true ? " " : undefined;
}
