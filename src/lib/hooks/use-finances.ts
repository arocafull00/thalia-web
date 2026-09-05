import { useCallback, useEffect, useMemo } from "react";

import { useClinicId } from "@/lib/hooks/use-active-clinic";
import {
  useClinicServerSeed,
  useServerSeed,
} from "@/lib/hooks/use-server-seed";
import {
  summaryKey,
  transactionsPageKey,
  type TransactionsPageQuery,
  transactionsToCsv,
  useFinancesStore,
  type FinancialSummary,
  type TransactionInput,
  type TransactionUpdatePayload,
} from "@/stores/finances-store";
import { isInitialLoading } from "@/stores/query-state";
import type { Transaction } from "@/types/database.types";

export type { TransactionInput, TransactionUpdatePayload };
export { transactionsToCsv };

type TransactionsPageSeed = {
  initialTransactions?: Transaction[];
  initialTotal?: number;
  initialQuery?: TransactionsPageQuery;
};

/**
 * Listado de movimientos paginado en servidor.
 *
 * Sustituye al «cargar más» que recortaba en memoria: filtros, búsqueda y
 * orden viajan al servidor, y el recuento sale de `count: "exact"`.
 */
export function useTransactionsPage(
  query: TransactionsPageQuery,
  seed?: TransactionsPageSeed,
) {
  const key = transactionsPageKey(query);
  const entry = useFinancesStore((state) => state.byPage[key]);
  const fetchTransactionsPage = useFinancesStore(
    (state) => state.fetchTransactionsPage,
  );
  const seedTransactionsPage = useFinancesStore(
    (state) => state.seedTransactionsPage,
  );

  const seededResult = useServerSeed(
    key,
    seed?.initialQuery ? transactionsPageKey(seed.initialQuery) : "",
    seed?.initialTransactions
      ? {
          transactions: seed.initialTransactions,
          total: seed.initialTotal ?? seed.initialTransactions.length,
        }
      : undefined,
  );
  const hasClientData = entry?.data != null;

  useEffect(() => {
    if (seededResult === undefined || hasClientData) {
      return;
    }

    seedTransactionsPage(query, seededResult);
  }, [hasClientData, query, seedTransactionsPage, seededResult]);

  useEffect(() => {
    if (seededResult !== undefined) {
      return;
    }

    void fetchTransactionsPage(query);
  }, [fetchTransactionsPage, query, seededResult]);

  const refresh = useCallback(
    () => fetchTransactionsPage(query),
    [fetchTransactionsPage, query],
  );

  const resolved = entry?.data ?? seededResult ?? null;
  const transactions = useMemo(() => resolved?.transactions ?? [], [resolved]);

  return {
    transactions,
    total: resolved?.total ?? 0,
    error: entry?.error ?? null,
    isLoading: resolved == null && isInitialLoading(entry),
    refresh,
  };
}

export function useFinancialSummary(
  month: Date,
  categoryId: string,
  initialData?: FinancialSummary,
) {
  const key = summaryKey(month, categoryId);
  const entry = useFinancesStore((state) => state.summaryByKey[key]);
  const fetchFinancialSummary = useFinancesStore(
    (state) => state.fetchFinancialSummary,
  );
  const seedFinancialSummary = useFinancesStore(
    (state) => state.seedFinancialSummary,
  );
  const clinicId = useClinicId();
  const seededData = useClinicServerSeed(clinicId, initialData);
  const hasClientData = entry?.data != null;

  useEffect(() => {
    if (seededData === undefined || hasClientData) {
      return;
    }

    seedFinancialSummary(month, categoryId, seededData);
  }, [categoryId, hasClientData, month, seedFinancialSummary, seededData]);

  useEffect(() => {
    if (seededData !== undefined) {
      return;
    }

    void fetchFinancialSummary(month, categoryId);
  }, [categoryId, clinicId, fetchFinancialSummary, key, month, seededData]);

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
