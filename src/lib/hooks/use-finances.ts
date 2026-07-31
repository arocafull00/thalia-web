import { useCallback, useEffect } from "react";

import { useClinicId } from "@/lib/hooks/use-active-clinic";
import { useClinicServerSeed } from "@/lib/hooks/use-server-seed";
import {
  summaryKey,
  transactionsKey,
  transactionsToCsv,
  useFinancesStore,
  type FinancialSummary,
  type TransactionInput,
  type TransactionUpdatePayload,
} from "@/stores/finances-store";
import { isInitialLoading } from "@/stores/query-state";
import type { Transaction, TransactionType } from "@/types/database.types";

export type { TransactionInput, TransactionUpdatePayload };
export { transactionsToCsv };

export function useTransactions(
  month: Date,
  type: TransactionType | "all",
  initialData?: Transaction[],
) {
  const key = transactionsKey(month, type);
  const entry = useFinancesStore((state) => state.transactionsByKey[key]);
  const fetchTransactions = useFinancesStore(
    (state) => state.fetchTransactions,
  );
  const clinicId = useClinicId();
  const seededData = useClinicServerSeed(clinicId, initialData);
  const hasClientData = entry?.data != null;

  useEffect(() => {
    if (seededData !== undefined && !hasClientData) {
      return;
    }

    void fetchTransactions(month, type);
  }, [
    clinicId,
    fetchTransactions,
    hasClientData,
    key,
    month,
    seededData,
    type,
  ]);

  const data = entry?.data ?? seededData;

  return {
    data,
    isLoading: data == null && isInitialLoading(entry),
    error: entry?.error,
  };
}

export function useFinancialSummary(
  month: Date,
  initialData?: FinancialSummary,
) {
  const key = summaryKey(month);
  const entry = useFinancesStore((state) => state.summaryByKey[key]);
  const fetchFinancialSummary = useFinancesStore(
    (state) => state.fetchFinancialSummary,
  );
  const clinicId = useClinicId();
  const seededData = useClinicServerSeed(clinicId, initialData);
  const hasClientData = entry?.data != null;

  useEffect(() => {
    if (seededData !== undefined && !hasClientData) {
      return;
    }

    void fetchFinancialSummary(month);
  }, [clinicId, fetchFinancialSummary, hasClientData, key, month, seededData]);

  const data = entry?.data ?? seededData;

  return {
    data,
    isLoading: data == null && isInitialLoading(entry),
    error: entry?.error,
  };
}

export function useCreateTransaction() {
  const createTransaction = useFinancesStore(
    (state) => state.createTransaction,
  );
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
          options?.onError?.(
            cause instanceof Error ? cause : new Error(String(cause)),
          ),
        );
    },
    [createTransaction],
  );

  return { mutate, isPending, error };
}

export function useUpdateTransaction() {
  const updateTransaction = useFinancesStore(
    (state) => state.updateTransaction,
  );
  const isPending = useFinancesStore((state) => state.creating);
  const error = useFinancesStore((state) => state.createError);

  const mutate = useCallback(
    (
      id: string,
      input: TransactionUpdatePayload,
      options?: { onSuccess?: () => void; onError?: (error: Error) => void },
    ) => {
      updateTransaction(id, input)
        .then(() => options?.onSuccess?.())
        .catch((cause) =>
          options?.onError?.(
            cause instanceof Error ? cause : new Error(String(cause)),
          ),
        );
    },
    [updateTransaction],
  );

  return { mutate, isPending, error };
}
