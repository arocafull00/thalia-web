"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Eye, Pencil, Trash2 } from "lucide-react";

import { TREATMENTS_COPY } from "@/components/treatments/treatments-copy";
import ListRowActions from "@/components/ui/list-row-actions";
import type { ProfileAction } from "@/components/ui/profile/profile-action";
import SortableTableHead from "@/components/ui/sortable-table-head";
import { formatCurrency } from "@/lib/format";
import type { TreatmentWithInventory } from "@/types/database.types";

export type TreatmentListActionHandlers = {
  onDelete: (id: string) => void;
  onEdit: (id: string) => void;
};

export function getTreatmentRowActions(
  treatment: TreatmentWithInventory,
  handlers: TreatmentListActionHandlers,
): ProfileAction[] {
  return [
    {
      label: TREATMENTS_COPY.row.view,
      icon: Eye,
      href: `/treatments/${treatment.id}`,
    },
    {
      label: TREATMENTS_COPY.row.edit,
      icon: Pencil,
      onClick: () => handlers.onEdit(treatment.id),
    },
    {
      label: TREATMENTS_COPY.row.delete,
      icon: Trash2,
      onClick: () => handlers.onDelete(treatment.id),
      variant: "danger",
    },
  ];
}

export function getTreatmentsColumns(
  handlers: TreatmentListActionHandlers,
): ColumnDef<TreatmentWithInventory>[] {
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
      header: () => TREATMENTS_COPY.row.actions,
      cell: ({ row }) => (
        <ListRowActions
          actions={getTreatmentRowActions(row.original, handlers)}
          label={TREATMENTS_COPY.row.actionsLabel}
        />
      ),
      enableSorting: false,
    },
  ];
}
