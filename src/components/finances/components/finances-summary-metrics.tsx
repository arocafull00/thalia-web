import { ArrowLeftRight, Scale, TrendingDown, TrendingUp } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import FinancesMetricItem from "@/components/finances/components/finances-metric-item";
import { FINANCES_COPY } from "@/copy/finances-copy";
import { formatCurrency } from "@/lib/format";
import type { FinancialSummary } from "@/stores/finances-store";

type FinancesSummaryMetricsProps = {
  summary: FinancialSummary;
};

type MetricConfig = {
  label: string;
  value: string;
  tone: string;
  icon: LucideIcon;
};

export default function FinancesSummaryMetrics({
  summary,
}: FinancesSummaryMetricsProps) {
  const metrics: MetricConfig[] = [
    {
      label: FINANCES_COPY.metrics.income,
      value: formatCurrency(summary.income),
      tone: "text-success",
      icon: TrendingUp,
    },
    {
      label: FINANCES_COPY.metrics.expenses,
      value: formatCurrency(summary.expenses),
      tone: "text-danger",
      icon: TrendingDown,
    },
    {
      label: FINANCES_COPY.metrics.net,
      value: formatCurrency(summary.net),
      tone: "text-ink",
      icon: Scale,
    },
    {
      label: FINANCES_COPY.metrics.difference,
      value: formatCurrency(summary.difference),
      tone: summary.difference < 0 ? "text-danger" : "text-success",
      icon: ArrowLeftRight,
    },
  ];

  return (
    // Mismas tarjetas que los indicadores de stock: `rounded-card`, canto
    // verde y fondo plano. Antes era una rejilla con divisores, que leía como
    // una tabla y no como cuatro cifras independientes.
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {metrics.map((metric) => (
        <FinancesMetricItem key={metric.label} {...metric} />
      ))}
    </div>
  );
}
