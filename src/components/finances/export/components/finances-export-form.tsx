"use client";

import { Controller, type Control, type FieldErrors } from "react-hook-form";

import AppDateField from "@/components/ui/app-date-field";
import AppSearchableCombobox from "@/components/ui/app-searchable-combobox";
import AppSearchableMultiSelect, {
  type AppSearchableMultiSelectOption,
} from "@/components/ui/app-searchable-multi-select";
import { FINANCES_COPY } from "@/copy/finances-copy";
import type { FinancesExportFormValues } from "@/lib/schemas/finances-export-schema";
import type { TransactionType } from "@/types/database.types";

const TYPE_OPTIONS = [
  { value: "all", label: FINANCES_COPY.export.types.all },
  { value: "income", label: FINANCES_COPY.export.types.income },
  { value: "expense", label: FINANCES_COPY.export.types.expense },
];

type FinancesExportFormProps = {
  availableCategories: AppSearchableMultiSelectOption[];
  categoryIds: string[];
  control: Control<FinancesExportFormValues>;
  errors: FieldErrors<FinancesExportFormValues>;
  onToggleCategory: (categoryId: string) => void;
  onTypeChange: (type: TransactionType | "all") => void;
};

export default function FinancesExportForm({
  availableCategories,
  categoryIds,
  control,
  errors,
  onToggleCategory,
  onTypeChange,
}: FinancesExportFormProps) {
  return (
    <div className="space-y-5 pt-4">
      <label className="block space-y-1.5">
        <span className="text-sm text-ink-secondary">
          {FINANCES_COPY.export.fields.type}
        </span>
        <Controller
          name="type"
          control={control}
          render={({ field }) => (
            <AppSearchableCombobox
              value={field.value}
              onValueChange={(value) => {
                if (
                  value === "all" ||
                  value === "income" ||
                  value === "expense"
                ) {
                  onTypeChange(value);
                }
              }}
              options={TYPE_OPTIONS}
              showSearch={false}
              testId="finances-export-type"
            />
          )}
        />
      </label>

      <div className="grid gap-4 sm:grid-cols-2">
        <label htmlFor="finances-export-from" className="block space-y-1.5">
          <span className="text-sm text-ink-secondary">
            {FINANCES_COPY.export.fields.from}
          </span>
          <Controller
            name="from"
            control={control}
            render={({ field }) => (
              <AppDateField
                id="finances-export-from"
                value={field.value}
                onChange={field.onChange}
              />
            )}
          />
          {errors.from ? (
            <span className="text-sm text-danger">{errors.from.message}</span>
          ) : null}
        </label>
        <label htmlFor="finances-export-to" className="block space-y-1.5">
          <span className="text-sm text-ink-secondary">
            {FINANCES_COPY.export.fields.to}
          </span>
          <Controller
            name="to"
            control={control}
            render={({ field }) => (
              <AppDateField
                id="finances-export-to"
                value={field.value}
                onChange={field.onChange}
              />
            )}
          />
          {errors.to ? (
            <span className="text-sm text-danger">{errors.to.message}</span>
          ) : null}
        </label>
      </div>

      <fieldset className="space-y-2">
        <legend className="text-sm text-ink-secondary">
          {FINANCES_COPY.export.fields.categories}
        </legend>
        <p className="text-xs text-ink-muted">
          {FINANCES_COPY.export.allCategories}
        </p>
        <Controller
          name="categoryIds"
          control={control}
          render={() => (
            <AppSearchableMultiSelect
              selectedIds={categoryIds}
              onToggle={onToggleCategory}
              options={availableCategories}
              emptyMessage={FINANCES_COPY.export.noCategories}
              searchPlaceholder={FINANCES_COPY.export.searchCategory}
            />
          )}
        />
      </fieldset>
    </div>
  );
}
