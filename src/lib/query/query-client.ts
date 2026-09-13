import {
  environmentManager,
  MutationCache,
  QueryCache,
  QueryClient,
} from "@tanstack/react-query";

import { logger } from "@/lib/logger";

export const QUERY_GC_TIME = 30 * 60 * 1000;

function createQueryClient() {
  return new QueryClient({
    queryCache: new QueryCache({
      onError: (error, query) => {
        logger.captureException(error, {
          action: "tanstackQuery",
          queryKey: query.queryKey,
        });
      },
    }),
    mutationCache: new MutationCache({
      onError: (error, _variables, _onMutateResult, mutation) => {
        logger.captureException(error, {
          action: "tanstackMutation",
          mutationKey: mutation.options.mutationKey,
        });
      },
    }),
    defaultOptions: {
      queries: {
        gcTime: QUERY_GC_TIME,
        refetchOnReconnect: true,
        refetchOnWindowFocus: true,
        retry: environmentManager.isServer() ? false : 1,
      },
      mutations: {
        retry: false,
      },
    },
  });
}

let browserQueryClient: QueryClient | undefined;

export function getQueryClient() {
  if (environmentManager.isServer()) {
    return createQueryClient();
  }

  browserQueryClient ??= createQueryClient();
  return browserQueryClient;
}

export function clearBrowserQueryClient() {
  browserQueryClient?.clear();
}
