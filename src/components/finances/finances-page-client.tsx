"use client";

import { Download, Plus } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";

import FinancesCategoryBreakdown from "@/components/finances/components/finances-category-breakdown";
import FinancesCategoryManagementDialogs from "@/components/finances/components/finances-category-management-dialogs";
import FinancesFilters from "@/components/finances/components/finances-filters";
import FinancesFiltersSheet from "@/components/finances/components/finances-filters-sheet";
import FinancesIncomeExpenseRatio from "@/components/finances/components/finances-income-expense-ratio";
import FinancesMovementsSection from "@/components/finances/components/finances-movements-section";
import FinancesSummaryMetrics from "@/components/finances/components/finances-summary-metrics";
import FinancesWeeklyBreakdown from "@/components/finances/components/finances-weekly-breakdown";
import TransactionCreateForm from "@/components/finances/components/transaction-create-form";
import FinancesExportDialog from "@/components/finances/export/components/finances-export-dialog";
import { useFinancesExportDialog } from "@/components/finances/export/hooks/use-finances-export-dialog";
import FinancesMonthSelector, {
  financesMonthToParam,
} from "@/components/finances/finances-month-selector";
import type { FinancesTabValue } from "@/components/finances/finances-tab-bar";
import TransactionCategoryFormDialog from "@/components/settings/financial-categories/components/transaction-category-form-dialog";
import { useTransactionCategoriesManager } from "@/components/settings/financial-categories/hooks/use-transaction-categories-manager";
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
import { useTopbarActions } from "@/lib/hooks/use-topbar-actions";
import { useTransactionCreateDialog } from "@/lib/hooks/use-transaction-create-dialog";
import { useUrlFilters } from "@/lib/hooks/use-url-filters";
import type {
  FinancialSummary,
  TransactionsPageQuery,
} from "@/stores/finances-store";
import type { Transaction, TransactionCategory } from "@/types/database.types";

