export type InventoryStockLevel = "critical" | "low" | "optimal";

export function getInventoryStockLevel(stock: number, minStock: number): InventoryStockLevel {
  if (stock <= minStock * 0.5) {
    return "critical";
  }

  if (stock <= minStock * 1.2) {
    return "low";
  }

  return "optimal";
}

export function inventoryStockLevelLabel(level: InventoryStockLevel) {
  if (level === "critical") {
    return "Stock Crítico";
  }

  if (level === "low") {
    return "Stock Bajo";
  }

  return "Óptimo";
}

export function inventoryStockSummaryCounts(
  items: { stock: number | null; min_stock: number | null }[],
) {
  return items.reduce(
    (counts, item) => {
      const level = getInventoryStockLevel(Number(item.stock ?? 0), Number(item.min_stock ?? 0));

      if (level === "critical") {
        counts.critical += 1;
        return counts;
      }

      if (level === "low") {
        counts.low += 1;
        return counts;
      }

      counts.optimal += 1;
      return counts;
    },
    { critical: 0, low: 0, optimal: 0 },
  );
}
