import { useMemo } from "react";

import type { FinancesTabValue } from "@/components/finances/finances-tab-bar";
import { useAuth } from "@/lib/hooks/use-auth";
import { useFinancialSummary, useTransactions } from "@/lib/hooks/use-finances";
import { useFinancesUiStore } from "@/stores/finances-ui-store";
import type { TransactionType } from "@/types/database.types";

function transactionTypeForTab(tab: FinancesTabValue): TransactionType | "all" {
  if (tab === "summary") {
    return "all";
  }

  return tab;
}

export function useFinancesPage() {
  const { profile } = useAuth();
  const month = useFinancesUiStore((state) => state.month);
  const tab = useFinancesUiStore((state) => state.tab);
  const transactionType = transactionTypeForTab(tab);
  const transactions = useTransactions(month, transactionType);
  const summary = useFinancialSummary(month);

  const visibleTransactions = useMemo(() => {
    return (transactions.data ?? []).slice(0, 20);
  }, [transactions.data]);

  const categoryBreakdown = useMemo(() => {
    const totals = new Map<string, number>();
    const source = transactions.data ?? [];
    const total = source.reduce((sum, transaction) => sum + transaction.amount, 0);

    for (const transaction of source) {
      const category = transaction.category ?? "Sin categoria";
      totals.set(category, (totals.get(category) ?? 0) + transaction.amount);
    }

    return Array.from(totals.entries())
      .map(([category, amount]) => ({
        amount,
        category,
        percent: total > 0 ? Math.round((amount / total) * 100) : 0,
      }))
      .sort((left, right) => right.amount - left.amount)
      .slice(0, 4);
  }, [transactions.data]);

  const listData = transactions.isLoading ? [] : visibleTransactions;
  const fabType: TransactionType = tab === "expense" ? "expense" : "income";
  const isAdmin = profile?.role === "admin";

  return {
    categoryBreakdown,
    fabType,
    isAdmin,
    listData,
    month,
    profile,
    summary,
    tab,
    transactions,
    visibleTransactions,
  };
}
