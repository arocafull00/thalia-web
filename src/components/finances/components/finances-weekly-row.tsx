import { formatCurrency } from "@/lib/format";

type FinancesWeeklyRowProps = {
  week: number;
  income: number;
  expenses: number;
};

export default function FinancesWeeklyRow({
  week,
  income,
  expenses,
}: FinancesWeeklyRowProps) {
  const net = income - expenses;

  return (
    <div className="grid gap-y-2 py-3 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center sm:gap-x-4">
      <span className="text-sm text-ink-secondary">Semana {week}</span>
      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 text-sm tabular-nums sm:flex-nowrap sm:justify-end">
        <span className="whitespace-nowrap text-success">
          +{formatCurrency(income)}
        </span>
        <span className="whitespace-nowrap text-danger">
          -{formatCurrency(expenses)}
        </span>
        <span className="whitespace-nowrap text-right font-medium text-ink sm:w-24">
          {formatCurrency(net)}
        </span>
      </div>
    </div>
  );
}
