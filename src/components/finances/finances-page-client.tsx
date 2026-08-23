"use client";

import { Plus } from "lucide-react";
import { useCallback, useMemo, useState } from "react";

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
import PageCard from "@/components/ui/page-card";
import PageSurface from "@/components/ui/page-surface";
import { ActionButton } from "@/components/ui/primitives/action-button";
import {
  FORM_ACTION_ICONS,
  FORM_ACTION_ICON_CLASS,
} from "@/components/ui/primitives/form-action-icons";
import { MobileFab } from "@/components/ui/primitives/mobile-fab";
import { Notice } from "@/components/ui/primitives/notice";
import { FINANCES_COPY } from "@/copy/finances-copy";
import { TRANSACTION_CREATE_COPY } from "@/copy/transaction-create-copy";
import { TRANSACTIONS_PAGE_SIZE } from "@/lib/finances-pagination";
import { parseFinancesMonthParam } from "@/lib/finances-summary";
import { useFilterSearch } from "@/lib/hooks/use-filter-search";
import { useFinancesPage } from "@/lib/hooks/use-finances-page";
import { useTopbarAction } from "@/lib/hooks/use-topbar-action";
import { useTransactionCreateDialog } from "@/lib/hooks/use-transaction-create-dialog";
import { useUrlFilters } from "@/lib/hooks/use-url-filters";
import type {
  FinancialSummary,
  TransactionsPageQuery,
} from "@/stores/finances-store";
import type { Transaction } from "@/types/database.types";

type FinancesPageClientProps = {
  initialMonth: string;
  initialTab: FinancesTabValue;
  initialTransactions: Transaction[];
  initialTotal: number;
  initialQuery: TransactionsPageQuery;
  initialCategories: string[];
  initialSummary?: FinancialSummary;
  initialSummaryKey: string;
};

export default function FinancesPageClient({
  initialMonth,
  initialTab,
  initialTransactions,
  initialTotal,
  initialQuery,
  initialCategories,
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
      page: "",
      q: "",
      tab: initialTab,
    }),
    [initialMonth, initialTab],
  );
  const { filters, setFilter, setFilters } = useUrlFilters(filterDefaults);

  // Cualquier cambio de filtro, búsqueda incluida, vuelve a la página 1:
  // quedarse en la 5 tras filtrar deja la tabla vacía sin explicar por qué.
  const setFilterAndResetPage = useCallback(
    (key: string, value: string) => {
      setFilters({ [key]: value, page: "" });
    },
    [setFilters],
  );

  const { searchQuery, handleSearchChange } = useFilterSearch(
    filters.q,
    setFilterAndResetPage,
  );

  // La página vive en la URL para que un enlace compartido abra donde estaba.
  // El tope a 0 evita que un `?page=-3` escrito a mano llegue al offset del DAL.
  const pageIndex = Math.max(0, Number.parseInt(filters.page, 10) || 0);

  const pageFilters = useMemo(
    () => ({
      category: filters.category,
      month: filters.month,
      page: pageIndex,
      search: searchQuery,
      tab: filters.tab as FinancesTabValue,
    }),
    [filters.category, filters.month, filters.tab, pageIndex, searchQuery],
  );

  const {
    categoryBreakdown,
    categoryOptions,
    fabType,
    isAdmin,
    listData,
    summary,
    tab,
    total,
    transactions,
  } = useFinancesPage(pageFilters, {
    initialCategories,
    initialQuery,
    initialSummary,
    initialSummaryKey,
    initialTotal,
    initialTransactions,
  });

  const editingTransaction = useMemo(
    () =>
      listData.find((transaction) => transaction.id === editingTransactionId) ??
      null,
    [editingTransactionId, listData],
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
      <PageSurface>
        <Notice tone="danger" message={FINANCES_COPY.errors.permissions} />
      </PageSurface>
    );
  }

  return (
    <div data-testid="finances-page" className="flex min-h-0 flex-1 flex-col">
      <PageCard
        filters={
          <div className="space-y-3">
            {/* El mes también es un filtro: va en la zona fija, no scrollea. */}
            <div className="flex items-center justify-center border-b border-border-subtle pb-3">
              <FinancesMonthSelector
                month={parseFinancesMonthParam(filters.month)}
                onMonthChange={handleMonthChange}
              />
            </div>
            <FinancesFilters
              category={filters.category}
              categoryOptions={comboboxCategoryOptions}
              search={filters.q}
              onCategoryChange={(value) => setFilter("category", value)}
              onSearchChange={handleSearchChange}
              onOpenSheet={handleOpenFiltersSheet}
            />
          </div>
        }
      >
        {summary.error ? (
          <Notice tone="danger" message={FINANCES_COPY.errors.summary} />
        ) : null}

        {summary.data ? (
          <>
            <FinancesSummaryMetrics summary={summary.data} />
            <div className="grid gap-8 py-4 xl:grid-cols-[1.8fr_1fr]">
              <FinancesWeeklyBreakdown weekly={summary.data.weekly} />
              <FinancesCategoryBreakdown items={categoryBreakdown} />
            </div>
          </>
        ) : null}

        <FinancesMovementsSection
          tab={tab}
          onTabChange={handleTabChange}
          transactions={listData}
          isLoading={transactions.isLoading}
          error={transactions.error}
          pagination={{
            pageIndex,
            pageSize: TRANSACTIONS_PAGE_SIZE,
            total,
            onPageChange: (next) =>
              setFilter("page", next === 0 ? "" : String(next)),
          }}
          onRowClick={handleRowClick}
        />
      </PageCard>

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
