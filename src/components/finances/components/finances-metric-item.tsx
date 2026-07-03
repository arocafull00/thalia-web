import type { LucideIcon } from "lucide-react";

type FinancesMetricItemProps = {
  label: string;
  value: string;
  tone: string;
  icon: LucideIcon;
};

export default function FinancesMetricItem({
  label,
  value,
  tone,
  icon: Icon,
}: FinancesMetricItemProps) {
  return (
    <div className="flex flex-col gap-2 px-6 py-5">
      <div className="flex items-center gap-2 text-ink-muted">
        <Icon className="size-3.5 shrink-0" aria-hidden="true" />
        <span className="text-xs uppercase tracking-wide">{label}</span>
      </div>
      <p className={`text-2xl font-medium tabular-nums ${tone}`}>{value}</p>
    </div>
  );
}
