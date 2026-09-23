import { useEffect } from "react";

import { useRevalidateOnEntry } from "@/lib/hooks/use-revalidate-on-entry";
import { useClinicId } from "@/lib/hooks/use-active-clinic";
import { useClinicServerSeed } from "@/lib/hooks/use-server-seed";
import {
  isInitialLoading,
  isQueryFresh,
  REFERENCE_QUERY_STALE_TIME,
} from "@/stores/query-state";
import { useTransactionCategoriesStore } from "@/stores/transaction-categories-store";
import type { TransactionCategory } from "@/types/database.types";

export function useTransactionCategories(initialData?: TransactionCategory[]) {
  const clinicId = useClinicId();
  const entry = useTransactionCategoriesStore((state) =>
    clinicId ? state.byClinic[clinicId] : undefined,
  );
  const fetchCategories = useTransactionCategoriesStore(
    (state) => state.fetchCategories,
  );
  const seedCategories = useTransactionCategoriesStore(
    (state) => state.seedCategories,
  );
  const seededData = useClinicServerSeed(clinicId, initialData);
  const hasClientData = entry?.data != null;

  useEffect(() => {
    if (!clinicId || seededData === undefined || hasClientData) {
      return;
    }

    seedCategories(clinicId, seededData);
  }, [clinicId, hasClientData, seedCategories, seededData]);

  useRevalidateOnEntry(clinicId ? `transaction-categories:${clinicId}` : null, () => fetchCategories(clinicId!));

  return {
    categories: isQueryFresh(entry, REFERENCE_QUERY_STALE_TIME)
      ? (entry?.data ?? [])
      : (seededData ?? entry?.data ?? []),
    error: entry?.error ?? null,
    isLoading:
      !clinicId ||
      (entry?.data == null &&
        seededData === undefined &&
        isInitialLoading(entry)),
  };
}
