import { Plus } from "lucide-react";

import TransactionCategoryGroup from "@/components/settings/financial-categories/components/transaction-category-group";
import { ActionButton } from "@/components/ui/primitives/action-button";
import { Notice } from "@/components/ui/primitives/notice";
import { TRANSACTION_CATEGORIES_COPY } from "@/copy/transaction-categories-copy";
import type {
  TransactionCategory,
  TransactionType,
} from "@/types/database.types";

type TransactionCategoriesPanelProps = {
  disabled: boolean;
  error: Error | null;
  expenseActive: TransactionCategory[];
  expenseArchived: TransactionCategory[];
  incomeActive: TransactionCategory[];
  incomeArchived: TransactionCategory[];
  isLoading: boolean;
  onAdd: (type?: TransactionType) => void;
  onArchive: (category: TransactionCategory) => void;
  onEdit: (category: TransactionCategory) => void;
  onRestore: (category: TransactionCategory) => void;
};

export default function TransactionCategoriesPanel({
  disabled,
  error,
  expenseActive,
  expenseArchived,
  incomeActive,
  incomeArchived,
  isLoading,
  onAdd,
  onArchive,
  onEdit,
  onRestore,
}: TransactionCategoriesPanelProps) {
  return (
    <section className="mt-8" aria-labelledby="transaction-categories-heading">
      <div className="flex flex-wrap items-start justify-between gap-4 border-b border-border-subtle pb-4">
        <div>
          <h2
            id="transaction-categories-heading"
            className="text-lg font-medium text-ink text-wrap-balance"
          >
            {TRANSACTION_CATEGORIES_COPY.title}
          </h2>
          <p className="mt-1 max-w-2xl text-sm text-ink-secondary">
            {TRANSACTION_CATEGORIES_COPY.description}
          </p>
        </div>
        <ActionButton
          icon={Plus}
          title={TRANSACTION_CATEGORIES_COPY.actions.add}
          disabled={disabled}
          onClick={() => onAdd()}
        />
      </div>
      {error ? (
        <div className="pt-4">
          <Notice
            tone="danger"
            message={TRANSACTION_CATEGORIES_COPY.errors.load}
          />
        </div>
      ) : null}
      {isLoading ? (
        <div className="grid gap-8 py-6 lg:grid-cols-2">
          <div className="h-40 animate-pulse rounded-xl bg-surface" />
          <div className="h-40 animate-pulse rounded-xl bg-surface" />
        </div>
      ) : (
        <div className="grid gap-8 py-6 lg:grid-cols-2">
          <TransactionCategoryGroup
            active={incomeActive}
            archived={incomeArchived}
            disabled={disabled}
            id="transaction-categories-income"
            title={TRANSACTION_CATEGORIES_COPY.groups.income}
            onArchive={onArchive}
            onEdit={onEdit}
            onRestore={onRestore}
          />
          <TransactionCategoryGroup
            active={expenseActive}
            archived={expenseArchived}
            disabled={disabled}
            id="transaction-categories-expense"
            title={TRANSACTION_CATEGORIES_COPY.groups.expense}
            onArchive={onArchive}
            onEdit={onEdit}
            onRestore={onRestore}
          />
        </div>
      )}
    </section>
  );
}
