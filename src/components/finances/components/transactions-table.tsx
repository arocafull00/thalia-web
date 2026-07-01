"use client";

import { transactionsColumns } from "@/components/finances/components/transactions-columns";
import { DataTable } from "@/components/ui/data-table";
import type { Transaction } from "@/types/database.types";

type TransactionsTableProps = {
  transactions: Transaction[];
};

export default function TransactionsTable({
  transactions,
}: TransactionsTableProps) {
  return (
    <DataTable
      columns={transactionsColumns}
      data={transactions}
      enableSorting
    />
  );
}
