"use client";

import { Plus } from "lucide-react";
import { useMemo, useState } from "react";

import FinancesCategoryBreakdown from "@/components/finances/components/finances-category-breakdown";
import FinancesFilters from "@/components/finances/components/finances-filters";
import FinancesFiltersSheet from "@/components/finances/components/finances-filters-sheet";
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
import { Button } from "@/components/ui/button";
import PageStickyFiltersSection from "@/components/ui/page-sticky-filters-section";
import { ActionButton } from "@/components/ui/primitives/action-button";
import { MobileFab } from "@/components/ui/primitives/mobile-fab";
import { Notice } from "@/components/ui/primitives/notice";
import { FINANCES_COPY } from "@/copy/finances-copy";
import { TRANSACTION_CREATE_COPY } from "@/copy/transaction-create-copy";
import { useFilterSearch } from "@/lib/hooks/use-filter-search";
import { useFinancesPage } from "@/lib/hooks/use-finances-page";
import { useTopbarAction } from "@/lib/hooks/use-topbar-action";
import { useTransactionCreateDialog } from "@/lib/hooks/use-transaction-create-dialog";
import { useUrlFilters } from "@/lib/hooks/use-url-filters";
import { useFinancesUiStore } from "@/stores/finances-ui-store";

const FINANCES_FILTER_DEFAULTS = { category: "", q: "" };

export default function FinancesPageClient() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [sheetKey, setSheetKey] = useState(0);
  const setTab = useFinancesUiStore((state) => state.setTab);
  const { filters, setFilter, setFilters } = useUrlFilters(
    FINANCES_FILTER_DEFAULTS,
  );
  const { searchQuery, handleSearchChange } = useFilterSearch(
    filters.q,
    setFilter,
  );

  const pageFilters = useMemo(
    () => ({
      category: filters.category,
      search: searchQuery,
    }),
    [filters.category, searchQuery],
  );

  const {
    categoryBreakdown,
    categoryOptions,
    fabType,
    hasMore,
    isAdmin,
    loadMore,
    summary,
    tab,
    transactions,
    visibleTransactions,
  } = useFinancesPage(pageFilters);

  const dialog = useTransactionCreateDialog(fabType, () =>
    setDialogOpen(false),
  );

  const comboboxCategoryOptions = useMemo(
    () =>
      categoryOptions.map((category) => ({
        label: category,
        value: category,
      })),
    [categoryOptions],
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

  const handleOpenFiltersSheet = () => {
    setSheetKey((key) => key + 1);
    setSheetOpen(true);
  };

  useTopbarAction(
    isAdmin
      ? {
          title: FINANCES_COPY.newMovement,
          icon: Plus,
          testId: "transaction-create-trigger",
          onClick: handleOpenCreateDialog,
        }
      : null,
  );

  if (!isAdmin) {
    return (
      <div className="p-8">
        <Notice tone="danger" message={FINANCES_COPY.errors.permissions} />
      </div>
    );
  }

  return (
    <div data-testid="finances-page" className="flex min-h-0 flex-1 flex-col">
      <div className="flex shrink-0 items-center justify-center border-b border-border-subtle bg-surface px-4 py-3 lg:px-8 lg:py-4">
        <FinancesMonthSelector />
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto">
        <PageStickyFiltersSection>
          <FinancesFilters
            category={filters.category}
            categoryOptions={comboboxCategoryOptions}
            search={filters.q}
            onCategoryChange={(value) => setFilter("category", value)}
            onSearchChange={handleSearchChange}
            onOpenSheet={handleOpenFiltersSheet}
          />
        </PageStickyFiltersSection>
        <div className="space-y-6 px-4 py-4 lg:px-8 lg:py-6">
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
            hasMore={hasMore}
            onLoadMore={loadMore}
          />
        </div>
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
            <Button
              type="button"
              variant="outline"
              onClick={() => handleDialogOpenChange(false)}
              className="rounded-button px-3 py-1.5 text-sm"
            >
              {TRANSACTION_CREATE_COPY.actions.cancel}
            </Button>
            <ActionButton
              title={
                dialog.isPending
                  ? TRANSACTION_CREATE_COPY.actions.saving
                  : TRANSACTION_CREATE_COPY.actions.save
              }
              disabled={dialog.isPending}
              testId="transaction-create-submit"
              onClick={dialog.handleSubmit}
            />
          </AppDialogFooter>
        </AppSheetContent>
      </AppDialog>
      <FinancesFiltersSheet
        key={sheetKey}
        open={sheetOpen}
        filters={filters}
        categoryOptions={comboboxCategoryOptions}
        onApply={(updates) => setFilters(updates)}
        onClear={() => setFilters(FINANCES_FILTER_DEFAULTS)}
        onDismiss={() => setSheetOpen(false)}
      />
      <MobileFab
        label={FINANCES_COPY.newMovement}
        icon={Plus}
        onClick={handleOpenCreateDialog}
      />
    </div>
  );
}
