import { useMemo, useState } from "react";

import type { FinancesTabValue } from "@/components/finances/finances-tab-bar";
import { parseFinancesMonthParam } from "@/lib/finances-summary";
import { useAuth } from "@/lib/hooks/use-auth";
import { useFinancialSummary, useTransactions } from "@/lib/hooks/use-finances";
import { useServerSeed } from "@/lib/hooks/use-server-seed";
import type { FinancialSummary } from "@/stores/finances-store";
import { summaryKey, transactionsKey } from "@/stores/finances-store";
import type { Transaction, TransactionType } from "@/types/database.types";

const PAGE_SIZE = 20;

function transactionTypeForTab(tab: FinancesTabValue): TransactionType | "all" {
  if (tab === "summary") {
    return "all";
  }

  return tab;
}

type FinancesPageFilters = {
  category: string;
  search: string;
  month: string;
  tab: FinancesTabValue;
};

type FinancesPageSeed = {
  initialTransactions?: Transaction[];
  initialTransactionsKey?: string;
  initialSummary?: FinancialSummary;
  initialSummaryKey?: string;
};

export function useFinancesPage(
  filters: FinancesPageFilters,
  seed?: FinancesPageSeed,
) {
  const { profile } = useAuth();
  const month = useMemo(
    () => parseFinancesMonthParam(filters.month),
    [filters.month],
  );
  const tab = filters.tab;
  const transactionType = transactionTypeForTab(tab);
  const transactionsKeyValue = transactionsKey(month, transactionType);
  const summaryKeyValue = summaryKey(month);
  const seededTransactions = useServerSeed(
    transactionsKeyValue,
    seed?.initialTransactionsKey ?? "",
    seed?.initialTransactions,
  );
  const seededSummary = useServerSeed(
    summaryKeyValue,
    seed?.initialSummaryKey ?? "",
    seed?.initialSummary,
  );
  const transactions = useTransactions(
    month,
    transactionType,
    seededTransactions,
  );
  const summary = useFinancialSummary(month, seededSummary);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const filteredTransactions = useMemo(() => {
    const normalizedSearch = filters.search.trim().toLowerCase();
    const source = transactions.data ?? [];

    return source.filter((transaction) => {
      if (filters.category && transaction.category !== filters.category) {
        return false;
      }

      if (!normalizedSearch) {
        return true;
      }

      const description = transaction.description?.toLowerCase() ?? "";
      const category = transaction.category?.toLowerCase() ?? "";

      return (
        description.includes(normalizedSearch) ||
        category.includes(normalizedSearch)
      );
    });
  }, [filters.category, filters.search, transactions.data]);

  const visibleTransactions = useMemo(() => {
    return filteredTransactions.slice(0, visibleCount);
  }, [filteredTransactions, visibleCount]);

  const hasMore = filteredTransactions.length > visibleCount;

  const categoryOptions = useMemo(() => {
    const categories = [
      ...new Set(
        (transactions.data ?? [])
          .map((transaction) => transaction.category)
          .filter(Boolean),
      ),
    ] as string[];

    return categories.sort((left, right) => left.localeCompare(right, "es"));
  }, [transactions.data]);

  const categoryBreakdown = useMemo(() => {
    const totals = new Map<string, number>();
    const source = transactions.data ?? [];
    const total = source.reduce(
      (sum, transaction) => sum + transaction.amount,
      0,
    );

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

  const loadMore = () => {
    setVisibleCount((current) => current + PAGE_SIZE);
  };

  return {
    categoryBreakdown,
    categoryOptions,
    fabType,
    hasMore,
    isAdmin,
    listData,
    loadMore,
    month,
    profile,
    summary,
    tab,
    transactions,
    visibleTransactions,
  };
}
