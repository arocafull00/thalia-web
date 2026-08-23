import FinancesPageClient from "@/components/finances/finances-page-client";
import {
  getTransactionCategories,
  getTransactions,
  getTransactionsPage,
} from "@/dal/finances.server.dal";
import { TRANSACTIONS_PAGE_SIZE } from "@/lib/finances-pagination";
import {
  buildFinancialSummary,
  financesMonthRange,
  financesPreviousMonthRange,
  formatFinancesMonthParam,
  parseFinancesMonthParam,
} from "@/lib/finances-summary";
import { parseFinancesTabParam } from "@/lib/finances-url";
import { getServerActiveClinicId } from "@/lib/server/active-clinic";
import { summaryKey } from "@/stores/finances-store";
import type { TransactionType } from "@/types/database.types";

function transactionTypeForTab(
  tab: ReturnType<typeof parseFinancesTabParam>,
): TransactionType | "all" {
  if (tab === "summary") {
    return "all";
  }

  return tab;
}

export default async function FinancesPage({
  searchParams,
}: {
  searchParams: Promise<{
    category?: string;
    month?: string;
    page?: string;
    q?: string;
    tab?: string;
  }>;
}) {
  const [params, clinicId] = await Promise.all([
    searchParams,
    getServerActiveClinicId(),
  ]);
  const month = parseFinancesMonthParam(params.month);
  const tab = parseFinancesTabParam(params.tab);
  const currentRange = financesMonthRange(month);
  const previousRange = financesPreviousMonthRange(month);

  // Se siembra la consulta tal y como viene en la URL. Si no coincide con la
  // que calcula el cliente, `useServerSeed` la descarta y refetchea; sembrar
  // una página distinta de la que se va a mostrar sería peor que no sembrar.
  const query = {
    from: currentRange.from,
    to: currentRange.to,
    type: transactionTypeForTab(tab),
    category: params.category?.trim() ?? "",
    search: params.q?.trim() ?? "",
    page: Math.max(0, Number.parseInt(params.page ?? "", 10) || 0),
    pageSize: TRANSACTIONS_PAGE_SIZE,
  };

  // El resumen y el desglose por categoría se calculan sobre el mes entero, no
  // sobre la página: por eso siguen pidiendo todas las transacciones del mes.
  const [page, categories, currentAll, previousAll] = await Promise.all([
    getTransactionsPage({ ...query, clinicId }),
    getTransactionCategories(clinicId, currentRange.from, currentRange.to),
    getTransactions(currentRange.from, currentRange.to, "all"),
    getTransactions(previousRange.from, previousRange.to, "all"),
  ]);
  const summary = buildFinancialSummary(currentAll, previousAll);

  return (
    <FinancesPageClient
      initialMonth={formatFinancesMonthParam(month)}
      initialTab={tab}
      initialTransactions={page.transactions}
      initialTotal={page.total}
      initialQuery={query}
      initialCategories={categories}
      initialSummary={summary}
      initialSummaryKey={summaryKey(month)}
    />
  );
}
