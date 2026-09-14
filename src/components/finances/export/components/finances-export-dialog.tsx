"use client";

import { Download } from "lucide-react";
import type { Control, FieldErrors } from "react-hook-form";

import FinancesExportForm from "@/components/finances/export/components/finances-export-form";
import AppDialog from "@/components/ui/app-dialog";
import AppDialogDescription from "@/components/ui/app-dialog-description";
import AppDialogFooter from "@/components/ui/app-dialog-footer";
import AppDialogHeader from "@/components/ui/app-dialog-header";
import AppDialogTitle from "@/components/ui/app-dialog-title";
import type { AppSearchableMultiSelectOption } from "@/components/ui/app-searchable-multi-select";
import AppSheetContent from "@/components/ui/app-sheet-content";
import { Button } from "@/components/ui/button";
import { ActionButton } from "@/components/ui/primitives/action-button";
import {
  FORM_ACTION_ICONS,
  FORM_ACTION_ICON_CLASS,
} from "@/components/ui/primitives/form-action-icons";
import { FINANCES_COPY } from "@/copy/finances-copy";
import type { FinancesExportFormValues } from "@/lib/schemas/finances-export-schema";
import type { TransactionType } from "@/types/database.types";

type FinancesExportDialogProps = {
  availableCategories: AppSearchableMultiSelectOption[];
  categoryIds: string[];
  control: Control<FinancesExportFormValues>;
  errors: FieldErrors<FinancesExportFormValues>;
  isPending: boolean;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: () => void;
  onToggleCategory: (categoryId: string) => void;
  onTypeChange: (type: TransactionType | "all") => void;
};

export default function FinancesExportDialog({
  availableCategories,
  categoryIds,
  control,
  errors,
  isPending,
  open,
  onOpenChange,
  onSubmit,
  onToggleCategory,
  onTypeChange,
}: FinancesExportDialogProps) {
  return (
    <AppDialog open={open} onOpenChange={onOpenChange}>
      <AppSheetContent>
        <AppDialogHeader>
          <AppDialogTitle>{FINANCES_COPY.export.title}</AppDialogTitle>
          <AppDialogDescription>
            {FINANCES_COPY.export.description}
          </AppDialogDescription>
        </AppDialogHeader>
        <div className="min-h-0 flex-1 overflow-y-auto px-1">
          <FinancesExportForm
            availableCategories={availableCategories}
            categoryIds={categoryIds}
            control={control}
            errors={errors}
            onToggleCategory={onToggleCategory}
            onTypeChange={onTypeChange}
          />
        </div>
        <AppDialogFooter errorMessage={errors.root?.message}>
          <Button
            type="button"
            variant="outline"
            disabled={isPending}
            onClick={() => onOpenChange(false)}
          >
            <FORM_ACTION_ICONS.cancel
              className={FORM_ACTION_ICON_CLASS}
              aria-hidden="true"
            />
            {FINANCES_COPY.export.cancel}
          </Button>
          <ActionButton
            icon={Download}
            title={
              isPending
                ? FINANCES_COPY.export.submitting
                : FINANCES_COPY.export.submit
            }
            disabled={isPending}
            testId="finances-export-submit"
            onClick={onSubmit}
          />
        </AppDialogFooter>
      </AppSheetContent>
    </AppDialog>
  );
}
