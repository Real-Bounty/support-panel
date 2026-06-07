export type ApiFieldErrors = Record<string, string | string[]>;

export interface ApiSuccess<T = unknown> {
  success: true;
  data: T;
  message?: string;
  code?: string;
}

export interface ApiFailure {
  success: false;
  message: string;
  code?: string;
  status?: number;
  errors?: ApiFieldErrors;
}

export type ApiResult<T = unknown> = ApiSuccess<T> | ApiFailure;

export class ApiClientError extends Error {
  status?: number;
  code?: string;
  errors?: ApiFieldErrors;

  constructor(message: string, options?: { status?: number; code?: string; errors?: ApiFieldErrors }) {
    super(message);
    this.name = "ApiClientError";
    this.status = options?.status;
    this.code = options?.code;
    this.errors = options?.errors;
  }
}
