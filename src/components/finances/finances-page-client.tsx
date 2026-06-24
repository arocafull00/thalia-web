"use client";

import { useRouter } from "next/navigation";

import FinancesMonthSelector from "@/components/finances/finances-month-selector";
import FinancesTabBar from "@/components/finances/finances-tab-bar";
import { ActionButton, Notice, PageHeader, SkeletonBlock, SkeletonList } from "@/components/ui/primitives";
import { formatCurrency, transactionTypeLabel } from "@/lib/format";
import { useFinancesPage } from "@/lib/hooks/use-finances-page";
import { useFinancesUiStore } from "@/stores/finances-ui-store";

export default function FinancesPageClient() {
  const router = useRouter();
  const setTab = useFinancesUiStore((state) => state.setTab);
  const {
    categoryBreakdown,
    fabType,
    isAdmin,
    summary,
    tab,
    transactions,
    visibleTransactions,
  } = useFinancesPage();

  if (!isAdmin) {
    return (
      <div className="p-8">
        <Notice tone="danger" message="Permisos insuficientes." />
      </div>
    );
  }

  return (
    <div className="space-y-6 p-8">
      <div className="flex items-start justify-between gap-4">
        <PageHeader subtitle="Resumen financiero y movimientos de la clinica." title="Finanzas" />
        <ActionButton
          title="Nuevo movimiento"
          onClick={() => router.push(`/finances/new?type=${fabType}`)}
        />
      </div>
      <FinancesMonthSelector />
      {summary.isLoading ? (
        <div className="space-y-4">
          <SkeletonBlock height={120} />
          <SkeletonBlock height={180} />
        </div>
      ) : null}
      {summary.error ? <Notice tone="danger" message="No se pudo cargar el resumen." /> : null}
      {summary.data ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {[
            { label: "Ingresos", value: formatCurrency(summary.data.income), tone: "text-emerald-600" },
            { label: "Gastos", value: formatCurrency(summary.data.expenses), tone: "text-red-500" },
            { label: "Balance neto", value: formatCurrency(summary.data.net), tone: "text-zinc-900" },
            {
              label: "Diferencia",
              value: formatCurrency(summary.data.difference),
              tone: summary.data.difference < 0 ? "text-red-500" : "text-emerald-600",
            },
          ].map((metric) => (
            <div key={metric.label} className="rounded-2xl border border-zinc-200 bg-white p-5">
              <p className="text-xs uppercase tracking-wide text-zinc-400">{metric.label}</p>
              <p className={`mt-3 text-3xl font-medium tabular-nums ${metric.tone}`}>{metric.value}</p>
            </div>
          ))}
        </div>
      ) : null}
      {summary.data ? (
        <div className="grid gap-6 border-t border-zinc-200 pt-6 xl:grid-cols-[1.8fr_1fr]">
          <div className="space-y-3">
            {summary.data.weekly.map((week) => (
              <div key={week.week} className="rounded-2xl border border-zinc-200 bg-white p-4">
                <div className="mb-2 flex justify-between text-sm text-zinc-500">
                  <span>Semana {week.week}</span>
                  <span>{formatCurrency(week.income - week.expenses)}</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <span className="text-emerald-600">+{formatCurrency(week.income)}</span>
                  <span className="text-red-500">-{formatCurrency(week.expenses)}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Desglose por categoria</h3>
            {categoryBreakdown.map((item) => (
              <div key={item.category} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="truncate text-zinc-900">{item.category}</span>
                  <span className="font-medium">{item.percent}%</span>
                </div>
                <div className="h-1 overflow-hidden rounded-full bg-zinc-100">
                  <div className="h-full rounded-full bg-zinc-900" style={{ width: `${item.percent}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : null}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">Movimientos recientes</h3>
          <FinancesTabBar selectedTab={tab} onTabChange={setTab} />
        </div>
        {transactions.isLoading ? <SkeletonList count={3} /> : null}
        {transactions.error ? (
          <Notice tone="danger" message="No se pudieron cargar los movimientos." />
        ) : null}
        {!transactions.isLoading ? (
          <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white">
            {visibleTransactions.map((transaction) => (
              <div
                key={transaction.id}
                className="grid grid-cols-[1fr_1.2fr_1.6fr_0.8fr_0.8fr] gap-4 border-b border-zinc-100 px-4 py-4 text-sm"
              >
                <span className="text-zinc-500">{transaction.date ?? "-"}</span>
                <span className="font-medium text-zinc-900">{transaction.category ?? "Sin categoria"}</span>
                <span className="truncate text-zinc-500">{transaction.description ?? "-"}</span>
                <span className="text-xs uppercase tracking-wide text-zinc-500">
                  {transactionTypeLabel(transaction.type)}
                </span>
                <span
                  className={`text-right font-medium tabular-nums ${
                    transaction.type === "income" ? "text-emerald-600" : "text-red-500"
                  }`}
                >
                  {transaction.type === "income" ? "+" : "-"}
                  {formatCurrency(transaction.amount)}
                </span>
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}
