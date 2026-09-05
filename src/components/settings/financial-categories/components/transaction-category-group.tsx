import TransactionCategoryRow from "@/components/settings/financial-categories/components/transaction-category-row";
import { TRANSACTION_CATEGORIES_COPY } from "@/copy/transaction-categories-copy";
import type { TransactionCategory } from "@/types/database.types";

type TransactionCategoryGroupProps = {
  active: TransactionCategory[];
  archived: TransactionCategory[];
  disabled: boolean;
  id: string;
  title: string;
  onArchive: (category: TransactionCategory) => void;
  onEdit: (category: TransactionCategory) => void;
  onRestore: (category: TransactionCategory) => void;
};

export default function TransactionCategoryGroup({
  active,
  archived,
  disabled,
  id,
  title,
  onArchive,
  onEdit,
  onRestore,
}: TransactionCategoryGroupProps) {
  return (
    <section aria-labelledby={id}>
      <h3
        id={id}
        className="border-b border-border-subtle pb-3 text-sm font-medium text-ink"
      >
        {title}
      </h3>
      <p className="pt-4 text-xs font-medium text-ink-muted">
        {TRANSACTION_CATEGORIES_COPY.groups.active}
      </p>
      {active.length > 0 ? (
        <div className="divide-y divide-border-subtle">
          {active.map((category) => (
            <TransactionCategoryRow
              key={category.id}
              category={category}
              disabled={disabled}
              onArchive={onArchive}
              onEdit={onEdit}
              onRestore={onRestore}
            />
          ))}
        </div>
      ) : (
        <p className="py-3 text-sm text-ink-secondary">
          {TRANSACTION_CATEGORIES_COPY.groups.emptyActive}
        </p>
      )}
      <p className="border-t border-border-subtle pt-4 text-xs font-medium text-ink-muted">
        {TRANSACTION_CATEGORIES_COPY.groups.archived}
      </p>
      {archived.length > 0 ? (
        <div className="divide-y divide-border-subtle">
          {archived.map((category) => (
            <TransactionCategoryRow
              key={category.id}
              category={category}
              disabled={disabled}
              onArchive={onArchive}
              onEdit={onEdit}
              onRestore={onRestore}
            />
          ))}
        </div>
      ) : (
        <p className="py-3 text-sm text-ink-secondary">
          {TRANSACTION_CATEGORIES_COPY.groups.emptyArchived}
        </p>
      )}
    </section>
  );
}
