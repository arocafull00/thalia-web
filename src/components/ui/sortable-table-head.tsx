"use client";

import type { Column } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const HEAD_CLASS =
  "inline-flex items-center text-[10px] uppercase tracking-[0.14em] text-ink-muted";

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
  // En las tablas paginadas en servidor la ordenación está desactivada: ordenar
  // sólo las filas visibles daría una impresión falsa de orden global. Ahí la
  // cabecera es texto plano, no un botón con flecha que no hace nada.
  if (!column.getCanSort()) {
    return <span className={cn(HEAD_CLASS, className)}>{title}</span>;
  }

  return (
    <Button
      type="button"
      variant="link"
      className={cn(
        HEAD_CLASS,
        "h-auto p-0 no-underline hover:text-ink-secondary hover:no-underline",
        className,
      )}
      onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
    >
      {title}
      <ArrowUpDown className="ml-1 size-3" />
    </Button>
  );
}
