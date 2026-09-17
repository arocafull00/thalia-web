import TransactionsTable from "@/components/finances/components/transactions-table";
import FinancesTabBar, {
  type FinancesTabValue,
} from "@/components/finances/finances-tab-bar";
import { Notice } from "@/components/ui/primitives/notice";
import { SkeletonList } from "@/components/ui/primitives/skeleton-list";
import { Tabs } from "@/components/ui/tabs";
import { FINANCES_COPY } from "@/copy/finances-copy";
import type { Transaction } from "@/types/database.types";

type FinancesMovementsSectionProps = {
  tab: FinancesTabValue;
  onTabChange: (tab: FinancesTabValue) => void;
  transactions: Transaction[];
  isLoading: boolean;
  error: Error | null | undefined;
  onRowActivate: (id: string) => void;
  pagination: {
    pageIndex: number;
    pageSize: number;
    total: number;
    onPageChange: (pageIndex: number) => void;
  };
};

export default function FinancesMovementsSection({
  tab,
  onTabChange,
  transactions,
  isLoading,
  error,
  onRowActivate,
  pagination,
}: FinancesMovementsSectionProps) {
  return (
    <div className="border-t border-border-subtle pt-6">
      <Tabs
        value={tab}
        onValueChange={(value) => onTabChange(value as FinancesTabValue)}
      >
        <div className="flex items-center justify-between border-b border-border-subtle pb-4">
          <h3 className="text-lg font-medium text-ink">
            {FINANCES_COPY.movements.title}
          </h3>
          <FinancesTabBar />
        </div>
        <div className="pt-6">
          {isLoading ? <SkeletonList count={3} /> : null}
          {error ? (
            <Notice tone="danger" message={FINANCES_COPY.errors.transactions} />
          ) : null}
          {!isLoading ? (
            <TransactionsTable
              transactions={transactions}
              onRowActivate={onRowActivate}
              pagination={pagination}
            />
          ) : null}
        </div>
      </Tabs>
    </div>
  );
}
