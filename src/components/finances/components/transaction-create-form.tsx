import {
  Controller,
  type Control,
  type FieldErrors,
  type UseFormRegister,
} from "react-hook-form";

import AppDateField from "@/components/ui/app-date-field";
import { TRANSACTION_CREATE_COPY } from "@/copy/transaction-create-copy";
import type { TransactionFormValues } from "@/lib/hooks/use-transaction-create-dialog";

const inputClassName =
  "w-full rounded-xl border border-border bg-surface px-3 py-2.5 text-sm outline-none ring-primary focus:ring-2";

type TransactionCreateFormProps = {
  register: UseFormRegister<TransactionFormValues>;
  control: Control<TransactionFormValues>;
  errors: FieldErrors<TransactionFormValues>;
};

export default function TransactionCreateForm({
  register,
  control,
  errors,
}: TransactionCreateFormProps) {
  return (
    <div className="mt-4 space-y-4">
      <label className="block space-y-1.5">
        <span className="text-sm text-ink-secondary">
          {TRANSACTION_CREATE_COPY.fields.type}{" "}
          <span className="text-danger">
            {TRANSACTION_CREATE_COPY.fields.requiredMark}
          </span>
        </span>
        <select {...register("type")} className={inputClassName}>
          <option value="income">
            {TRANSACTION_CREATE_COPY.fields.typeIncome}
          </option>
          <option value="expense">
            {TRANSACTION_CREATE_COPY.fields.typeExpense}
          </option>
        </select>
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
        <input {...register("category")} className={inputClassName} />
        {errors.category ? (
          <span className="text-sm text-danger">{errors.category.message}</span>
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
