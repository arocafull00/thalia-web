"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

import { TRANSACTION_CATEGORIES_COPY } from "@/copy/transaction-categories-copy";
import { useTransactionCategories } from "@/lib/hooks/use-transaction-categories";
import {
  transactionCategoryCreateSchema,
  type TransactionCategoryCreateInput,
} from "@/lib/schemas/transaction-category-schema";
import { useTransactionCategoriesStore } from "@/stores/transaction-categories-store";
import type {
  TransactionCategory,
  TransactionType,
} from "@/types/database.types";

function defaultValues(
  type: TransactionType,
  category?: TransactionCategory | null,
): TransactionCategoryCreateInput {
  return {
    name: category?.name ?? "",
    type: category?.type ?? type,
  };
}

export function useTransactionCategoriesManager(
  initialData: TransactionCategory[],
) {
  const { categories, error, isLoading } =
    useTransactionCategories(initialData);
  const createCategory = useTransactionCategoriesStore(
    (state) => state.createCategory,
  );
  const renameCategory = useTransactionCategoriesStore(
    (state) => state.renameCategory,
  );
  const archiveCategory = useTransactionCategoriesStore(
    (state) => state.archiveCategory,
  );
  const restoreCategory = useTransactionCategoriesStore(
    (state) => state.restoreCategory,
  );
  const isPending = useTransactionCategoriesStore((state) => state.mutating);
  const [formOpen, setFormOpen] = useState(false);
  const [editingCategory, setEditingCategory] =
    useState<TransactionCategory | null>(null);
  const [categoryToArchive, setCategoryToArchive] =
    useState<TransactionCategory | null>(null);
  const [archiveError, setArchiveError] = useState<string | null>(null);
  const categoryGroups = useMemo(
    () => ({
      incomeActive: categories.filter(
        (category) => category.type === "income" && category.is_active,
      ),
      incomeArchived: categories.filter(
        (category) => category.type === "income" && !category.is_active,
      ),
      expenseActive: categories.filter(
        (category) => category.type === "expense" && category.is_active,
      ),
      expenseArchived: categories.filter(
        (category) => category.type === "expense" && !category.is_active,
      ),
    }),
    [categories],
  );
  const {
    control,
    handleSubmit,
    register,
    reset,
    setError,
    formState: { errors },
  } = useForm<TransactionCategoryCreateInput>({
    resolver: zodResolver(transactionCategoryCreateSchema),
    defaultValues: defaultValues("income"),
  });

  const openCreate = (type: TransactionType = "income") => {
    setEditingCategory(null);
    reset(defaultValues(type));
    setFormOpen(true);
  };

  const openEdit = (category: TransactionCategory) => {
    setEditingCategory(category);
    reset(defaultValues(category.type, category));
    setFormOpen(true);
  };

  const closeForm = () => {
    setFormOpen(false);
    setEditingCategory(null);
    reset(defaultValues("income"));
  };

  const setFormDialogOpen = (open: boolean) => {
    if (open) {
      setFormOpen(true);
      return;
    }

    closeForm();
  };

  const submit = handleSubmit(async (values) => {
    try {
      if (editingCategory) {
        await renameCategory({ id: editingCategory.id, name: values.name });
        toast.success(TRANSACTION_CATEGORIES_COPY.success.renamed);
      } else {
        await createCategory(values);
        toast.success(TRANSACTION_CATEGORIES_COPY.success.created);
      }

      closeForm();
    } catch (cause) {
      const message =
        cause instanceof Error
          ? cause.message
          : TRANSACTION_CATEGORIES_COPY.errors.mutation;
      setError("root", { message });
      toast.error(message);
    }
  });

  const confirmArchive = async () => {
    if (!categoryToArchive) {
      return;
    }

    setArchiveError(null);

    try {
      await archiveCategory(categoryToArchive.id);
      toast.success(TRANSACTION_CATEGORIES_COPY.success.archived);
      setCategoryToArchive(null);
    } catch (cause) {
      const message =
        cause instanceof Error
          ? cause.message
          : TRANSACTION_CATEGORIES_COPY.errors.mutation;
      setArchiveError(message);
      toast.error(message);
    }
  };

  const restore = async (category: TransactionCategory) => {
    try {
      await restoreCategory(category.id);
      toast.success(TRANSACTION_CATEGORIES_COPY.success.restored);
    } catch (cause) {
      toast.error(
        cause instanceof Error
          ? cause.message
          : TRANSACTION_CATEGORIES_COPY.errors.mutation,
      );
    }
  };

  const setArchiveDialogOpen = (open: boolean) => {
    if (open) {
      return;
    }

    setArchiveError(null);
    setCategoryToArchive(null);
  };

  return {
    archiveError,
    categoryGroups,
    categoryToArchive,
    control,
    editingCategory,
    errors,
    formOpen,
    isLoading,
    isPending,
    loadError: error,
    register,
    closeForm,
    confirmArchive,
    openCreate,
    openEdit,
    restore,
    setCategoryToArchive,
    setFormDialogOpen,
    setArchiveDialogOpen,
    submit,
  };
}
