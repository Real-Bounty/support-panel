import {
  useMutation,
  useQuery,
  type QueryKey,
  type UseMutationOptions,
  type UseQueryOptions,
} from "@tanstack/react-query";
import { handleApiResponse } from "../api/handle-response";
import type { ApiResult } from "../api/types";

export function useAppQuery<T>(
  queryKey: QueryKey,
  queryFn: () => Promise<ApiResult<T>>,
  options?: Omit<UseQueryOptions<T | null, Error, T | null, QueryKey>, "queryKey" | "queryFn"> & {
    silent?: boolean;
  },
) {
  const { silent, ...rest } = options ?? {};
  return useQuery({
    queryKey,
    queryFn: async () => handleApiResponse(await queryFn(), { silent: silent ?? true }),
    ...rest,
  });
}

export function useAppMutation<TData, TVariables = void>(
  mutationFn: (variables: TVariables) => Promise<ApiResult<TData>>,
  options?: UseMutationOptions<TData | null, Error, TVariables> & {
    successMessage?: string;
    errorMessage?: string;
    silent?: boolean;
  },
) {
  const { successMessage, errorMessage, silent, ...rest } = options ?? {};
  return useMutation({
    mutationFn: async (variables) =>
      handleApiResponse(await mutationFn(variables), {
        successMessage,
        errorMessage,
        silent,
      }),
    ...rest,
  });
}
