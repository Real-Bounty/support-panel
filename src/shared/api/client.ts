import { MESSAGES, getHttpErrorMessage } from "../messages";
import { failureFromStatus } from "./normalize-error";
import type { ApiResult } from "./types";

export interface ApiClientOptions {
  baseUrl?: string;
  getToken?: () => string | null;
  onUnauthorized?: () => void;
}

export interface RequestOptions extends Omit<RequestInit, "body"> {
  body?: unknown;
  params?: Record<string, string | number | boolean | undefined | null>;
}

function buildUrl(base: string, path: string, params?: RequestOptions["params"]): string {
  const url = new URL(path.startsWith("http") ? path : `${base}${path}`);
  if (params) {
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined && value !== null) {
        url.searchParams.set(key, String(value));
      }
    }
  }
  return url.toString();
}

export function createApiClient(options: ApiClientOptions = {}) {
  const baseUrl = options.baseUrl ?? "";

  async function request<T>(path: string, init: RequestOptions = {}): Promise<ApiResult<T>> {
    const { body, params, headers, ...rest } = init;
    const token = options.getToken?.();

    try {
      const response = await fetch(buildUrl(baseUrl, path, params), {
        ...rest,
        headers: {
          Accept: "application/json",
          ...(body !== undefined ? { "Content-Type": "application/json" } : {}),
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
          ...headers,
        },
        body: body !== undefined ? JSON.stringify(body) : undefined,
      });

      if (response.status === 401) {
        options.onUnauthorized?.();
        return failureFromStatus(401, MESSAGES.ERROR.UNAUTHORIZED);
      }

      const payload = await response.json().catch(() => null);

      if (!response.ok) {
        const message =
          (payload && typeof payload === "object" && "message" in payload && String(payload.message)) ||
          getHttpErrorMessage(response.status);
        return failureFromStatus(response.status, message);
      }

      if (payload && typeof payload === "object" && "success" in payload) {
        return payload as ApiResult<T>;
      }

      return { success: true, data: payload as T };
    } catch {
      return failureFromStatus(0, MESSAGES.ERROR.NETWORK);
    }
  }

  return {
    get: <T>(path: string, opts?: Omit<RequestOptions, "method" | "body">) =>
      request<T>(path, { ...opts, method: "GET" }),
    post: <T>(path: string, body?: unknown, opts?: Omit<RequestOptions, "method" | "body">) =>
      request<T>(path, { ...opts, method: "POST", body }),
    put: <T>(path: string, body?: unknown, opts?: Omit<RequestOptions, "method" | "body">) =>
      request<T>(path, { ...opts, method: "PUT", body }),
    patch: <T>(path: string, body?: unknown, opts?: Omit<RequestOptions, "method" | "body">) =>
      request<T>(path, { ...opts, method: "PATCH", body }),
    delete: <T>(path: string, opts?: Omit<RequestOptions, "method" | "body">) =>
      request<T>(path, { ...opts, method: "DELETE" }),
  };
}

export type ApiClient = ReturnType<typeof createApiClient>;
