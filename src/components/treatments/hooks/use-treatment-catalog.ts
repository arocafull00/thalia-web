import { useMemo } from "react";

import { useFilterPills } from "@/lib/hooks/use-filter-pills";
import { useTreatments } from "@/lib/hooks/use-treatment";
import type { TreatmentWithInventory } from "@/types/database.types";

type TreatmentCatalogFilters = {
  category: string;
  search: string;
};

export function useTreatmentCatalog(
  filters: TreatmentCatalogFilters,
  initialTreatments?: TreatmentWithInventory[],
) {
  const treatments = useTreatments(initialTreatments);
  const items = useMemo(() => treatments.data ?? [], [treatments.data]);
  const categories = useFilterPills(items);

  const filteredTreatments = useMemo(() => {
    const normalizedSearch = filters.search.trim().toLowerCase();

    return items.filter((item) => {
      if (filters.category && item.category !== filters.category) {
        return false;
      }

      if (!normalizedSearch) {
        return true;
      }

      return item.name.toLowerCase().includes(normalizedSearch);
    });
  }, [filters.category, filters.search, items]);

  return {
    categories,
    category: filters.category,
    filteredTreatments,
    treatments,
  };
}
