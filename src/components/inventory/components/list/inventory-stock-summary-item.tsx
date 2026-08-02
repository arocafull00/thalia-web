"use client";

import type { LucideIcon } from "lucide-react";

import { INVENTORY_COPY } from "@/copy/inventory-copy";

type StockTone = "danger" | "warning" | "success";

type InventoryStockSummaryItemProps = {
  icon: LucideIcon;
  label: string;
  value: number;
  tone: StockTone;
  isActive: boolean;
  testId: string;
  onToggle: () => void;
};

// text-* apunta al color legible del token (--danger-text) y bg-*-subtle al
// tinte pálido: son las dos mitades del mismo par que usa Badge.
const toneText: Record<StockTone, string> = {
  danger: "text-danger",
  warning: "text-warning",
  success: "text-success",
};

const toneChip: Record<StockTone, string> = {
  danger: "bg-danger-subtle",
  warning: "bg-warning-subtle",
  success: "bg-success-subtle",
};

const toneActive: Record<StockTone, string> = {
  danger: "border-danger bg-danger-subtle",
  warning: "border-warning bg-warning-subtle",
  success: "border-success bg-success-subtle",
};

export default function InventoryStockSummaryItem({
  icon: Icon,
  label,
  value,
  tone,
  isActive,
  testId,
  onToggle,
}: InventoryStockSummaryItemProps) {
  return (
    <button
      type="button"
      data-testid={testId}
      aria-pressed={isActive}
      aria-label={
        isActive
          ? INVENTORY_COPY.summary.clearFilter(label)
          : INVENTORY_COPY.summary.filterBy(label)
      }
      onClick={onToggle}
      // Plana en reposo, como el resto de superficies de la app: el estado
      // activo se marca con el tinte del propio tono, no con sombra.
      className={`rounded-card border p-4 text-left outline-none ring-primary transition-colors focus-visible:ring-2 ${
        isActive ? toneActive[tone] : "border-primary bg-surface"
      }`}
    >
      {/* Icono y cifra en la misma línea: el icono acompaña al número en lugar
          de flotar sobre la tarjeta.
          El icono va sobre su fondo tenue, el mismo par que usa Badge: el color
          es idéntico, pero suelto sobre blanco se lee mucho más apagado. */}
      <div className={`flex items-center gap-2.5 ${toneText[tone]}`}>
        <span
          className={`flex size-8 shrink-0 items-center justify-center rounded-full ${toneChip[tone]}`}
        >
          <Icon className="size-5" strokeWidth={1.5} aria-hidden="true" />
        </span>
        <span className="text-3xl font-medium tabular-nums">{value}</span>
      </div>
      <p className="mt-2 text-base text-ink-secondary">{label}</p>
    </button>
  );
}
