import { useMemo, useState } from "react";

import { useInventoryItems } from "@/lib/hooks/use-inventory";
import { inventoryStockSummaryCounts } from "@/lib/inventory-stock";

export function useInventoryPage(externalSearch?: string) {
  const [localSearch, setLocalSearch] = useState("");
  const search = externalSearch !== undefined ? externalSearch : localSearch;
  const [category, setCategory] = useState("");
  const inventory = useInventoryItems();

  const items = useMemo(() => inventory.data ?? [], [inventory.data]);
  const summary = useMemo(() => inventoryStockSummaryCounts(items), [items]);

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

  const filteredItems = useMemo(() => {
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

  const listData = inventory.isLoading ? [] : filteredItems;

  const handleCategoryChange = (nextCategory: string) => {
    setCategory(nextCategory);
  };

  const handleSearchChange = (value: string) => {
    setLocalSearch(value);
  };

  return {
    categories,
    category,
    filteredItems,
    handleCategoryChange,
    handleSearchChange,
    inventory,
    listData,
    search,
    summary,
  };
}
