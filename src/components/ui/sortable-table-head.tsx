"use client";

import type { Column } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";

type SortableTableHeadProps<TData> = {
  column: Column<TData, unknown>;
  title: string;
  className?: string;
};

export default function SortableTableHead<TData>({
  column,
  title,
  className,
}: SortableTableHeadProps<TData>) {
  return (
    <button
      type="button"
      className={`inline-flex items-center text-xs uppercase tracking-wide text-ink-muted transition hover:text-ink ${className ?? ""}`}
      onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
    >
      {title}
      <ArrowUpDown className="ml-1 size-3" />
    </button>
  );
}
