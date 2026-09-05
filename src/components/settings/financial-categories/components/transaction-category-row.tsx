"use client";

import { Archive, Pencil, RotateCcw } from "lucide-react";

import { Button } from "@/components/ui/button";
import { TRANSACTION_CATEGORIES_COPY } from "@/copy/transaction-categories-copy";
import type { TransactionCategory } from "@/types/database.types";

type TransactionCategoryRowProps = {
  category: TransactionCategory;
  disabled: boolean;
  onArchive: (category: TransactionCategory) => void;
  onEdit: (category: TransactionCategory) => void;
  onRestore: (category: TransactionCategory) => void;
};

export default function TransactionCategoryRow({
  category,
  disabled,
  onArchive,
  onEdit,
  onRestore,
}: TransactionCategoryRowProps) {
  return (
    <div className="flex items-center gap-3 py-3">
      <span className="min-w-0 flex-1 truncate text-sm text-ink">
        {category.name}
      </span>
      <Button
        type="button"
        variant="ghost"
        size="icon-xs"
        disabled={disabled}
        onClick={() => onEdit(category)}
        aria-label={TRANSACTION_CATEGORIES_COPY.actions.edit}
        title={TRANSACTION_CATEGORIES_COPY.actions.edit}
      >
        <Pencil aria-hidden="true" />
      </Button>
      {category.is_active ? (
        <Button
          type="button"
          variant="ghost"
          size="icon-xs"
          disabled={disabled}
          onClick={() => onArchive(category)}
          aria-label={TRANSACTION_CATEGORIES_COPY.actions.archive}
          title={TRANSACTION_CATEGORIES_COPY.actions.archive}
        >
          <Archive aria-hidden="true" />
        </Button>
      ) : (
        <Button
          type="button"
          variant="ghost"
          size="icon-xs"
          disabled={disabled}
          onClick={() => onRestore(category)}
          aria-label={TRANSACTION_CATEGORIES_COPY.actions.restore}
          title={TRANSACTION_CATEGORIES_COPY.actions.restore}
        >
          <RotateCcw aria-hidden="true" />
        </Button>
      )}
    </div>
  );
}
