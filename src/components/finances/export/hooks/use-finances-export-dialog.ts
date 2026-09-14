"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { endOfMonth, format, startOfMonth } from "date-fns";
import { useMemo } from "react";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";

import type { FinancesTabValue } from "@/components/finances/finances-tab-bar";
import { FINANCES_COPY } from "@/copy/finances-copy";
import { downloadFinancesCsv, transactionsToCsv } from "@/lib/finances-csv";
import { useExportTransactions } from "@/lib/hooks/use-finances";
import {
  financesExportSchema,
  type FinancesExportFormValues,
} from "@/lib/schemas/finances-export-schema";
import { notifySuccess } from "@/lib/sound";
import type {
  TransactionCategory,
  TransactionType,
} from "@/types/database.types";

type FinancesExportDefaults = {
  month: Date;
  tab: FinancesTabValue;
  categoryId: string;
};

function exportTypeForTab(tab: FinancesTabValue) {
  return tab === "summary" ? "all" : tab;
}

function createDefaultValues({
  month,
  tab,
  categoryId,
}: FinancesExportDefaults): FinancesExportFormValues {
  return {
    type: exportTypeForTab(tab),
    from: startOfMonth(month),
    to: endOfMonth(month),
    categoryIds: categoryId ? [categoryId] : [],
  };
}

export function useFinancesExportDialog(
  defaults: FinancesExportDefaults,
  categories: TransactionCategory[],
  onSuccess: () => void,
) {
  const { exportTransactions, isPending: isExporting } =
    useExportTransactions();
  const {
    control,
    clearErrors,
    getValues,
    handleSubmit,
    reset,
    setError,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FinancesExportFormValues>({
    resolver: zodResolver(financesExportSchema),
    defaultValues: createDefaultValues(defaults),
  });
  const type = useWatch({ control, name: "type" });
  const categoryIds = useWatch({ control, name: "categoryIds" });
  const availableCategories = useMemo(
    () =>
      categories
        .filter((category) => type === "all" || category.type === type)
        .map((category) => ({
          id: category.id,
          label: `${category.name}${
            category.is_active ? "" : FINANCES_COPY.export.archivedSuffix
          }`,
        })),
    [categories, type],
  );

  const prepare = () => {
    reset(createDefaultValues(defaults));
  };

  const handleTypeChange = (nextType: TransactionType | "all") => {
    setValue("type", nextType, { shouldDirty: true });

    if (nextType === "all") {
      return;
    }

    const allowedIds = new Set(
      categories
        .filter((category) => category.type === nextType)
        .map((category) => category.id),
    );
    setValue(
      "categoryIds",
      getValues("categoryIds").filter((id) => allowedIds.has(id)),
      { shouldDirty: true },
    );
  };

  const toggleCategory = (categoryId: string) => {
    const selected = getValues("categoryIds");
    const next = selected.includes(categoryId)
      ? selected.filter((id) => id !== categoryId)
      : [...selected, categoryId];
    setValue("categoryIds", next, {
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  const submit = handleSubmit(async (values) => {
    clearErrors("root");
    const from = format(values.from, "yyyy-MM-dd");
    const to = format(values.to, "yyyy-MM-dd");

    try {
      const transactions = await exportTransactions({
        from,
        to,
        type: values.type,
        categoryIds: values.categoryIds,
      });

      if (transactions.length === 0) {
        setError("root", { message: FINANCES_COPY.export.empty });
        toast.error(FINANCES_COPY.export.empty);
        return;
      }

      downloadFinancesCsv(transactionsToCsv(transactions), from, to);
      notifySuccess(FINANCES_COPY.export.success(transactions.length));
      onSuccess();
    } catch {
      setError("root", { message: FINANCES_COPY.export.error });
      toast.error(FINANCES_COPY.export.error);
    }
  });

  return {
    availableCategories,
    categoryIds,
    control,
    errors,
    handleTypeChange,
    isPending: isExporting || isSubmitting,
    prepare,
    submit,
    toggleCategory,
  };
}
