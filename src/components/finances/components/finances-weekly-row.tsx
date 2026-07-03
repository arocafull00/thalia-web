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
    <div className="flex items-center justify-between gap-4 py-3">
      <span className="text-sm text-ink-secondary">Semana {week}</span>
      <div className="flex items-center gap-4 text-sm tabular-nums">
        <span className="text-success">+{formatCurrency(income)}</span>
        <span className="text-danger">-{formatCurrency(expenses)}</span>
        <span className="w-24 text-right font-medium text-ink">
          {formatCurrency(net)}
        </span>
      </div>
    </div>
  );
}
