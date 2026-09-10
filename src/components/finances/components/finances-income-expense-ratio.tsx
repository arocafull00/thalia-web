import { FINANCES_COPY } from "@/copy/finances-copy";
import { formatCurrency } from "@/lib/format";

type FinancesIncomeExpenseRatioProps = {
  income: number;
  expenses: number;
};

export default function FinancesIncomeExpenseRatio({
  income,
  expenses,
}: FinancesIncomeExpenseRatioProps) {
  const maximumAmount = Math.max(income, expenses);
  const incomeWidth = maximumAmount > 0 ? (income / maximumAmount) * 100 : 0;
  const expensesWidth =
    maximumAmount > 0 ? (expenses / maximumAmount) * 100 : 0;
  const expensesPercentage =
    income > 0 ? Math.round((expenses / income) * 100) : null;

  return (
    <div>
      <h3 className="border-b border-border-subtle pb-4 text-lg font-medium text-ink">
        {FINANCES_COPY.incomeExpenseRatio.title}
      </h3>
      {maximumAmount === 0 ? (
        <p className="py-8 text-sm text-ink-secondary">
          {FINANCES_COPY.incomeExpenseRatio.empty}
        </p>
      ) : (
        <div className="space-y-5 py-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between gap-3 text-sm">
              <span className="text-ink-secondary">
                {FINANCES_COPY.incomeExpenseRatio.income}
              </span>
              <span className="whitespace-nowrap font-medium tabular-nums text-success">
                {formatCurrency(income)}
              </span>
            </div>
            <div
              className="h-1.5 overflow-hidden rounded-full bg-border-subtle"
              aria-hidden="true"
            >
              <div
                className="h-full rounded-full bg-success"
                style={{ width: `${incomeWidth}%` }}
              />
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between gap-3 text-sm">
              <span className="text-ink-secondary">
                {FINANCES_COPY.incomeExpenseRatio.expenses}
              </span>
              <span className="whitespace-nowrap font-medium tabular-nums text-danger">
                {formatCurrency(expenses)}
              </span>
            </div>
            <div
              className="h-1.5 overflow-hidden rounded-full bg-border-subtle"
              aria-hidden="true"
            >
              <div
                className="h-full rounded-full bg-danger"
                style={{ width: `${expensesWidth}%` }}
              />
            </div>
          </div>
          <p className="text-sm leading-5 text-ink-secondary">
            {expensesPercentage === null
              ? FINANCES_COPY.incomeExpenseRatio.noIncome
              : FINANCES_COPY.incomeExpenseRatio.summary(expensesPercentage)}
          </p>
        </div>
      )}
    </div>
  );
}
