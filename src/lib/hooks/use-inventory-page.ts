import { useCallback, useEffect, useMemo } from "react";

import type {
  InventoryPageResult,
  InventoryStockSummary,
} from "@/dal/inventory.dal";
import { useClinicId } from "@/lib/hooks/use-active-clinic";
import { useServerSeed } from "@/lib/hooks/use-server-seed";
import { INVENTORY_PAGE_SIZE } from "@/lib/inventory-pagination";
import {
  inventoryPageKey,
  useInventoryStore,
  type InventoryPageQuery,
} from "@/stores/inventory-store";
import { isInitialLoading } from "@/stores/query-state";

const EMPTY_SUMMARY: InventoryStockSummary = {
  critical: 0,
  low: 0,
  optimal: 0,
};

type InventoryPageFilters = {
  category: string;
  page: number;
  search: string;
  stock: string;
};

type InventoryPageSeed = {
  initialPage?: InventoryPageResult;
  initialQuery?: InventoryPageQuery;
  initialCategories?: string[];
  initialSummary?: InventoryStockSummary;
};

/**
 * Normaliza el filtro de la URL al valor de la columna `stock_level`.
 *
 * `ok` es un alias histórico de `optimal` que sigue llegando desde enlaces
 * antiguos y desde las tarjetas de la cabecera.
 */
function resolveStockLevel(stockParam: string): string {
  if (stockParam === "critical" || stockParam === "low") {
    return stockParam;
  }

  if (stockParam === "ok" || stockParam === "optimal") {
    return "optimal";
  }

  return "";
}

/**
 * Listado de materiales paginado en servidor.
 *
 * Filtros, búsqueda y orden viajan al servidor: filtrar en cliente sobre una
 * página ya recortada daría recuentos falsos y rompería la paginación.
 */
export function useInventoryPage(
  filters: InventoryPageFilters,
  seed?: InventoryPageSeed,
) {
  const clinicId = useClinicId();

  const query = useMemo<InventoryPageQuery>(
    () => ({
      search: filters.search,
      category: filters.category,
      stockLevel: resolveStockLevel(filters.stock),
      page: filters.page,
      pageSize: INVENTORY_PAGE_SIZE,
    }),
    [filters.category, filters.page, filters.search, filters.stock],
  );

  const key = inventoryPageKey(query);
  const entry = useInventoryStore((state) => state.byPage[key]);
  const categoriesEntry = useInventoryStore((state) => state.categories);
  const summaryEntry = useInventoryStore((state) => state.summary);
  const fetchInventoryItemsPage = useInventoryStore(
    (state) => state.fetchInventoryItemsPage,
  );
  const seedInventoryItemsPage = useInventoryStore(
    (state) => state.seedInventoryItemsPage,
  );
  const fetchInventoryCategories = useInventoryStore(
    (state) => state.fetchInventoryCategories,
  );
  const seedInventoryCategories = useInventoryStore(
    (state) => state.seedInventoryCategories,
  );
  const fetchInventoryStockSummary = useInventoryStore(
    (state) => state.fetchInventoryStockSummary,
  );
  const seedInventoryStockSummary = useInventoryStore(
    (state) => state.seedInventoryStockSummary,
  );

  // La siembra sólo vale para la consulta exacta que resolvió el servidor: si
  // los filtros de la URL no coinciden, se descarta y el cliente vuelve a pedir.
  const seededResult = useServerSeed(
    key,
    seed?.initialQuery ? inventoryPageKey(seed.initialQuery) : "",
    seed?.initialPage,
  );
  const hasClientData = entry?.data != null;

  useEffect(() => {
    if (seededResult === undefined || hasClientData) {
      return;
    }

    seedInventoryItemsPage(query, seededResult);
  }, [hasClientData, query, seedInventoryItemsPage, seededResult]);

  useEffect(() => {
    if (seededResult !== undefined) {
      return;
    }

    void fetchInventoryItemsPage(query);
  }, [fetchInventoryItemsPage, query, seededResult]);

  // Categorías y resumen no dependen de la página: se piden una vez por
  // clínica. Derivarlos de las 10 filas visibles dejaría el desplegable corto y
  // haría que las tarjetas de cabecera contasen sólo la página.
  const hasCategories = categoriesEntry.data != null;

  useEffect(() => {
    if (seed?.initialCategories && !hasCategories) {
      seedInventoryCategories(seed.initialCategories);
      return;
    }

    if (hasCategories) {
      return;
    }

    void fetchInventoryCategories();
  }, [
    clinicId,
    fetchInventoryCategories,
    hasCategories,
    seedInventoryCategories,
    seed?.initialCategories,
  ]);

  const hasSummary = summaryEntry.data != null;

  useEffect(() => {
    if (seed?.initialSummary && !hasSummary) {
      seedInventoryStockSummary(seed.initialSummary);
      return;
    }

    if (hasSummary) {
      return;
    }

    void fetchInventoryStockSummary();
  }, [
    clinicId,
    fetchInventoryStockSummary,
    hasSummary,
    seedInventoryStockSummary,
    seed?.initialSummary,
  ]);

  const refresh = useCallback(
    () => fetchInventoryItemsPage(query),
    [fetchInventoryItemsPage, query],
  );

  const resolved = entry?.data ?? seededResult ?? null;
  const items = useMemo(() => resolved?.items ?? [], [resolved]);

  const categories = useMemo(
    () => categoriesEntry.data ?? seed?.initialCategories ?? [],
    [categoriesEntry.data, seed?.initialCategories],
  );

  return {
    categories,
    category: filters.category,
    items,
    total: resolved?.total ?? 0,
    stockLevel: filters.stock,
    summary: summaryEntry.data ?? seed?.initialSummary ?? EMPTY_SUMMARY,
    inventory: {
      error: entry?.error ?? null,
      isLoading: resolved == null && isInitialLoading(entry),
      isRefreshing: entry?.loading ?? false,
      refresh,
    },
  };
}
