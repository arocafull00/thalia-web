"use client";

import TransactionCategoriesPanel from "@/components/settings/financial-categories/components/transaction-categories-panel";
import TransactionCategoryArchiveDialog from "@/components/settings/financial-categories/components/transaction-category-archive-dialog";
import TransactionCategoryFormDialog from "@/components/settings/financial-categories/components/transaction-category-form-dialog";
import { useTransactionCategoriesManager } from "@/components/settings/financial-categories/hooks/use-transaction-categories-manager";
import type { TransactionCategory } from "@/types/database.types";

type FinancialCategoriesManagerProps = {
  initialCategories: TransactionCategory[];
};

export default function FinancialCategoriesManager({
  initialCategories,
}: FinancialCategoriesManagerProps) {
  const manager = useTransactionCategoriesManager(initialCategories);

  return (
    <>
      <TransactionCategoriesPanel
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
