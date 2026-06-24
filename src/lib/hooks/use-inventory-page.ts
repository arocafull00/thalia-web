import { useMemo, useState } from "react";

import { useInventoryItems } from "@/lib/hooks/use-inventory";
import { inventoryStockSummaryCounts } from "@/lib/inventory-stock";

const PAGE_SIZE = 10;

export function useInventoryPage(externalSearch?: string) {
  const [localSearch, setLocalSearch] = useState("");
  const search = externalSearch !== undefined ? externalSearch : localSearch;
  const [category, setCategory] = useState("");
  const [page, setPage] = useState(1);
  const inventory = useInventoryItems();

  const items = inventory.data ?? [];
  const summary = useMemo(() => inventoryStockSummaryCounts(items), [items]);

  const categories = useMemo(() => {
    const uniqueCategories = [
      ...new Set(items.map((item) => item.category).filter(Boolean)),
    ] as string[];
    return ["Todos", ...uniqueCategories.sort((left, right) => left.localeCompare(right, "es"))];
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

  const totalPages = Math.max(1, Math.ceil(filteredItems.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageStart = (currentPage - 1) * PAGE_SIZE;
  const pageItems = filteredItems.slice(pageStart, pageStart + PAGE_SIZE);
  const pageEnd = Math.min(pageStart + pageItems.length, filteredItems.length);
  const listData = inventory.isLoading ? [] : pageItems;

  const handleCategoryChange = (nextCategory: string) => {
    setCategory(nextCategory);
    setPage(1);
  };

  const handleSearchChange = (value: string) => {
    setLocalSearch(value);
    setPage(1);
  };

  return {
    categories,
    category,
    currentPage,
    filteredItems,
    handleCategoryChange,
    handleSearchChange,
    inventory,
    listData,
    pageEnd,
    pageItems,
    pageStart,
    search,
    setPage,
    summary,
    totalPages,
  };
}
