"use client";

import type { ColumnDef } from "@tanstack/react-table";

import SortableTableHead from "@/components/ui/sortable-table-head";
import {
  getInventoryStockLevel,
  inventoryStockLevelLabel,
} from "@/lib/inventory-stock";
import type { InventoryItem } from "@/types/database.types";

export const inventoryColumns: ColumnDef<InventoryItem>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <SortableTableHead column={column} title="Material" />
    ),
    cell: ({ row }) => (
      <span>
        <span className="block truncate font-medium text-ink">
          {row.original.name}
        </span>
        <span className="text-xs text-ink-muted">
          REF: {row.original.id.slice(0, 8).toUpperCase()}
        </span>
      </span>
    ),
  },
  {
    accessorKey: "category",
    header: ({ column }) => (
      <SortableTableHead column={column} title="Categoria" />
    ),
    cell: ({ row }) => (
      <span className="truncate text-sm text-ink-secondary">
        {row.original.category ?? "Sin categoria"}
      </span>
    ),
    sortingFn: (left, right) => {
      const leftCategory = (left.original.category ?? "").toLowerCase();
      const rightCategory = (right.original.category ?? "").toLowerCase();
      return leftCategory.localeCompare(rightCategory, "es");
    },
  },
  {
    accessorKey: "stock",
    header: ({ column }) => <SortableTableHead column={column} title="Stock" />,
    cell: ({ row }) => {
      const stock = Number(row.original.stock ?? 0);
      return (
        <span className="font-medium tabular-nums text-ink">
          {stock} {row.original.unit ?? "un."}
        </span>
      );
    },
  },
  {
    accessorKey: "min_stock",
    header: ({ column }) => (
      <SortableTableHead column={column} title="Minimo" />
    ),
    cell: ({ row }) => (
      <span className="text-sm tabular-nums text-ink-secondary">
        {Number(row.original.min_stock ?? 0)}
      </span>
    ),
  },
  {
    id: "level",
    accessorFn: (row) => {
      const stock = Number(row.stock ?? 0);
      const minStock = Number(row.min_stock ?? 0);
      return inventoryStockLevelLabel(getInventoryStockLevel(stock, minStock));
    },
    header: ({ column }) => (
      <SortableTableHead column={column} title="Estado" />
    ),
    cell: ({ row }) => {
      const stock = Number(row.original.stock ?? 0);
      const minStock = Number(row.original.min_stock ?? 0);
      const level = getInventoryStockLevel(stock, minStock);

      return (
        <span
          className={`text-xs uppercase tracking-wide ${
            level === "critical"
              ? "text-danger"
              : level === "low"
                ? "text-warning"
                : "text-success"
          }`}
        >
          {inventoryStockLevelLabel(level)}
        </span>
      );
    },
  },
];
