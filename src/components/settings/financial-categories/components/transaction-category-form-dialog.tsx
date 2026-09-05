"use client";

import {
  Controller,
  type Control,
  type FieldErrors,
  type UseFormRegister,
} from "react-hook-form";

import AppDialog from "@/components/ui/app-dialog";
import AppDialogDescription from "@/components/ui/app-dialog-description";
import AppDialogFooter from "@/components/ui/app-dialog-footer";
import AppDialogHeader from "@/components/ui/app-dialog-header";
import AppDialogTitle from "@/components/ui/app-dialog-title";
import AppSearchableCombobox from "@/components/ui/app-searchable-combobox";
import AppSheetContent from "@/components/ui/app-sheet-content";
import { Button } from "@/components/ui/button";
import { ActionButton } from "@/components/ui/primitives/action-button";
import {
  FORM_ACTION_ICONS,
  FORM_ACTION_ICON_CLASS,
} from "@/components/ui/primitives/form-action-icons";
import { TRANSACTION_CATEGORIES_COPY } from "@/copy/transaction-categories-copy";
import type { TransactionCategoryCreateInput } from "@/lib/schemas/transaction-category-schema";

const typeOptions = [
  {
    label: TRANSACTION_CATEGORIES_COPY.fields.income,
    value: "income",
  },
  {
    label: TRANSACTION_CATEGORIES_COPY.fields.expense,
    value: "expense",
  },
];

type TransactionCategoryFormDialogProps = {
  control: Control<TransactionCategoryCreateInput>;
  editing: boolean;
  errors: FieldErrors<TransactionCategoryCreateInput>;
  isPending: boolean;
  open: boolean;
  register: UseFormRegister<TransactionCategoryCreateInput>;
  onCancel: () => void;
  onOpenChange: (open: boolean) => void;
  onSubmit: () => void;
};

export default function TransactionCategoryFormDialog({
  control,
  editing,
  errors,
  isPending,
  open,
  register,
  onCancel,
  onOpenChange,
  onSubmit,
}: TransactionCategoryFormDialogProps) {
  return (
    <AppDialog open={open} onOpenChange={onOpenChange}>
      <AppSheetContent>
        <AppDialogHeader>
          <AppDialogTitle>
            {editing
              ? TRANSACTION_CATEGORIES_COPY.form.editTitle
              : TRANSACTION_CATEGORIES_COPY.form.createTitle}
          </AppDialogTitle>
          <AppDialogDescription>
            {editing
              ? TRANSACTION_CATEGORIES_COPY.form.editDescription
              : TRANSACTION_CATEGORIES_COPY.form.createDescription}
          </AppDialogDescription>
        </AppDialogHeader>
        <div className="min-h-0 flex-1 space-y-4 overflow-y-auto px-1 pt-4">
          <label className="block space-y-1.5">
            <span className="text-sm text-ink-secondary">
              {TRANSACTION_CATEGORIES_COPY.fields.name}
            </span>
            <input
              {...register("name")}
              className="w-full rounded-input border border-border-field bg-surface px-3 py-2 text-sm text-ink outline-none ring-primary focus:ring-2"
            />
            {errors.name ? (
              <span className="text-sm text-danger">{errors.name.message}</span>
            ) : null}
          </label>
          <label className="block space-y-1.5">
            <span className="text-sm text-ink-secondary">
              {TRANSACTION_CATEGORIES_COPY.fields.type}
            </span>
            <Controller
              name="type"
              control={control}
              render={({ field }) => (
                <AppSearchableCombobox
                  value={field.value}
                  onValueChange={(value) => {
                    if (value === "income" || value === "expense") {
                      field.onChange(value);
                    }
                  }}
                  options={typeOptions}
                  placeholder={
                    TRANSACTION_CATEGORIES_COPY.fields.typePlaceholder
                  }
                  disabled={editing}
                  showSearch={false}
                />
              )}
            />
          </label>
        </div>
        <AppDialogFooter errorMessage={errors.root?.message}>
          <Button
            type="button"
            variant="outline"
            disabled={isPending}
            onClick={onCancel}
          >
            <FORM_ACTION_ICONS.cancel
              className={FORM_ACTION_ICON_CLASS}
              aria-hidden="true"
            />
            {TRANSACTION_CATEGORIES_COPY.actions.cancel}
          </Button>
          <ActionButton
            icon={FORM_ACTION_ICONS.save}
            title={
              isPending
                ? TRANSACTION_CATEGORIES_COPY.actions.saving
                : TRANSACTION_CATEGORIES_COPY.actions.save
            }
            disabled={isPending}
            onClick={onSubmit}
          />
        </AppDialogFooter>
      </AppSheetContent>
    </AppDialog>
  );
}
