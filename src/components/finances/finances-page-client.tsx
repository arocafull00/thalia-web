"use client";

import { useState } from "react";

import TransactionCreateForm from "@/components/finances/components/transaction-create-form";
import TransactionsTable from "@/components/finances/components/transactions-table";
import FinancesMonthSelector from "@/components/finances/finances-month-selector";
import FinancesTabBar from "@/components/finances/finances-tab-bar";
import AppDialog from "@/components/ui/app-dialog";
import AppDialogDescription from "@/components/ui/app-dialog-description";
import AppDialogFooter from "@/components/ui/app-dialog-footer";
import AppDialogHeader from "@/components/ui/app-dialog-header";
import AppDialogTitle from "@/components/ui/app-dialog-title";
import AppSheetContent from "@/components/ui/app-sheet-content";
import { ActionButton } from "@/components/ui/primitives/action-button";
import { Notice } from "@/components/ui/primitives/notice";
import { PageHeader } from "@/components/ui/primitives/page-header";
import { SkeletonList } from "@/components/ui/primitives/skeleton-list";
import { TRANSACTION_CREATE_COPY } from "@/copy/transaction-create-copy";
import { formatCurrency } from "@/lib/format";
import { useFinancesPage } from "@/lib/hooks/use-finances-page";
import { useTransactionCreateDialog } from "@/lib/hooks/use-transaction-create-dialog";
import { useFinancesUiStore } from "@/stores/finances-ui-store";

export default function FinancesPageClient() {
  const [dialogOpen, setDialogOpen] = useState(false);
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
  const dialog = useTransactionCreateDialog(fabType, () =>
    setDialogOpen(false),
  );

  const handleDialogOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      dialog.reset();
    }

    setDialogOpen(nextOpen);
  };

  const handleOpenCreateDialog = () => {
    dialog.prepare(fabType);
    setDialogOpen(true);
  };

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
        <PageHeader
          subtitle="Resumen financiero y movimientos de la clinica."
          title="Finanzas"
        />
        <ActionButton
          title="Nuevo movimiento"
          onClick={handleOpenCreateDialog}
        />
      </div>
      <FinancesMonthSelector />
      {summary.error ? (
        <Notice tone="danger" message="No se pudo cargar el resumen." />
      ) : null}
      {summary.data ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {[
            {
              label: "Ingresos",
              value: formatCurrency(summary.data.income),
              tone: "text-success",
            },
            {
              label: "Gastos",
              value: formatCurrency(summary.data.expenses),
              tone: "text-danger",
            },
            {
              label: "Balance neto",
              value: formatCurrency(summary.data.net),
              tone: "text-ink",
            },
            {
              label: "Diferencia",
              value: formatCurrency(summary.data.difference),
              tone:
                summary.data.difference < 0 ? "text-danger" : "text-success",
            },
          ].map((metric) => (
            <div
              key={metric.label}
              className="rounded-2xl border border-border bg-surface p-5"
            >
              <p className="text-xs uppercase tracking-wide text-ink-muted">
                {metric.label}
              </p>
              <p
                className={`mt-3 text-3xl font-medium tabular-nums ${metric.tone}`}
              >
                {metric.value}
              </p>
            </div>
          ))}
        </div>
      ) : null}
      {summary.data ? (
        <div className="grid gap-6 border-t border-border pt-6 xl:grid-cols-[1.8fr_1fr]">
          <div className="space-y-3">
            {summary.data.weekly.map((week) => (
              <div
                key={week.week}
                className="rounded-2xl border border-border bg-surface p-4"
              >
                <div className="mb-2 flex justify-between text-sm text-ink-secondary">
                  <span>Semana {week.week}</span>
                  <span>{formatCurrency(week.income - week.expenses)}</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <span className="text-success">
                    +{formatCurrency(week.income)}
                  </span>
                  <span className="text-danger">
                    -{formatCurrency(week.expenses)}
                  </span>
                </div>
              </div>
            ))}
          </div>
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Desglose por categoria</h3>
            {categoryBreakdown.map((item) => (
              <div key={item.category} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="truncate text-ink">{item.category}</span>
                  <span className="font-medium">{item.percent}%</span>
                </div>
                <div className="h-1 overflow-hidden rounded-full bg-primary-subtle/40">
                  <div
                    className="h-full rounded-full bg-primary"
                    style={{ width: `${item.percent}%` }}
                  />
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
          <Notice
            tone="danger"
            message="No se pudieron cargar los movimientos."
          />
        ) : null}
        {!transactions.isLoading ? (
          <TransactionsTable transactions={visibleTransactions} />
        ) : null}
      </div>
      <AppDialog open={dialogOpen} onOpenChange={handleDialogOpenChange}>
        <AppSheetContent>
          <AppDialogHeader>
            <AppDialogTitle>{TRANSACTION_CREATE_COPY.title}</AppDialogTitle>
            <AppDialogDescription>
              {TRANSACTION_CREATE_COPY.description}
            </AppDialogDescription>
          </AppDialogHeader>
          <div className="min-h-0 flex-1 overflow-y-auto px-1">
            <TransactionCreateForm
              register={dialog.register}
              control={dialog.control}
              errors={dialog.errors}
            />
          </div>
          <AppDialogFooter>
            <button
              type="button"
              onClick={() => handleDialogOpenChange(false)}
              className="rounded-full border border-border px-4 py-2 text-xs font-medium uppercase tracking-wide text-ink-secondary hover:bg-canvas"
            >
              {TRANSACTION_CREATE_COPY.actions.cancel}
            </button>
            <ActionButton
              title={
                dialog.isPending
                  ? TRANSACTION_CREATE_COPY.actions.saving
                  : TRANSACTION_CREATE_COPY.actions.save
              }
              disabled={dialog.isPending}
              onClick={dialog.handleSubmit}
            />
          </AppDialogFooter>
        </AppSheetContent>
      </AppDialog>
    </div>
  );
}
