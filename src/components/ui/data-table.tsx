"use client";

import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { useState } from "react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type DataTableProps<TData, TValue> = {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  emptyMessage?: string;
  enablePagination?: boolean;
  enableSorting?: boolean;
  onRowClick?: (row: TData) => void;
  pageSize?: number;
};

export function DataTable<TData, TValue>({
  columns,
  data,
  emptyMessage = "No hay resultados.",
  enablePagination = false,
  enableSorting = false,
  onRowClick,
  pageSize = 10,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);

  const table = useReactTable({
    columns,
    data,
    getCoreRowModel: getCoreRowModel(),
    ...(enableSorting
      ? {
          getSortedRowModel: getSortedRowModel(),
          onSortingChange: setSorting,
          state: { sorting },
        }
      : {}),
    ...(enablePagination
      ? {
          getPaginationRowModel: getPaginationRowModel(),
          initialState: { pagination: { pageSize } },
        }
      : {}),
  });

  const totalRows = table.getFilteredRowModel().rows.length;
  const pagination = table.getState().pagination;
  const pageStart =
    totalRows === 0 ? 0 : pagination.pageIndex * pagination.pageSize + 1;
  const pageEnd = Math.min(
    (pagination.pageIndex + 1) * pagination.pageSize,
    totalRows,
  );

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow
              key={headerGroup.id}
              className="border-border hover:bg-transparent"
            >
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id} className="px-4 py-2">
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                className={
                  onRowClick
                    ? "cursor-pointer border-border-subtle hover:bg-canvas"
                    : "border-border-subtle hover:bg-transparent"
                }
                onClick={
                  onRowClick ? () => onRowClick(row.original) : undefined
                }
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id} className="px-4 py-4">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow className="hover:bg-transparent">
              <TableCell
                colSpan={columns.length}
                className="px-4 py-6 text-center text-ink-secondary"
              >
                {emptyMessage}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      {enablePagination ? (
        <div className="flex items-center justify-between px-4 py-3 text-sm text-ink-secondary">
          <span>
            {totalRows === 0 ? 0 : pageStart}-{pageEnd} de {totalRows}
          </span>
          <div className="flex gap-2">
            <button
              type="button"
              disabled={!table.getCanPreviousPage()}
              onClick={() => table.previousPage()}
              className="rounded-lg border border-border px-3 py-1 disabled:opacity-40"
            >
              Anterior
            </button>
            <button
              type="button"
              disabled={!table.getCanNextPage()}
              onClick={() => table.nextPage()}
              className="rounded-lg border border-border px-3 py-1 disabled:opacity-40"
            >
              Siguiente
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
