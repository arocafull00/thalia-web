import { useCallback, useEffect } from "react";

import {
  summaryKey,
  transactionsKey,
  transactionsToCsv,
  useFinancesStore,
  type TransactionInput,
} from "@/stores/finances-store";
import type { TransactionType } from "@/types/database.types";

export type { TransactionInput };
export { transactionsToCsv };

export function useTransactions(month: Date, type: TransactionType | "all") {
  const key = transactionsKey(month, type);
  const entry = useFinancesStore((state) => state.transactionsByKey[key]);
  const fetchTransactions = useFinancesStore((state) => state.fetchTransactions);

  useEffect(() => {
    void fetchTransactions(month, type);
  }, [fetchTransactions, key]);

  return {
    data: entry?.data ?? undefined,
    isLoading: entry?.loading ?? true,
    error: entry?.error,
  };
}

export function useFinancialSummary(month: Date) {
  const key = summaryKey(month);
  const entry = useFinancesStore((state) => state.summaryByKey[key]);
  const fetchFinancialSummary = useFinancesStore((state) => state.fetchFinancialSummary);

  useEffect(() => {
    void fetchFinancialSummary(month);
  }, [fetchFinancialSummary, key]);

  return {
    data: entry?.data ?? undefined,
    isLoading: entry?.loading ?? true,
    error: entry?.error,
  };
}

export function useCreateTransaction() {
  const createTransaction = useFinancesStore((state) => state.createTransaction);
  const isPending = useFinancesStore((state) => state.creating);
  const error = useFinancesStore((state) => state.createError);

  const mutate = useCallback(
    (
      input: TransactionInput,
      options?: { onSuccess?: () => void; onError?: (error: Error) => void },
    ) => {
      createTransaction(input)
        .then(() => options?.onSuccess?.())
        .catch((cause) =>
          options?.onError?.(cause instanceof Error ? cause : new Error(String(cause))),
        );
    },
    [createTransaction],
  );

  return { mutate, isPending, error };
}
