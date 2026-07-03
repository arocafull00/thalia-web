"use client";

import { Plus } from "lucide-react";
import { useState } from "react";

import FinancesCategoryBreakdown from "@/components/finances/components/finances-category-breakdown";
import FinancesMovementsSection from "@/components/finances/components/finances-movements-section";
import FinancesSummaryMetrics from "@/components/finances/components/finances-summary-metrics";
import FinancesWeeklyBreakdown from "@/components/finances/components/finances-weekly-breakdown";
import TransactionCreateForm from "@/components/finances/components/transaction-create-form";
import FinancesMonthSelector from "@/components/finances/finances-month-selector";
import AppDialog from "@/components/ui/app-dialog";
import AppDialogDescription from "@/components/ui/app-dialog-description";
import AppDialogFooter from "@/components/ui/app-dialog-footer";
import AppDialogHeader from "@/components/ui/app-dialog-header";
import AppDialogTitle from "@/components/ui/app-dialog-title";
import AppSheetContent from "@/components/ui/app-sheet-content";
import { ActionButton } from "@/components/ui/primitives/action-button";
import { Notice } from "@/components/ui/primitives/notice";
import { FINANCES_COPY } from "@/copy/finances-copy";
import { TRANSACTION_CREATE_COPY } from "@/copy/transaction-create-copy";
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
        <Notice tone="danger" message={FINANCES_COPY.errors.permissions} />
      </div>
    );
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="flex shrink-0 items-center justify-between gap-4 px-8 pt-6 pb-4">
        <div>
          <h1 className="text-2xl font-medium text-ink">
            {FINANCES_COPY.title}
          </h1>
          <p className="text-sm text-ink-secondary">{FINANCES_COPY.subtitle}</p>
        </div>
        <div className="flex items-center gap-4">
          <FinancesMonthSelector />
          <ActionButton
            title={FINANCES_COPY.newMovement}
            icon={Plus}
            onClick={handleOpenCreateDialog}
          />
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-8 pb-8">
        {summary.error ? (
          <Notice tone="danger" message={FINANCES_COPY.errors.summary} />
        ) : null}

        {summary.data ? (
          <>
            <FinancesSummaryMetrics summary={summary.data} />
            <div className="grid gap-8 py-8 xl:grid-cols-[1.8fr_1fr]">
              <FinancesWeeklyBreakdown weekly={summary.data.weekly} />
              <FinancesCategoryBreakdown items={categoryBreakdown} />
            </div>
          </>
        ) : null}

        <FinancesMovementsSection
          tab={tab}
          onTabChange={setTab}
          transactions={visibleTransactions}
          isLoading={transactions.isLoading}
          error={transactions.error}
        />
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
