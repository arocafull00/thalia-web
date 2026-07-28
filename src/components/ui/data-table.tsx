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

import { Button } from "@/components/ui/button";
import MobileCardView, {
  type MobileCardAction,
  type MobileCardColumn,
} from "@/components/ui/mobile-card-view";
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
  mobileColumns?: MobileCardColumn<TData>[];
  mobileActions?: MobileCardAction<TData>[];
  getMobileRowKey?: (row: TData, index: number) => string;
};

export function DataTable<TData, TValue>({
  columns,
  data,
  emptyMessage = "No hay resultados.",
  enablePagination = false,
  enableSorting = false,
  onRowClick,
  pageSize = 10,
  mobileColumns,
  mobileActions,
  getMobileRowKey,
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
  const pageRows = table.getRowModel().rows.map((row) => row.original);
  const resolveMobileRowKey =
    getMobileRowKey ??
    ((row: TData, index: number) => {
      const candidate = (row as { id?: string }).id;
      return candidate ?? String(index);
    });

  return (
    <div className="w-full">
      {mobileColumns ? (
        <div className="md:hidden">
          <MobileCardView
            data={pageRows}
            columns={mobileColumns}
            actions={mobileActions}
            onRowClick={onRowClick}
            emptyMessage={emptyMessage}
            getRowKey={resolveMobileRowKey}
          />
        </div>
      ) : null}
      <div className={mobileColumns ? "hidden md:block" : undefined}>
        <Table className="border-separate border-spacing-0">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="hover:bg-transparent">
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className="border-y border-primary-light bg-primary-subtle px-4 first:rounded-l-[10px] first:border-l last:rounded-r-[10px] last:border-r"
                  >
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
          <TableBody className="[&_tr>td]:border-b [&_tr>td]:border-border-subtle [&_tr:last-child>td]:border-0">
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  className={
                    onRowClick
                      ? "cursor-pointer hover:bg-[var(--hover-overlay)]"
                      : "hover:bg-transparent"
                  }
                  onClick={
                    onRowClick ? () => onRowClick(row.original) : undefined
                  }
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="px-4 py-4">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
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
      </div>
      {enablePagination ? (
        <div className="flex items-center justify-between px-4 pt-4 text-sm text-ink-secondary">
          <span className="hidden md:inline">
            {totalRows === 0 ? 0 : pageStart}-{pageEnd} de {totalRows}
          </span>
          <span className="md:hidden">
            Página {totalRows === 0 ? 0 : pagination.pageIndex + 1}
          </span>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={!table.getCanPreviousPage()}
              onClick={() => table.previousPage()}
            >
              Anterior
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={!table.getCanNextPage()}
              onClick={() => table.nextPage()}
            >
              Siguiente
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
