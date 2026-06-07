import { MESSAGES } from "../messages";
import { notify } from "../notify";
import { normalizeError } from "./normalize-error";
import type { ApiResult } from "./types";

export interface HandleApiOptions {
  successMessage?: string;
  errorMessage?: string;
  silent?: boolean;
  showSuccess?: boolean;
}

export function handleApiResponse<T>(
  result: ApiResult<T>,
  options: HandleApiOptions = {},
): T | null {
  const { successMessage, errorMessage, silent = false, showSuccess = true } = options;

  if (result.success) {
    if (!silent && showSuccess) {
      notify.success(successMessage ?? result.message ?? MESSAGES.SUCCESS.DEFAULT);
    }
    return result.data;
  }

  if (!silent) {
    notify.error(errorMessage ?? result.message ?? MESSAGES.ERROR.DEFAULT);
  }
  return null;
}

export async function runApiAction<T>(
  action: () => Promise<ApiResult<T>>,
  options?: HandleApiOptions,
): Promise<T | null> {
  try {
    return handleApiResponse(await action(), options);
  } catch (error) {
    const failure = normalizeError(error);
    if (!options?.silent) {
      notify.error(options?.errorMessage ?? failure.message);
    }
    return null;
  }
}

export function mockSuccess<T>(data: T, message?: string): ApiResult<T> {
  return { success: true, data, message };
}

export function mockFailure(message: string, status?: number): ApiResult<never> {
  return { success: false, message, status };
}
