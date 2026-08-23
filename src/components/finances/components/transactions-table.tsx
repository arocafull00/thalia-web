"use client";

import { transactionsColumns } from "@/components/finances/components/transactions-columns";
import { DataTable } from "@/components/ui/data-table";
import { transactionsMobileColumns } from "@/lib/table-mobile-columns";
import type { Transaction } from "@/types/database.types";

type TransactionsTableProps = {
  transactions: Transaction[];
  onRowClick: (id: string) => void;
  /** Paginación en servidor: `transactions` es ya la página visible. */
  pagination?: {
    pageIndex: number;
    pageSize: number;
    total: number;
    onPageChange: (pageIndex: number) => void;
  };
};

export default function TransactionsTable({
  transactions,
  onRowClick,
  pagination,
}: TransactionsTableProps) {
  return (
    <DataTable
      columns={transactionsColumns}
      data={transactions}
      manualPagination={pagination}
      mobileColumns={transactionsMobileColumns}
      onRowClick={(transaction) => onRowClick(transaction.id)}
    />
  );
}
