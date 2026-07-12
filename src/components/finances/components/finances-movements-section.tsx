import TransactionsTable from "@/components/finances/components/transactions-table";
import FinancesTabBar, {
  type FinancesTabValue,
} from "@/components/finances/finances-tab-bar";
import { Button } from "@/components/ui/button";
import { Notice } from "@/components/ui/primitives/notice";
import { SkeletonList } from "@/components/ui/primitives/skeleton-list";
import { FINANCES_COPY } from "@/copy/finances-copy";
import type { Transaction } from "@/types/database.types";

type FinancesMovementsSectionProps = {
  tab: FinancesTabValue;
  onTabChange: (tab: FinancesTabValue) => void;
  transactions: Transaction[];
  isLoading: boolean;
  error: Error | null | undefined;
  hasMore: boolean;
  onLoadMore: () => void;
};

export default function FinancesMovementsSection({
  tab,
  onTabChange,
  transactions,
  isLoading,
  error,
  hasMore,
  onLoadMore,
}: FinancesMovementsSectionProps) {
  return (
    <div className="border-t border-border-subtle pt-6">
      <div className="flex items-center justify-between border-b border-border-subtle pb-4">
        <h3 className="text-lg font-medium text-ink">
          {FINANCES_COPY.movements.title}
        </h3>
        <FinancesTabBar selectedTab={tab} onTabChange={onTabChange} />
      </div>
      <div className="pt-6">
        {isLoading ? <SkeletonList count={3} /> : null}
        {error ? (
          <Notice tone="danger" message={FINANCES_COPY.errors.transactions} />
        ) : null}
        {!isLoading ? <TransactionsTable transactions={transactions} /> : null}
        {hasMore ? (
          <div className="mt-4 flex justify-center">
            <Button
              type="button"
              variant="outline"
              onClick={onLoadMore}
              className="rounded-full px-4 py-2 text-sm motion-reduce:transition-none"
            >
              {FINANCES_COPY.movements.loadMore}
            </Button>
          </div>
        ) : null}
      </div>
    </div>
  );
}
