import { create } from "zustand";

import {
  archiveTransactionCategoryAction,
  createTransactionCategoryAction,
  renameTransactionCategoryAction,
  restoreTransactionCategoryAction,
} from "@/components/settings/financial-categories/actions";
import { getTransactionCategories } from "@/dal/transaction-categories.dal";
import { getActiveClinicId } from "@/lib/active-clinic-id";
import { logger } from "@/lib/logger";
import type {
  TransactionCategoryCreateInput,
  TransactionCategoryRenameInput,
} from "@/lib/schemas/transaction-category-schema";
import { useFinancesStore } from "@/stores/finances-store";
import {
  errorQueryEntry,
  loadingQueryEntry,
  successQueryEntry,
  type QueryEntry,
} from "@/stores/query-state";
import type { TransactionCategory } from "@/types/database.types";

type TransactionCategoriesStore = {
  byClinic: Record<string, QueryEntry<TransactionCategory[]>>;
  mutating: boolean;
  fetchCategories: (clinicId: string) => Promise<void>;
  seedCategories: (clinicId: string, categories: TransactionCategory[]) => void;
  createCategory: (
    input: TransactionCategoryCreateInput,
  ) => Promise<TransactionCategory>;
  renameCategory: (
    input: TransactionCategoryRenameInput,
  ) => Promise<TransactionCategory>;
  archiveCategory: (categoryId: string) => Promise<TransactionCategory>;
  restoreCategory: (categoryId: string) => Promise<TransactionCategory>;
};

function sortCategories(categories: TransactionCategory[]) {
  return [...categories].sort((left, right) => {
    const typeComparison = left.type.localeCompare(right.type);

    if (typeComparison !== 0) {
      return typeComparison;
    }

    return left.name.localeCompare(right.name, "es");
  });
}

export const useTransactionCategoriesStore = create<TransactionCategoriesStore>(
  (set, get) => {
    const replaceCategory = (category: TransactionCategory) => {
      const clinicEntry = get().byClinic[category.clinic_id];
      const categories = clinicEntry?.data ?? [];
      const exists = categories.some((item) => item.id === category.id);
      const next = exists
        ? categories.map((item) => (item.id === category.id ? category : item))
        : [...categories, category];

      set({
        byClinic: {
          ...get().byClinic,
          [category.clinic_id]: successQueryEntry(sortCategories(next)),
        },
      });
      useFinancesStore.getState().invalidateCaches();
    };

    const runMutation = async (
      action: () => Promise<TransactionCategory>,
      actionName: string,
    ) => {
      set({ mutating: true });

      try {
        const category = await action();
        replaceCategory(category);
        set({ mutating: false });
        return category;
      } catch (cause) {
        const error = cause instanceof Error ? cause : new Error(String(cause));
        logger.captureException(error, {
          action: actionName,
          clinicId: getActiveClinicId(),
          store: "transaction-categories-store",
        });
        set({ mutating: false });
        throw error;
      }
    };

    return {
      byClinic: {},
      mutating: false,

      seedCategories: (clinicId, categories) => {
        set((state) => {
          if (state.byClinic[clinicId]?.data != null) {
            return state;
          }

          return {
            byClinic: {
              ...state.byClinic,
              [clinicId]: successQueryEntry(sortCategories(categories)),
            },
          };
        });
      },

      fetchCategories: async (clinicId) => {
        const previous = get().byClinic[clinicId];
        set({
          byClinic: {
            ...get().byClinic,
            [clinicId]: loadingQueryEntry(previous),
          },
        });

        try {
          const categories = await getTransactionCategories(clinicId);
          set({
            byClinic: {
              ...get().byClinic,
              [clinicId]: successQueryEntry(sortCategories(categories)),
            },
          });
        } catch (cause) {
          const error =
            cause instanceof Error ? cause : new Error(String(cause));
          logger.captureException(error, {
            action: "fetchTransactionCategories",
            clinicId,
            store: "transaction-categories-store",
          });
          set({
            byClinic: {
              ...get().byClinic,
              [clinicId]: errorQueryEntry(error, previous),
            },
          });
        }
      },

      createCategory: (input) =>
        runMutation(
          () => createTransactionCategoryAction(input),
          "createTransactionCategory",
        ),

      renameCategory: (input) =>
        runMutation(
          () => renameTransactionCategoryAction(input),
          "renameTransactionCategory",
        ),

      archiveCategory: (categoryId) =>
        runMutation(
          () => archiveTransactionCategoryAction(categoryId),
          "archiveTransactionCategory",
        ),

      restoreCategory: (categoryId) =>
        runMutation(
          () => restoreTransactionCategoryAction(categoryId),
          "restoreTransactionCategory",
        ),
    };
  },
);
