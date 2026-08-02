"use client";

import { AlertTriangle, CheckCircle2, TrendingDown } from "lucide-react";

import InventoryStockSummaryItem from "@/components/inventory/components/list/inventory-stock-summary-item";
import { INVENTORY_COPY } from "@/copy/inventory-copy";

/**
 * Los valores coinciden con los del combobox de filtros: al pulsar un indicador
 * el desplegable queda seleccionado también, en lugar de convivir dos filtros
 * que dicen cosas distintas. «optimal» viaja como "ok" por lo mismo.
 */
const STOCK_ITEMS = [
  {
    key: "critical",
    filterValue: "critical",
    label: INVENTORY_COPY.summary.critical,
    tone: "danger",
    icon: AlertTriangle,
    testId: "inventory-summary-critical",
  },
  {
    key: "low",
    filterValue: "low",
    label: INVENTORY_COPY.summary.low,
    tone: "warning",
    icon: TrendingDown,
    testId: "inventory-summary-low",
  },
  {
    key: "optimal",
    filterValue: "ok",
    label: INVENTORY_COPY.summary.optimal,
    tone: "success",
    icon: CheckCircle2,
    testId: "inventory-summary-optimal",
  },
] as const;

type InventoryStockSummaryProps = {
  summary: { critical: number; low: number; optimal: number };
  activeStock: string;
  onStockChange: (value: string) => void;
};

export default function InventoryStockSummary({
  summary,
  activeStock,
  onStockChange,
}: InventoryStockSummaryProps) {
  return (
    <div className="grid w-full grid-cols-3 gap-3">
      {STOCK_ITEMS.map((item) => {
        // "optimal" y "ok" son el mismo filtro: el combobox usa uno y la URL
        // puede traer el otro de un enlace antiguo.
        const isActive =
          activeStock === item.filterValue ||
          (item.key === "optimal" && activeStock === "optimal");

        return (
          <InventoryStockSummaryItem
            key={item.key}
            icon={item.icon}
            label={item.label}
            value={summary[item.key]}
            tone={item.tone}
            isActive={isActive}
            testId={item.testId}
            // Un segundo clic sobre el activo quita el filtro.
            onToggle={() => onStockChange(isActive ? "" : item.filterValue)}
          />
        );
      })}
    </div>
  );
}
