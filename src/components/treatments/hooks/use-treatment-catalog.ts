import { useMemo, useState } from "react";

import { useTreatments } from "@/lib/hooks/use-treatment";

export function useTreatmentCatalog(externalSearch?: string) {
  const [localSearch, setLocalSearch] = useState("");
  const search = externalSearch !== undefined ? externalSearch : localSearch;
  const [category, setCategory] = useState("");
  const treatments = useTreatments();

  const items = useMemo(() => treatments.data ?? [], [treatments.data]);

  const categories = useMemo(() => {
    const uniqueCategories = [
      ...new Set(items.map((item) => item.category).filter(Boolean)),
    ] as string[];
    return [
      "Todos",
      ...uniqueCategories.sort((left, right) =>
        left.localeCompare(right, "es"),
      ),
    ];
  }, [items]);

  const filteredTreatments = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return items.filter((item) => {
      if (category && item.category !== category) {
        return false;
      }

      if (!normalizedSearch) {
        return true;
      }

      return item.name.toLowerCase().includes(normalizedSearch);
    });
  }, [category, items, search]);

  const handleCategoryChange = (nextCategory: string) => {
    setCategory(nextCategory);
  };

  const handleSearchChange = (value: string) => {
    setLocalSearch(value);
  };

  return {
    categories,
    category,
    filteredTreatments,
    handleCategoryChange,
    handleSearchChange,
    search,
    treatments,
  };
}
