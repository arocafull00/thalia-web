import TransactionCategoriesPanel from "@/components/settings/financial-categories/components/transaction-categories-panel";
import TransactionCategoryArchiveDialog from "@/components/settings/financial-categories/components/transaction-category-archive-dialog";
import TransactionCategoryFormDialog from "@/components/settings/financial-categories/components/transaction-category-form-dialog";
import type { useTransactionCategoriesManager } from "@/components/settings/financial-categories/hooks/use-transaction-categories-manager";
import AppDialog from "@/components/ui/app-dialog";
import AppDialogDescription from "@/components/ui/app-dialog-description";
import AppDialogTitle from "@/components/ui/app-dialog-title";
import AppSheetContent from "@/components/ui/app-sheet-content";
import { FINANCES_COPY } from "@/copy/finances-copy";

type CategoryManager = ReturnType<typeof useTransactionCategoriesManager>;

type FinancesCategoryManagementDialogsProps = {
  manager: CategoryManager;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export default function FinancesCategoryManagementDialogs({
  manager,
  open,
  onOpenChange,
}: FinancesCategoryManagementDialogsProps) {
  return (
    <>
      <AppDialog open={open} onOpenChange={onOpenChange}>
        <AppSheetContent className="fixed inset-y-0 right-0 z-50 flex h-full w-full max-w-4xl flex-col border-l border-border/60 bg-surface p-6 shadow-float outline-none data-[state=open]:animate-sheet-in data-[state=closed]:animate-sheet-out">
          <AppDialogTitle className="sr-only">
            {FINANCES_COPY.categories.manageTitle}
          </AppDialogTitle>
          <AppDialogDescription className="sr-only">
            {FINANCES_COPY.categories.manageDescription}
          </AppDialogDescription>
          <TransactionCategoriesPanel
            className="mt-0 min-h-0 flex-1 overflow-y-auto pr-1"
            disabled={manager.isPending}
            error={manager.loadError}
            expenseActive={manager.categoryGroups.expenseActive}
            expenseArchived={manager.categoryGroups.expenseArchived}
            incomeActive={manager.categoryGroups.incomeActive}
            incomeArchived={manager.categoryGroups.incomeArchived}
            isLoading={manager.isLoading}
            onAdd={manager.openCreate}
            onArchive={manager.setCategoryToArchive}
            onEdit={manager.openEdit}
            onRestore={(category) => void manager.restore(category)}
          />
        </AppSheetContent>
      </AppDialog>
      <TransactionCategoryFormDialog
        control={manager.control}
        editing={manager.editingCategory !== null}
        errors={manager.errors}
        isPending={manager.isPending}
        open={manager.formOpen}
        register={manager.register}
        onCancel={manager.closeForm}
        onOpenChange={manager.setFormDialogOpen}
        onSubmit={() => void manager.submit()}
      />
      <TransactionCategoryArchiveDialog
        category={manager.categoryToArchive}
        errorMessage={manager.archiveError}
        isPending={manager.isPending}
        onConfirm={() => void manager.confirmArchive()}
        onOpenChange={manager.setArchiveDialogOpen}
      />
    </>
  );
}
