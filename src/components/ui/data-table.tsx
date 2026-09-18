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
import Link from "next/link";
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

const rowPrimaryControlClassName =
  "block w-full rounded-sm text-left outline-none focus-visible:ring-2 focus-visible:ring-primary";

type DataTableProps<TData, TValue> = {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  emptyMessage?: string;
  enablePagination?: boolean;
  enableSorting?: boolean;
  initialSorting?: SortingState;
  getRowHref?: (row: TData) => string | undefined;
  onRowActivate?: (row: TData) => void;
  getRowStyle?: (row: TData) => CSSProperties | undefined;
  pageSize?: number;
  manualPagination?: {
    pageIndex: number;
    pageSize: number;
    total: number;
    onPageChange: (pageIndex: number) => void;
  };
  mobileColumns?: MobileCardColumn<TData>[];
  mobileActions?: MobileCardAction<TData>[];
  renderMobileActions?: (row: TData) => ReactNode;
  getMobileRowKey?: (row: TData, index: number) => string;
};

function wrapPrimaryCellContent<TData>(
  content: ReactNode,
  row: TData,
  getRowHref: DataTableProps<TData, unknown>["getRowHref"],
  onRowActivate: DataTableProps<TData, unknown>["onRowActivate"],
) {
  const href = getRowHref?.(row);
  if (href) {
    return (
      <Link href={href} className={rowPrimaryControlClassName}>
        {content}
      </Link>
    );
  }

  if (!onRowActivate) {
    return content;
  }

  return (
    <button
      type="button"
      onClick={() => onRowActivate(row)}
      className={rowPrimaryControlClassName}
    >
      {content}
    </button>
  );
}

export function DataTable<TData, TValue>({
  columns,
  data,
  emptyMessage = "No hay resultados.",
  enablePagination = false,
  enableSorting = false,
  initialSorting = EMPTY_SORTING,
  getRowHref,
  onRowActivate,
  getRowStyle,
  pageSize = 10,
  manualPagination,
  mobileColumns,
  mobileActions,
  renderMobileActions,
  getMobileRowKey,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>(initialSorting);
  const rowInteractive = Boolean(getRowHref ?? onRowActivate);

  const table = useReactTable({
    columns,
    data,
    getCoreRowModel: getCoreRowModel(),
    enableSorting,
    ...(enableSorting
      ? {
          getSortedRowModel: getSortedRowModel(),
          onSortingChange: setSorting,
          state: { sorting },
        }
      : {}),
    ...(manualPagination
      ? {
          manualPagination: true,
          rowCount: manualPagination.total,
          state: {
            ...(enableSorting ? { sorting } : {}),
            pagination: {
              pageIndex: manualPagination.pageIndex,
              pageSize: manualPagination.pageSize,
            },
          },
        }
      : enablePagination
        ? {
            getPaginationRowModel: getPaginationRowModel(),
            initialState: { pagination: { pageSize } },
          }
        : {}),
  });

  const totalRows = manualPagination
    ? manualPagination.total
    : table.getFilteredRowModel().rows.length;
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
            getRowHref={getRowHref}
            onRowActivate={onRowActivate}
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
                    className={`h-auto border-0 bg-transparent px-3.5 pb-2.5 pt-3.5${
                      header.column.id === "actions" ? " text-center" : ""
                    }`}
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
                    rowInteractive
                      ? "table-row-wash"
                      : "hover:bg-transparent"
                  }
                  style={getRowStyle?.(row.original)}
                >
                  {row.getVisibleCells().map((cell, cellIndex) => {
                    const cellContent = flexRender(
                      cell.column.columnDef.cell,
                      cell.getContext(),
                    );

                    return (
                      <TableCell
                        key={cell.id}
                        className={`px-3.5 py-3.5 text-sm${
                          cell.column.id === "actions" ? " text-center" : ""
                        }`}
                      >
                        {cellIndex === 0
                          ? wrapPrimaryCellContent(
                              cellContent,
                              row.original,
                              getRowHref,
                              onRowActivate,
                            )
                          : cellContent}
                      </TableCell>
                    );
                  })}
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
      {enablePagination || manualPagination ? (
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
              onClick={() =>
                manualPagination
                  ? manualPagination.onPageChange(
                      manualPagination.pageIndex - 1,
                    )
                  : table.previousPage()
              }
            >
              Anterior
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={!table.getCanNextPage()}
              onClick={() =>
                manualPagination
                  ? manualPagination.onPageChange(
                      manualPagination.pageIndex + 1,
                    )
                  : table.nextPage()
              }
            >
              Siguiente
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
