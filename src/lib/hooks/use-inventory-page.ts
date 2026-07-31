import { useMemo } from "react";

import { useFilterPills } from "@/lib/hooks/use-filter-pills";
import { useInventoryItems } from "@/lib/hooks/use-inventory";
import {
  getInventoryStockLevel,
  inventoryStockSummaryCounts,
  type InventoryStockLevel,
} from "@/lib/inventory-stock";
import type { InventoryItem } from "@/types/database.types";

type InventoryPageFilters = {
  category: string;
  search: string;
  stock: string;
};

function resolveStockLevel(stockParam: string): InventoryStockLevel | "" {
  if (stockParam === "critical" || stockParam === "low") {
    return stockParam;
  }

  if (stockParam === "ok" || stockParam === "optimal") {
    return "optimal";
  }

  return "";
}

export function useInventoryPage(
  filters: InventoryPageFilters,
  initialItems?: InventoryItem[],
) {
  const inventory = useInventoryItems(initialItems);
  const items = useMemo(() => inventory.data ?? [], [inventory.data]);
  const summary = useMemo(() => inventoryStockSummaryCounts(items), [items]);
  const categories = useFilterPills(items);
  const stockLevel = resolveStockLevel(filters.stock);

  const filteredItems = useMemo(() => {
    const normalizedSearch = filters.search.trim().toLowerCase();

    return items.filter((item) => {
      if (filters.category && item.category !== filters.category) {
        return false;
      }

      if (stockLevel) {
        const level = getInventoryStockLevel(
          Number(item.stock ?? 0),
          Number(item.min_stock ?? 0),
        );

        if (level !== stockLevel) {
          return false;
        }
      }

      if (!normalizedSearch) {
        return true;
      }

      return item.name.toLowerCase().includes(normalizedSearch);
    });
  }, [filters.category, filters.search, items, stockLevel]);

  const listData = inventory.isLoading ? [] : filteredItems;

  return {
    categories,
    category: filters.category,
    filteredItems,
    inventory,
    listData,
    stockLevel: filters.stock,
    summary,
  };
}
