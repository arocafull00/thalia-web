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
import { type CSSProperties, type ReactNode, useState } from "react";

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

const EMPTY_SORTING: SortingState = [];

type DataTableProps<TData, TValue> = {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  emptyMessage?: string;
  enablePagination?: boolean;
  enableSorting?: boolean;
  initialSorting?: SortingState;
  onRowClick?: (row: TData) => void;
  /** Estilo por fila; lo usa la pantalla de citas para tintar el barrido con --glow. */
  getRowStyle?: (row: TData) => CSSProperties | undefined;
  pageSize?: number;
  mobileColumns?: MobileCardColumn<TData>[];
  mobileActions?: MobileCardAction<TData>[];
  renderMobileActions?: (row: TData) => ReactNode;
  getMobileRowKey?: (row: TData, index: number) => string;
};

export function DataTable<TData, TValue>({
  columns,
  data,
  emptyMessage = "No hay resultados.",
  enablePagination = false,
  enableSorting = false,
  initialSorting = EMPTY_SORTING,
  onRowClick,
  getRowStyle,
  pageSize = 10,
  mobileColumns,
  mobileActions,
  renderMobileActions,
  getMobileRowKey,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>(initialSorting);

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
            renderActions={renderMobileActions}
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
              <TableRow
                key={headerGroup.id}
                className="border-b border-border hover:bg-transparent"
              >
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className="h-auto border-0 bg-transparent px-3.5 pb-2.5 pt-3.5"
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
                      ? "table-row-wash cursor-pointer"
                      : "hover:bg-transparent"
                  }
                  style={getRowStyle?.(row.original)}
                  onClick={
                    onRowClick ? () => onRowClick(row.original) : undefined
                  }
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="px-3.5 py-3.5 text-sm">
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
