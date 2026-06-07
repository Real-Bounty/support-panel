import { createApiClient, handleApiResponse, mockSuccess } from "@/shared";

export const api = createApiClient({
  baseUrl: import.meta.env.VITE_API_URL ?? "",
  getToken: () => localStorage.getItem("realbounty_support_token"),
});

export async function runMockAction<T>(
  data: T,
  message?: string,
  options?: Parameters<typeof handleApiResponse>[1],
): Promise<T | null> {
  return handleApiResponse(mockSuccess(data, message), options);
}
