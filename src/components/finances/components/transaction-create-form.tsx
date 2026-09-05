import {
  Controller,
  type Control,
  type FieldErrors,
  type UseFormRegister,
} from "react-hook-form";

import AppDateField from "@/components/ui/app-date-field";
import AppDialogError from "@/components/ui/app-dialog-error";
import AppSearchableCombobox, {
  type AppSearchableComboboxOption,
} from "@/components/ui/app-searchable-combobox";
import { TRANSACTION_CREATE_COPY } from "@/copy/transaction-create-copy";
import type { TransactionFormValues } from "@/lib/hooks/use-transaction-create-dialog";
import type { TransactionType } from "@/types/database.types";

const inputClassName =
  "w-full rounded-xl border border-border-field bg-surface px-3 py-2.5 text-sm outline-none ring-primary focus:ring-2";

const typeOptions: AppSearchableComboboxOption[] = [
  { value: "income", label: TRANSACTION_CREATE_COPY.fields.typeIncome },
  { value: "expense", label: TRANSACTION_CREATE_COPY.fields.typeExpense },
];

type TransactionCreateFormProps = {
  register: UseFormRegister<TransactionFormValues>;
  control: Control<TransactionFormValues>;
  errors: FieldErrors<TransactionFormValues>;
  type: TransactionType;
  categoryOptions: AppSearchableComboboxOption[];
  onTypeChange: (type: TransactionType) => void;
};

export default function TransactionCreateForm({
  register,
  control,
  errors,
  type,
  categoryOptions,
  onTypeChange,
}: TransactionCreateFormProps) {
  return (
    <div className="mt-4 space-y-4">
      <AppDialogError message={errors.root?.message} />
      <label className="block space-y-1.5">
        <span className="text-sm text-ink-secondary">
          {TRANSACTION_CREATE_COPY.fields.type}{" "}
          <span className="text-danger">
            {TRANSACTION_CREATE_COPY.fields.requiredMark}
          </span>
        </span>
        <Controller
          name="type"
          control={control}
          render={() => (
            <AppSearchableCombobox
              value={type}
              onValueChange={(value) => {
                if (value === "income" || value === "expense") {
                  onTypeChange(value);
                }
              }}
              options={typeOptions}
              showSearch={false}
            />
          )}
        />
        {errors.type ? (
          <span className="text-sm text-danger">{errors.type.message}</span>
        ) : null}
      </label>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block space-y-1.5">
          <span className="text-sm text-ink-secondary">
            {TRANSACTION_CREATE_COPY.fields.amount}{" "}
            <span className="text-danger">
              {TRANSACTION_CREATE_COPY.fields.requiredMark}
            </span>
          </span>
          <input
            {...register("amount")}
            type="number"
            min="0"
            step="0.01"
            className={inputClassName}
          />
          {errors.amount ? (
            <span className="text-sm text-danger">{errors.amount.message}</span>
          ) : null}
        </label>
        <label className="block space-y-1.5">
          <span className="text-sm text-ink-secondary">
            {TRANSACTION_CREATE_COPY.fields.date}{" "}
            <span className="text-danger">
              {TRANSACTION_CREATE_COPY.fields.requiredMark}
            </span>
          </span>
          <Controller
            name="date"
            control={control}
            render={({ field }) => (
              <AppDateField
                value={field.value}
                onChange={field.onChange}
                mode="date"
              />
            )}
          />
          {errors.date ? (
            <span className="text-sm text-danger">{errors.date.message}</span>
          ) : null}
        </label>
      </div>
      <label className="block space-y-1.5">
        <span className="text-sm text-ink-secondary">
          {TRANSACTION_CREATE_COPY.fields.category}
        </span>
        <Controller
          name="category_id"
          control={control}
          render={({ field }) => (
            <AppSearchableCombobox
              value={field.value || null}
              onValueChange={(value) => field.onChange(value ?? "")}
              options={categoryOptions}
              placeholder={TRANSACTION_CREATE_COPY.fields.categoryPlaceholder}
              searchPlaceholder={TRANSACTION_CREATE_COPY.fields.categorySearch}
              emptyMessage={TRANSACTION_CREATE_COPY.fields.categoryEmpty}
              allowClear
              clearLabel={TRANSACTION_CREATE_COPY.fields.categoryPlaceholder}
              testId="transaction-category-combobox"
            />
          )}
        />
        {errors.category_id ? (
          <span className="text-sm text-danger">
            {errors.category_id.message}
          </span>
        ) : null}
      </label>
      <label className="block space-y-1.5">
        <span className="text-sm text-ink-secondary">
          {TRANSACTION_CREATE_COPY.fields.description}
        </span>
        <textarea
          {...register("description")}
          rows={3}
          className={inputClassName}
        />
        {errors.description ? (
          <span className="text-sm text-danger">
            {errors.description.message}
          </span>
        ) : null}
      </label>
    </div>
  );
}
