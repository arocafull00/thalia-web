import FinancesWeeklyRow from "@/components/finances/components/finances-weekly-row";
import { FINANCES_COPY } from "@/copy/finances-copy";
import type { FinancialSummary } from "@/stores/finances-store";

type FinancesWeeklyBreakdownProps = {
  weekly: FinancialSummary["weekly"];
};

export default function FinancesWeeklyBreakdown({
  weekly,
}: FinancesWeeklyBreakdownProps) {
  return (
    <div>
      <h3 className="border-b border-border-subtle pb-4 text-lg font-medium text-ink">
        {FINANCES_COPY.weekly.title}
      </h3>
      <div className="divide-y divide-border-subtle">
        {weekly.map((week) => (
          <FinancesWeeklyRow
            key={week.week}
            week={week.week}
            income={week.income}
            expenses={week.expenses}
          />
        ))}
      </div>
    </div>
  );
}
