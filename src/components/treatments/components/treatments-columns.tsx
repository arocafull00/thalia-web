"use client";

import type { ColumnDef } from "@tanstack/react-table";

import TreatmentRowActions from "@/components/treatments/components/treatment-row-actions";
import { TREATMENTS_COPY } from "@/components/treatments/treatments-copy";
import SortableTableHead from "@/components/ui/sortable-table-head";
import { formatCurrency } from "@/lib/format";
import type { TreatmentWithInventory } from "@/types/database.types";

type GetTreatmentsColumnsParams = {
  onEdit: (treatment: TreatmentWithInventory) => void;
  onDelete: (treatment: TreatmentWithInventory) => void;
};

export function getTreatmentsColumns({
  onEdit,
  onDelete,
}: GetTreatmentsColumnsParams): ColumnDef<TreatmentWithInventory>[] {
  return [
    {
      accessorKey: "name",
      header: ({ column }) => (
        <SortableTableHead column={column} title="Tratamiento" />
      ),
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <span
            className={`inline-block size-3.5 shrink-0 rounded-full border border-border ${row.original.color ? "" : "bg-border"}`}
            style={
              row.original.color
                ? { backgroundColor: row.original.color }
                : undefined
            }
            aria-hidden="true"
          />
          <span className="truncate font-medium text-ink">
            {row.original.name}
          </span>
        </div>
      ),
    },
    {
      accessorKey: "category",
      header: ({ column }) => (
        <SortableTableHead column={column} title="Categoría" />
      ),
      cell: ({ row }) => (
        <span className="truncate text-sm text-ink-secondary">
          {row.original.category ?? "-"}
        </span>
      ),
      sortingFn: (left, right) => {
        const leftCategory = (left.original.category ?? "").toLowerCase();
        const rightCategory = (right.original.category ?? "").toLowerCase();
        return leftCategory.localeCompare(rightCategory, "es");
      },
    },
    {
      accessorKey: "duration_minutes",
      header: ({ column }) => (
        <SortableTableHead column={column} title="Duración" />
      ),
      cell: ({ row }) => (
        <span className="text-sm tabular-nums text-ink-secondary">
          {row.original.duration_minutes ?? 30} {TREATMENTS_COPY.row.duration}
        </span>
      ),
    },
    {
      accessorKey: "price",
      header: ({ column }) => (
        <SortableTableHead column={column} title="Precio" />
      ),
      cell: ({ row }) =>
        row.original.price != null ? (
          <span className="text-sm tabular-nums text-ink">
            {formatCurrency(row.original.price)}
          </span>
        ) : (
          <span className="text-sm text-ink-secondary">-</span>
        ),
    },
    {
      id: "materials",
      accessorFn: (row) => row.treatment_inventory_items.length,
      header: ({ column }) => (
        <SortableTableHead column={column} title="Materiales" />
      ),
      cell: ({ row }) => {
        const materialCount = row.original.treatment_inventory_items.length;
        return (
          <span className="text-sm text-ink-secondary">
            {materialCount > 0
              ? `${materialCount} ${TREATMENTS_COPY.row.materials}`
              : TREATMENTS_COPY.row.noMaterials}
          </span>
        );
      },
    },
    {
      id: "actions",
      header: () => null,
      cell: ({ row }) => (
        <TreatmentRowActions
          treatment={row.original}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ),
    },
  ];
}
