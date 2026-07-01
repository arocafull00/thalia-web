"use client";

import type { ColumnDef } from "@tanstack/react-table";

import SortableTableHead from "@/components/ui/sortable-table-head";
import { formatCurrency, transactionTypeLabel } from "@/lib/format";
import type { Transaction } from "@/types/database.types";

export const transactionsColumns: ColumnDef<Transaction>[] = [
  {
    accessorKey: "date",
    header: ({ column }) => <SortableTableHead column={column} title="Fecha" />,
    cell: ({ row }) => (
      <span className="text-ink-secondary">{row.getValue("date") ?? "-"}</span>
    ),
    sortingFn: (left, right) => {
      const leftDate = left.original.date ?? "";
      const rightDate = right.original.date ?? "";
      return leftDate.localeCompare(rightDate);
    },
  },
  {
    accessorKey: "category",
    header: ({ column }) => (
      <SortableTableHead column={column} title="Categoria" />
    ),
    cell: ({ row }) => (
      <span className="font-medium text-ink">
        {row.getValue("category") ?? "Sin categoria"}
      </span>
    ),
    sortingFn: (left, right) => {
      const leftCategory = (left.original.category ?? "").toLowerCase();
      const rightCategory = (right.original.category ?? "").toLowerCase();
      return leftCategory.localeCompare(rightCategory, "es");
    },
  },
  {
    accessorKey: "description",
    header: ({ column }) => (
      <SortableTableHead column={column} title="Descripcion" />
    ),
    cell: ({ row }) => (
      <span className="truncate text-ink-secondary">
        {row.getValue("description") ?? "-"}
      </span>
    ),
    sortingFn: (left, right) => {
      const leftDescription = (left.original.description ?? "").toLowerCase();
      const rightDescription = (right.original.description ?? "").toLowerCase();
      return leftDescription.localeCompare(rightDescription, "es");
    },
  },
  {
    accessorKey: "type",
    header: ({ column }) => <SortableTableHead column={column} title="Tipo" />,
    cell: ({ row }) => (
      <span className="text-xs uppercase tracking-wide text-ink-secondary">
        {transactionTypeLabel(row.original.type)}
      </span>
    ),
    sortingFn: (left, right) => {
      const leftType = transactionTypeLabel(left.original.type);
      const rightType = transactionTypeLabel(right.original.type);
      return leftType.localeCompare(rightType, "es");
    },
  },
  {
    accessorKey: "amount",
    header: ({ column }) => (
      <SortableTableHead column={column} title="Importe" className="ml-auto" />
    ),
    cell: ({ row }) => (
      <span
        className={`block text-right font-medium tabular-nums ${
          row.original.type === "income" ? "text-success" : "text-danger"
        }`}
      >
        {row.original.type === "income" ? "+" : "-"}
        {formatCurrency(row.original.amount)}
      </span>
    ),
  },
];
