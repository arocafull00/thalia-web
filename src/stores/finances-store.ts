import { endOfMonth, format, startOfMonth, subMonths } from "date-fns";
import { create } from "zustand";

import {
  getTransactionCategories,
  getTransactions,
  getTransactionsPage,
  insertTransaction,
  updateTransaction as updateTransactionDal,
  type TransactionPageParams,
  type TransactionPageResult,
} from "@/dal/finances.dal";
import { getActiveClinicId } from "@/lib/active-clinic-id";
import { buildFinancialSummary } from "@/lib/finances-summary";
import { logger } from "@/lib/logger";
import {
  errorQueryEntry,
  loadingQueryEntry,
  successQueryEntry,
  type QueryEntry,
} from "@/stores/query-state";
import type { Transaction, TransactionType } from "@/types/database.types";

export type TransactionInput = {
  clinic_id: string;
  appointment_id: string | null;
  type: TransactionType;
  category: string | null;
  amount: number;
  description: string | null;
  date: string;
  created_by: string;
};

export type TransactionUpdatePayload = {
  type: TransactionType;
  category: string | null;
  amount: number;
  description: string | null;
  date: string;
};

export type CategoryBreakdownEntry = {
  category: string;
  amount: number;
  percent: number;
};

export type FinancialSummary = {
  income: number;
  expenses: number;
  net: number;
  previousNet: number;
  difference: number;
  weekly: { week: number; income: number; expenses: number }[];
  /**
   * Top 4 de categorías del mes. Va en el resumen y no en el hook porque el
   * hook ya sólo ve la página visible; el resumen, en cambio, se calcula sobre
   * el mes completo y no cuesta ninguna consulta extra.
   */
  breakdown: CategoryBreakdownEntry[];
};

export type TransactionsPageQuery = Omit<TransactionPageParams, "clinicId">;

export function transactionsPageKey(query: TransactionsPageQuery) {
  return JSON.stringify({
    from: query.from,
    to: query.to,
    type: query.type,
    category: query.category,
    search: query.search.trim().toLowerCase(),
    page: query.page,
    pageSize: query.pageSize,
  });
}

function summaryKey(month: Date) {
  return format(month, "yyyy-MM");
}

async function refreshFinancesCaches(get: () => FinancesStore) {
  const pageKeys = Object.keys(get().byPage);
  await Promise.all(
    pageKeys.map((key) =>
      get().fetchTransactionsPage(JSON.parse(key) as TransactionsPageQuery),
    ),
  );

  const categoryKeys = Object.keys(get().categoriesByRange);
  await Promise.all(
    categoryKeys.map((key) => {
      const [from, to] = key.split(":");
      return get().fetchTransactionCategories(from, to);
    }),
  );

  const summaryKeys = Object.keys(get().summaryByKey);
  await Promise.all(
    summaryKeys.map((key) =>
      get().fetchFinancialSummary(new Date(`${key}-01`)),
    ),
  );
}

type FinancesStore = {
  byPage: Record<string, QueryEntry<TransactionPageResult>>;
  categoriesByRange: Record<string, QueryEntry<string[]>>;
  summaryByKey: Record<string, QueryEntry<FinancialSummary>>;
  creating: boolean;
  createError: Error | null;
  fetchTransactionsPage: (query: TransactionsPageQuery) => Promise<void>;
  seedTransactionsPage: (
    query: TransactionsPageQuery,
    result: TransactionPageResult,
  ) => void;
  fetchTransactionCategories: (from: string, to: string) => Promise<void>;
  seedTransactionCategories: (
    from: string,
    to: string,
    categories: string[],
  ) => void;
  fetchFinancialSummary: (month: Date) => Promise<void>;
  seedFinancialSummary: (month: Date, summary: FinancialSummary) => void;
  createTransaction: (input: TransactionInput) => Promise<Transaction>;
  updateTransaction: (
    id: string,
    input: TransactionUpdatePayload,
  ) => Promise<Transaction>;
};

