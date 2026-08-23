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
  useTransactionCategories,
  useTransactionsPage,
} from "@/lib/hooks/use-finances";
import { useServerSeed } from "@/lib/hooks/use-server-seed";
import {
  summaryKey,
  type FinancialSummary,
  type TransactionsPageQuery,
} from "@/stores/finances-store";
import type { Transaction, TransactionType } from "@/types/database.types";

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
  initialCategories?: string[];
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
      category: filters.category,
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

  // Las categorías no dependen de la página ni del filtro: se piden una vez
  // por mes. Derivarlas de las 20 filas visibles dejaría fuera las demás y no
  // habría forma de filtrar por ellas.
  const categoryOptions = useTransactionCategories(
    range.from,
    range.to,
    seed?.initialCategories,
  );

  const summaryKeyValue = summaryKey(month);
  const seededSummary = useServerSeed(
    summaryKeyValue,
    seed?.initialSummaryKey ?? "",
    seed?.initialSummary,
  );
  const summary = useFinancialSummary(month, seededSummary);

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
