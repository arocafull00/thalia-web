"use client";

import { transactionsColumns } from "@/components/finances/components/transactions-columns";
import { DataTable } from "@/components/ui/data-table";
import { transactionsMobileColumns } from "@/lib/table-mobile-columns";
import type { Transaction } from "@/types/database.types";

type TransactionsTableProps = {
  transactions: Transaction[];
  onRowClick: (id: string) => void;
};

export default function TransactionsTable({
  transactions,
  onRowClick,
}: TransactionsTableProps) {
  return (
    <DataTable
      columns={transactionsColumns}
      data={transactions}
      enableSorting
      mobileColumns={transactionsMobileColumns}
      onRowClick={(transaction) => onRowClick(transaction.id)}
    />
  );
}
