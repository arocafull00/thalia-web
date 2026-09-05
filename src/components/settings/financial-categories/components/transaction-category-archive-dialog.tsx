"use client";

import AppConfirmDialog from "@/components/ui/app-confirm-dialog";
import { TRANSACTION_CATEGORIES_COPY } from "@/copy/transaction-categories-copy";
import type { TransactionCategory } from "@/types/database.types";

type TransactionCategoryArchiveDialogProps = {
  category: TransactionCategory | null;
  errorMessage: string | null;
  isPending: boolean;
  onConfirm: () => void;
  onOpenChange: (open: boolean) => void;
};

export default function TransactionCategoryArchiveDialog({
  category,
  errorMessage,
  isPending,
  onConfirm,
  onOpenChange,
}: TransactionCategoryArchiveDialogProps) {
  return (
    <AppConfirmDialog
      open={category !== null}
      onOpenChange={onOpenChange}
      title={TRANSACTION_CATEGORIES_COPY.archive.title}
      description={TRANSACTION_CATEGORIES_COPY.archive.description(
        category?.name ?? "",
      )}
      confirmLabel={TRANSACTION_CATEGORIES_COPY.actions.archive}
      cancelLabel={TRANSACTION_CATEGORIES_COPY.actions.cancel}
      pendingLabel={TRANSACTION_CATEGORIES_COPY.actions.archiving}
      isPending={isPending}
      onConfirm={onConfirm}
      confirmTone="danger"
      errorMessage={errorMessage ?? undefined}
    />
  );
}