type FinancesPageClientProps = {
  initialMonth: string;
  initialTab: FinancesTabValue;
  initialTransactions: Transaction[];
  initialTotal: number;
  initialQuery: TransactionsPageQuery;
  initialCategories: TransactionCategory[];
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
  const [categoryManagerOpen, setCategoryManagerOpen] = useState(false);
  const [exportOpen, setExportOpen] = useState(false);
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

  const { handleSearchChange } = useFilterSearch(
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
      search: filters.q,
      tab: filters.tab as FinancesTabValue,
    }),
    [filters.category, filters.month, filters.q, filters.tab, pageIndex],
  );

  const {
    categoryBreakdown,
    categories,
    categoryOptions,
    fabType,
    isAdmin,
    listData,
    month,
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
  const exportDefaults = useMemo(
    () => ({ categoryId: filters.category, month, tab }),
    [filters.category, month, tab],
  );
  const exportDialog = useFinancesExportDialog(exportDefaults, categories, () =>
    setExportOpen(false),
  );

  const editingTransaction = useMemo(
    () =>
      listData.find((transaction) => transaction.id === editingTransactionId) ??
      null,
    [editingTransactionId, listData],
  );

  const dialog = useTransactionCreateDialog(
    fabType,
    () => setDialogOpen(false),
    categories,
    editingTransaction,
  );
  const categoryManager = useTransactionCategoriesManager(initialCategories, {
    onCreated: (category) => {
      if (dialogOpen && category.type === dialog.type) {
        dialog.selectCategory(category.id);
      }
    },
  });

  const comboboxCategoryOptions = useMemo(
    () =>
      categoryOptions.map((category) => ({
        label: `${category.name}${
          category.is_active ? "" : FINANCES_COPY.categories.archivedSuffix
        }`,
        value: category.id,
      })),
    [categoryOptions],
  );

  useEffect(() => {
    if (
      !filters.category ||
      categoryOptions.some((category) => category.id === filters.category)
    ) {
      return;
    }

    setFilterAndResetPage("category", "");
  }, [categoryOptions, filters.category, setFilterAndResetPage]);

  const handleDialogOpenChange = (nextOpen: boolean) => {
    if (!nextOpen && categoryManager.formOpen) {
      return;
    }

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

  const handleOpenMovementCategoryCreate = () => {
    categoryManager.openCreate(dialog.type);
  };

  const handleOpenExport = () => {
    exportDialog.prepare();
    setExportOpen(true);
  };

  const handleExportOpenChange = (nextOpen: boolean) => {
    if (!nextOpen && exportDialog.isPending) {
      return;
    }

    setExportOpen(nextOpen);
  };

  const handleOpenSummaryCategoryCreate = () => {
    categoryManager.openCreate(fabType);
  };

  const handleMonthChange = (nextMonth: Date) => {
    setFilter("month", financesMonthToParam(nextMonth));
  };

  const handleTabChange = (nextTab: FinancesTabValue) => {
    const selectedCategory = categories.find(
      (category) => category.id === filters.category,
    );

    if (
      selectedCategory &&
      nextTab !== "summary" &&
      selectedCategory.type !== nextTab
    ) {
      setFilters({ category: "", page: "", tab: nextTab });
      return;
    }

    setFilter("tab", nextTab);
  };

  useTopbarActions(
    isAdmin
      ? {
          buttons: [
            {
              title: FINANCES_COPY.export.action,
              icon: Download,
              variant: "ghost",
              testId: "finances-export-trigger",
              onClick: handleOpenExport,
            },
            {
              title: FINANCES_COPY.newMovement,
              icon: Plus,
              testId: "transaction-create-trigger",
              onClick: handleOpenCreateDialog,
            },
          ],
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
            <div className="grid gap-8 py-4 xl:grid-cols-[minmax(28rem,1fr)_minmax(0,1.5fr)] 2xl:grid-cols-[minmax(28rem,1fr)_minmax(12rem,0.55fr)_minmax(0,1.4fr)]">
              <div className="xl:col-start-1 xl:row-start-1">
                <FinancesWeeklyBreakdown weekly={summary.data.weekly} />
              </div>
              <div className="xl:col-start-1 xl:row-start-2 2xl:col-start-2 2xl:row-start-1">
                <FinancesIncomeExpenseRatio
                  income={summary.data.income}
                  expenses={summary.data.expenses}
                />
              </div>
              <div className="xl:col-start-2 xl:row-span-2 xl:row-start-1 2xl:col-start-3 2xl:row-span-1">
                <FinancesCategoryBreakdown
                  items={categoryBreakdown}
                  disabled={categoryManager.isPending}
                  onCreateCategory={handleOpenSummaryCategoryCreate}
                  onManageCategories={() => setCategoryManagerOpen(true)}
                />
              </div>
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
              type={dialog.type}
              categoryOptions={dialog.categoryOptions}
              onCreateCategory={handleOpenMovementCategoryCreate}
              onTypeChange={dialog.handleTypeChange}
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
      <TransactionCategoryFormDialog
        control={categoryManager.control}
        editing={categoryManager.editingCategory !== null}
        errors={categoryManager.errors}
        isPending={categoryManager.isPending}
        open={categoryManager.formOpen}
        register={categoryManager.register}
        onCancel={categoryManager.closeForm}
        onOpenChange={categoryManager.setFormDialogOpen}
        onSubmit={() => void categoryManager.submit()}
      />
      <FinancesExportDialog
        availableCategories={exportDialog.availableCategories}
        categoryIds={exportDialog.categoryIds}
        control={exportDialog.control}
        errors={exportDialog.errors}
        isPending={exportDialog.isPending}
        open={exportOpen}
        onOpenChange={handleExportOpenChange}
        onSubmit={() => void exportDialog.submit()}
        onToggleCategory={exportDialog.toggleCategory}
        onTypeChange={exportDialog.handleTypeChange}
      />
      <FinancesCategoryManagementDialogs
        manager={categoryManager}
        open={categoryManagerOpen}
        onOpenChange={setCategoryManagerOpen}
      />
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
