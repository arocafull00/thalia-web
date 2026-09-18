import { useCallback, useMemo } from "react";

import type { FinancesTabValue } from "@/components/finances/finances-tab-bar";
import { TRANSACTIONS_PAGE_SIZE } from "@/lib/finances-pagination";
import {
  financesMonthRange,
  parseFinancesMonthParam,
} from "@/lib/finances-summary";
import { useAuth } from "@/lib/hooks/use-auth";
import {
  useFinancialSummary,
  useTransactionsPage,
} from "@/lib/hooks/use-finances";
import { useServerSeed } from "@/lib/hooks/use-server-seed";
import { useTransactionCategories } from "@/lib/hooks/use-transaction-categories";
import {
  summaryKey,
  type FinancialSummary,
  type TransactionsPageQuery,
} from "@/stores/finances-store";
import type {
  Transaction,
  TransactionCategory,
  TransactionType,
} from "@/types/database.types";

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
  page: number;
  tab: FinancesTabValue;
};

type FinancesPageSeed = {
  initialTransactions?: Transaction[];
  initialTotal?: number;
  initialQuery?: TransactionsPageQuery;
  initialCategories?: TransactionCategory[];
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
  const range = useMemo(() => financesMonthRange(month), [month]);

  const query = useMemo<TransactionsPageQuery>(
    () => ({
      from: range.from,
      to: range.to,
      type: transactionTypeForTab(tab),
      categoryId: filters.category,
      search: filters.search,
      page: filters.page,
      pageSize: TRANSACTIONS_PAGE_SIZE,
    }),
    [filters.category, filters.page, filters.search, range.from, range.to, tab],
  );

  const page = useTransactionsPage(query, {
    initialTransactions: seed?.initialTransactions,
    initialTotal: seed?.initialTotal,
    initialQuery: seed?.initialQuery,
  });

  const { categories } = useTransactionCategories(seed?.initialCategories);
  const categoryOptions = useMemo(
    () =>
      categories.filter(
        (category) => tab === "summary" || category.type === tab,
      ),
    [categories, tab],
  );

  const summaryKeyValue = summaryKey(month, filters.category);
  const seededSummary = useServerSeed(
    summaryKeyValue,
    seed?.initialSummaryKey ?? "",
    seed?.initialSummary,
  );
  const summary = useFinancialSummary(month, filters.category, seededSummary);

  // El desglose por categoría se calcula ahora en el resumen, sobre el mes
  // completo. Antes salía del array de transacciones, que ya sólo es la página.
  const categoryBreakdown = useMemo(
    () => summary.data?.breakdown ?? [],
    [summary.data],
  );

  const fabType: TransactionType = tab === "expense" ? "expense" : "income";
  const isAdmin = profile?.role === "admin";
  const listData = page.isLoading ? [] : page.transactions;

  const refresh = useCallback(() => page.refresh(), [page]);

  return {
    categoryBreakdown,
    categoryOptions,
    categories,
    fabType,
    isAdmin,
    listData,
    month,
    profile,
    refresh,
    summary,
    tab,
    total: page.total,
    transactions: page,
  };
}