export const useFinancesStore = create<FinancesStore>((set, get) => ({
  byPage: {},
  categoriesByRange: {},
  summaryByKey: {},
  creating: false,
  createError: null,

  seedFinancialSummary: (month, summary) => {
    const key = summaryKey(month);

    set((state) => {
      if (state.summaryByKey[key]?.data != null) {
        return state;
      }

      return {
        summaryByKey: {
          ...state.summaryByKey,
          [key]: successQueryEntry(summary),
        },
      };
    });
  },

  seedTransactionsPage: (query, result) => {
    const key = transactionsPageKey(query);

    set((state) => {
      // La siembra sólo rellena huecos: si ya hay datos de cliente para esta
      // consulta, son más frescos que los del servidor.
      if (state.byPage[key]?.data != null) {
        return state;
      }

      return { byPage: { ...state.byPage, [key]: successQueryEntry(result) } };
    });
  },

  fetchTransactionsPage: async (query) => {
    const key = transactionsPageKey(query);
    const previous = get().byPage[key];
    set({ byPage: { ...get().byPage, [key]: loadingQueryEntry(previous) } });

    try {
      const result = await getTransactionsPage({
        ...query,
        clinicId: getActiveClinicId(),
      });
      set({ byPage: { ...get().byPage, [key]: successQueryEntry(result) } });
    } catch (cause) {
      logger.captureException(cause, {
        store: "finances-store",
        action: "fetchTransactionsPage",
        clinicId: getActiveClinicId(),
      });
      set({
        byPage: {
          ...get().byPage,
          [key]: errorQueryEntry(
            cause instanceof Error ? cause : new Error(String(cause)),
            previous,
          ),
        },
      });
    }
  },

  seedTransactionCategories: (from, to, categories) => {
    const key = `${from}:${to}`;

    set((state) => {
      if (state.categoriesByRange[key]?.data != null) {
        return state;
      }

      return {
        categoriesByRange: {
          ...state.categoriesByRange,
          [key]: successQueryEntry(categories),
        },
      };
    });
  },

  fetchTransactionCategories: async (from, to) => {
    const key = `${from}:${to}`;
    const previous = get().categoriesByRange[key];
    set({
      categoriesByRange: {
        ...get().categoriesByRange,
        [key]: loadingQueryEntry(previous),
      },
    });

    try {
      const categories = await getTransactionCategories(
        getActiveClinicId(),
        from,
        to,
      );
      set({
        categoriesByRange: {
          ...get().categoriesByRange,
          [key]: successQueryEntry(categories),
        },
      });
    } catch (cause) {
      logger.captureException(cause, {
        store: "finances-store",
        action: "fetchTransactionCategories",
        range: key,
      });
      set({
        categoriesByRange: {
          ...get().categoriesByRange,
          [key]: errorQueryEntry(
            cause instanceof Error ? cause : new Error(String(cause)),
            previous,
          ),
        },
      });
    }
  },

  fetchFinancialSummary: async (month) => {
    const key = summaryKey(month);
    const previous = get().summaryByKey[key];
    set({
      summaryByKey: {
        ...get().summaryByKey,
        [key]: loadingQueryEntry(previous),
      },
    });

    try {
      const currentFrom = format(startOfMonth(month), "yyyy-MM-dd");
      const currentTo = format(endOfMonth(month), "yyyy-MM-dd");
      const previousMonth = subMonths(month, 1);
      const previousFrom = format(startOfMonth(previousMonth), "yyyy-MM-dd");
      const previousTo = format(endOfMonth(previousMonth), "yyyy-MM-dd");

      const [current, previousTransactions] = await Promise.all([
        getTransactions(currentFrom, currentTo, "all"),
        getTransactions(previousFrom, previousTo, "all"),
      ]);
      const summary = buildFinancialSummary(current, previousTransactions);

      set({
        summaryByKey: {
          ...get().summaryByKey,
          [key]: successQueryEntry(summary),
        },
      });
    } catch (cause) {
      logger.captureException(cause, {
        store: "finances-store",
        action: "fetchFinancialSummary",
        month: key,
      });
      set({
        summaryByKey: {
          ...get().summaryByKey,
          [key]: errorQueryEntry(
            cause instanceof Error ? cause : new Error(String(cause)),
            previous,
          ),
        },
      });
    }
  },

  createTransaction: async (input) => {
    set({ creating: true, createError: null });

    try {
      const transaction = await insertTransaction(input);
      await refreshFinancesCaches(get);

      set({ creating: false });
      return transaction;
    } catch (cause) {
      const error = cause instanceof Error ? cause : new Error(String(cause));
      logger.captureException(error, {
        store: "finances-store",
        action: "createTransaction",
        clinicId: input.clinic_id,
      });
      set({ creating: false, createError: error });
      throw error;
    }
  },

  updateTransaction: async (id, input) => {
    set({ creating: true, createError: null });

    try {
      const transaction = await updateTransactionDal(id, input);
      await refreshFinancesCaches(get);

      set({ creating: false });
      return transaction;
    } catch (cause) {
      const error = cause instanceof Error ? cause : new Error(String(cause));
      logger.captureException(error, {
        store: "finances-store",
        action: "updateTransaction",
        transactionId: id,
      });
      set({ creating: false, createError: error });
      throw error;
    }
  },
}));

export { summaryKey };

export function transactionsToCsv(transactions: Transaction[]) {
  const rows = [["date", "type", "category", "amount", "description"]];

  transactions.forEach((transaction) => {
    rows.push([
      transaction.date ?? "",
      transaction.type,
      transaction.category ?? "",
      String(transaction.amount),
      transaction.description ?? "",
    ]);
  });

  return rows
    .map((row) =>
      row.map((value) => `"${value.replaceAll('"', '""')}"`).join(","),
    )
    .join("\n");
}
