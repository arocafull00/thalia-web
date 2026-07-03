import FinancesCategoryRow from "@/components/finances/components/finances-category-row";
import { FINANCES_COPY } from "@/copy/finances-copy";

type CategoryBreakdownItem = {
  category: string;
  percent: number;
};

type FinancesCategoryBreakdownProps = {
  items: CategoryBreakdownItem[];
};

export default function FinancesCategoryBreakdown({
  items,
}: FinancesCategoryBreakdownProps) {
  return (
    <div>
      <h3 className="border-b border-border-subtle pb-4 text-lg font-medium text-ink">
        {FINANCES_COPY.categories.title}
      </h3>
      {items.length === 0 ? (
        <p className="py-8 text-sm text-ink-secondary">
          {FINANCES_COPY.categories.empty}
        </p>
      ) : (
        <div className="divide-y divide-border-subtle">
          {items.map((item) => (
            <FinancesCategoryRow
              key={item.category}
              category={item.category}
              percent={item.percent}
            />
          ))}
        </div>
      )}
    </div>
  );
}
