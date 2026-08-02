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
import FinancesMonthSelector, {
  financesMonthToParam,
} from "@/components/finances/finances-month-selector";
import type { FinancesTabValue } from "@/components/finances/finances-tab-bar";
import AppDialog from "@/components/ui/app-dialog";
import AppDialogDescription from "@/components/ui/app-dialog-description";
import AppDialogFooter from "@/components/ui/app-dialog-footer";
import AppDialogHeader from "@/components/ui/app-dialog-header";
import AppDialogTitle from "@/components/ui/app-dialog-title";
import AppSheetContent from "@/components/ui/app-sheet-content";
import { Button } from "@/components/ui/button";
import PageStickyFiltersSection from "@/components/ui/page-sticky-filters-section";
import { ActionButton } from "@/components/ui/primitives/action-button";
import {
  FORM_ACTION_ICONS,
  FORM_ACTION_ICON_CLASS,
} from "@/components/ui/primitives/form-action-icons";
import { MobileFab } from "@/components/ui/primitives/mobile-fab";
import { Notice } from "@/components/ui/primitives/notice";
import { FINANCES_COPY } from "@/copy/finances-copy";
import { TRANSACTION_CREATE_COPY } from "@/copy/transaction-create-copy";
import { parseFinancesMonthParam } from "@/lib/finances-summary";
import { useFilterSearch } from "@/lib/hooks/use-filter-search";
import { useFinancesPage } from "@/lib/hooks/use-finances-page";
import { useTopbarAction } from "@/lib/hooks/use-topbar-action";
import { useTransactionCreateDialog } from "@/lib/hooks/use-transaction-create-dialog";
import { useUrlFilters } from "@/lib/hooks/use-url-filters";
import type { FinancialSummary } from "@/stores/finances-store";
import type { Transaction } from "@/types/database.types";

type FinancesPageClientProps = {
  initialMonth: string;
  initialTab: FinancesTabValue;
  initialTransactions: Transaction[];
  initialTransactionsKey: string;
  initialSummary?: FinancialSummary;
  initialSummaryKey: string;
};

export default function FinancesPageClient({
  initialMonth,
  initialTab,
  initialTransactions,
  initialTransactionsKey,
  initialSummary,
  initialSummaryKey,
}: FinancesPageClientProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTransactionId, setEditingTransactionId] = useState<
    string | null
  >(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [sheetKey, setSheetKey] = useState(0);
  const filterDefaults = useMemo(
    () => ({
      category: "",
      month: initialMonth,
      q: "",
      tab: initialTab,
    }),
    [initialMonth, initialTab],
  );
  const { filters, setFilter, setFilters } = useUrlFilters(filterDefaults);
  const { searchQuery, handleSearchChange } = useFilterSearch(
    filters.q,
    setFilter,
  );

  const pageFilters = useMemo(
    () => ({
      category: filters.category,
      month: filters.month,
      search: searchQuery,
      tab: filters.tab as FinancesTabValue,
    }),
    [filters.category, filters.month, filters.tab, searchQuery],
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
  } = useFinancesPage(pageFilters, {
    initialSummary,
    initialSummaryKey,
    initialTransactions,
    initialTransactionsKey,
  });

  const editingTransaction = useMemo(
    () =>
      visibleTransactions.find(
        (transaction) => transaction.id === editingTransactionId,
      ) ?? null,
    [editingTransactionId, visibleTransactions],
  );

  const dialog = useTransactionCreateDialog(
    fabType,
    () => setDialogOpen(false),
    editingTransaction,
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
    setDialogOpen(nextOpen);
  };

  const handleCancel = () => {
    dialog.reset();
    setEditingTransactionId(null);
    setDialogOpen(false);
  };

  const handleOpenCreateDialog = () => {
    setEditingTransactionId(null);

    if (!dialog.isDirty) {
      dialog.prepare(fabType);
    }

    setDialogOpen(true);
  };

  const handleRowClick = (id: string) => {
    setEditingTransactionId(id);
    setDialogOpen(true);
  };

  const handleOpenFiltersSheet = () => {
    setSheetKey((key) => key + 1);
    setSheetOpen(true);
  };

  const handleMonthChange = (nextMonth: Date) => {
    setFilter("month", financesMonthToParam(nextMonth));
  };

  const handleTabChange = (nextTab: FinancesTabValue) => {
    setFilter("tab", nextTab);
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
        <FinancesMonthSelector
          month={parseFinancesMonthParam(filters.month)}
          onMonthChange={handleMonthChange}
        />
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
            onTabChange={handleTabChange}
            transactions={visibleTransactions}
            isLoading={transactions.isLoading && !transactions.data}
            error={transactions.error}
            hasMore={hasMore}
            onLoadMore={loadMore}
            onRowClick={handleRowClick}
          />
        </div>
      </div>

      <AppDialog open={dialogOpen} onOpenChange={handleDialogOpenChange}>
        <AppSheetContent>
          <AppDialogHeader>
            <AppDialogTitle>
              {dialog.isEditing
                ? TRANSACTION_CREATE_COPY.titleEdit
                : TRANSACTION_CREATE_COPY.title}
            </AppDialogTitle>
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
              onClick={handleCancel}
              className="rounded-button px-3 py-1.5 text-sm"
            >
              <FORM_ACTION_ICONS.cancel
                className={FORM_ACTION_ICON_CLASS}
                aria-hidden="true"
              />
              {TRANSACTION_CREATE_COPY.actions.cancel}
            </Button>
            <ActionButton
              icon={FORM_ACTION_ICONS.save}
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
        onClear={() =>
          setFilters({
            category: "",
            q: "",
          })
        }
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
