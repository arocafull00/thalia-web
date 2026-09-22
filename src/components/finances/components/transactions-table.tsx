"use client";

import { Eye } from "lucide-react";

import { transactionsColumns } from "@/components/finances/components/transactions-columns";
import { DataTable } from "@/components/ui/data-table";
import { PATIENTS_COPY } from "@/copy/patients-copy";
import { transactionsMobileColumns } from "@/lib/table-mobile-columns";
import type { Transaction } from "@/types/database.types";

type TransactionsTableProps = {
  transactions: Transaction[];
  onRowActivate: (id: string) => void;
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
  onRowActivate,
  pagination,
}: TransactionsTableProps) {
  return (
    <DataTable
      columns={transactionsColumns}
      data={transactions}
      manualPagination={pagination}
      mobileColumns={transactionsMobileColumns}
      onRowActivate={(transaction) => onRowActivate(transaction.id)}
      getRowActions={(transaction) => [
        {
          label: PATIENTS_COPY.list.actions.view,
          icon: Eye,
          onClick: () => onRowActivate(transaction.id),
        },
      ]}
    />
  );
}
