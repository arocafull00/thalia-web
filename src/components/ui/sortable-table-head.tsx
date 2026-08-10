"use client";

import type { Column } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";

import { Button } from "@/components/ui/button";

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
    <Button
      type="button"
      variant="link"
      className={`inline-flex h-auto items-center p-0 text-[10px] uppercase tracking-[0.14em] text-ink-muted no-underline hover:text-ink-secondary hover:no-underline ${className ?? ""}`}
      onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
    >
      {title}
      <ArrowUpDown className="ml-1 size-3" />
    </Button>
  );
}
