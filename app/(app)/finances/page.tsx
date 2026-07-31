import FinancesPageClient from "@/components/finances/finances-page-client";
import { getTransactions } from "@/dal/finances.server.dal";
import {
  buildFinancialSummary,
  financesMonthRange,
  financesPreviousMonthRange,
  formatFinancesMonthParam,
  parseFinancesMonthParam,
} from "@/lib/finances-summary";
import { parseFinancesTabParam } from "@/lib/finances-url";
import { summaryKey, transactionsKey } from "@/stores/finances-store";
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
  searchParams: Promise<{ month?: string; tab?: string }>;
}) {
  const params = await searchParams;
  const month = parseFinancesMonthParam(params.month);
  const tab = parseFinancesTabParam(params.tab);
  const transactionType = transactionTypeForTab(tab);
  const currentRange = financesMonthRange(month);
  const previousRange = financesPreviousMonthRange(month);

  const transactionsPromise = getTransactions(
    currentRange.from,
    currentRange.to,
    transactionType,
  );
  const currentAllPromise =
    transactionType === "all"
      ? transactionsPromise
      : getTransactions(currentRange.from, currentRange.to, "all");
  const [transactions, currentAll, previousAll] = await Promise.all([
    transactionsPromise,
    currentAllPromise,
    getTransactions(previousRange.from, previousRange.to, "all"),
  ]);
  const summary = buildFinancialSummary(currentAll, previousAll);

  return (
    <FinancesPageClient
      initialMonth={formatFinancesMonthParam(month)}
      initialTab={tab}
      initialTransactions={transactions}
      initialTransactionsKey={transactionsKey(month, transactionType)}
      initialSummary={summary}
      initialSummaryKey={summaryKey(month)}
    />
  );
}
