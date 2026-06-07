import { MESSAGES, getHttpErrorMessage } from "../messages";
import { ApiClientError, type ApiFailure, type ApiFieldErrors } from "./types";

export function normalizeError(error: unknown): ApiFailure {
  if (error instanceof ApiClientError) {
    return {
      success: false,
      message: error.message || getHttpErrorMessage(error.status ?? 500),
      status: error.status,
      code: error.code,
      errors: error.errors,
    };
  }

  if (error instanceof Error) {
    if (error.message.toLowerCase().includes("fetch")) {
      return { success: false, message: MESSAGES.ERROR.NETWORK };
    }
    return { success: false, message: error.message || MESSAGES.ERROR.DEFAULT };
  }

  return { success: false, message: MESSAGES.ERROR.DEFAULT };
}

export function failureFromStatus(status: number, message?: string, errors?: ApiFieldErrors): ApiFailure {
  return {
    success: false,
    message: message ?? getHttpErrorMessage(status),
    status,
    errors,
  };
}
