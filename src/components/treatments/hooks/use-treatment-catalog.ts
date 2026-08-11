import { useCallback, useEffect, useMemo } from "react";

import { SEARCH_COPY } from "@/copy/search-copy";
import { useClinicId } from "@/lib/hooks/use-active-clinic";
import { useServerSeed } from "@/lib/hooks/use-server-seed";
import { TREATMENTS_PAGE_SIZE } from "@/lib/treatment-pagination";
import { isInitialLoading } from "@/stores/query-state";
import {
  treatmentsPageKey,
  useTreatmentStore,
  type TreatmentsPageQuery,
} from "@/stores/treatment-store";
import type { TreatmentWithInventory } from "@/types/database.types";

type TreatmentCatalogFilters = {
  category: string;
  page: number;
  search: string;
};

type TreatmentCatalogSeed = {
  initialTreatments?: TreatmentWithInventory[];
  initialTotal?: number;
  initialQuery?: TreatmentsPageQuery;
  initialCategories?: string[];
};

/**
 * Catálogo de tratamientos paginado en servidor.
 *
 * Filtros, búsqueda y orden viajan al servidor: filtrar en cliente sobre una
 * página ya recortada daría recuentos falsos y rompería la paginación.
 */
export function useTreatmentCatalog(
  filters: TreatmentCatalogFilters,
  seed?: TreatmentCatalogSeed,
) {
  const clinicId = useClinicId();

  const query = useMemo<TreatmentsPageQuery>(
    () => ({
      category: filters.category,
      search: filters.search,
      page: filters.page,
      pageSize: TREATMENTS_PAGE_SIZE,
    }),
    [filters.category, filters.page, filters.search],
  );

  const key = treatmentsPageKey(query);
  const entry = useTreatmentStore((state) => state.byPage[key]);
  const categoriesEntry = useTreatmentStore((state) => state.categories);
  const fetchTreatmentsPage = useTreatmentStore(
    (state) => state.fetchTreatmentsPage,
  );
  const seedTreatmentsPage = useTreatmentStore(
    (state) => state.seedTreatmentsPage,
  );
  const fetchTreatmentCategories = useTreatmentStore(
    (state) => state.fetchTreatmentCategories,
  );

  // La siembra sólo vale para la consulta exacta que resolvió el servidor: si
  // los filtros de la URL no coinciden, se descarta y el cliente vuelve a pedir.
  const seededResult = useServerSeed(
    key,
    seed?.initialQuery ? treatmentsPageKey(seed.initialQuery) : "",
    seed?.initialTreatments
      ? {
          treatments: seed.initialTreatments,
          total: seed.initialTotal ?? seed.initialTreatments.length,
        }
      : undefined,
  );
  const hasClientData = entry?.data != null;

  useEffect(() => {
    if (seededResult === undefined || hasClientData) {
      return;
    }

    seedTreatmentsPage(query, seededResult);
  }, [hasClientData, query, seedTreatmentsPage, seededResult]);

  useEffect(() => {
    if (seededResult !== undefined) {
      return;
    }

    void fetchTreatmentsPage(query);
  }, [fetchTreatmentsPage, query, seededResult]);

  // Las categorías no dependen de la página, así que se piden una vez por
  // clínica y no en cada cambio de filtro.
  const hasCategories = categoriesEntry.data != null;

  useEffect(() => {
    if (hasCategories || seed?.initialCategories) {
      return;
    }

    void fetchTreatmentCategories();
  }, [
    clinicId,
    fetchTreatmentCategories,
    hasCategories,
    seed?.initialCategories,
  ]);

  const refresh = useCallback(
    () => fetchTreatmentsPage(query),
    [fetchTreatmentsPage, query],
  );

  const resolved = entry?.data ?? seededResult ?? null;
  const filteredTreatments = useMemo(
    () => resolved?.treatments ?? [],
    [resolved],
  );
  const total = resolved?.total ?? 0;

  const categories = useMemo(
    () => [
      SEARCH_COPY.filters.all,
      ...(categoriesEntry.data ?? seed?.initialCategories ?? []),
    ],
    [categoriesEntry.data, seed?.initialCategories],
  );

  return {
    categories,
    category: filters.category,
    filteredTreatments,
    total,
    treatments: {
      data: resolved,
      error: entry?.error ?? null,
      isLoading: isInitialLoading(entry),
      // `loading` con datos ya en pantalla es un refresco, no una carga inicial.
      isRefreshing: entry?.loading ?? false,
      refresh,
    },
  };
}
