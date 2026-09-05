import { useEffect, useMemo } from "react";

import { useClinicId } from "@/lib/hooks/use-active-clinic";
import { useClinicServerSeed } from "@/lib/hooks/use-server-seed";
import { isInitialLoading } from "@/stores/query-state";
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

  useEffect(() => {
    if (!clinicId || seededData !== undefined || hasClientData) {
      return;
    }

    void fetchCategories(clinicId);
  }, [clinicId, fetchCategories, hasClientData, seededData]);

  return {
    categories: useMemo(
      () => entry?.data ?? seededData ?? [],
      [entry?.data, seededData],
    ),
    error: entry?.error ?? null,
    isLoading:
      !clinicId ||
      (entry?.data == null &&
        seededData === undefined &&
        isInitialLoading(entry)),
  };
}
