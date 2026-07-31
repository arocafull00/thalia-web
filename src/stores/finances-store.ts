import { endOfMonth, format, startOfMonth, subMonths } from "date-fns";
import { create } from "zustand";

import {
  getTransactions,
  insertTransaction,
  updateTransaction as updateTransactionDal,
} from "@/dal/finances.dal";
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

export type FinancialSummary = {
  income: number;
  expenses: number;
  net: number;
  previousNet: number;
  difference: number;
  weekly: { week: number; income: number; expenses: number }[];
};

function transactionsKey(month: Date, type: TransactionType | "all") {
  const from = format(startOfMonth(month), "yyyy-MM-dd");
  const to = format(endOfMonth(month), "yyyy-MM-dd");
  return `${from}:${to}:${type}`;
}

function summaryKey(month: Date) {
  return format(month, "yyyy-MM");
}

async function refreshFinancesCaches(get: () => FinancesStore) {
  const transactionKeys = Object.keys(get().transactionsByKey);
  await Promise.all(
    transactionKeys.map((key) => {
      const [from, , type] = key.split(":");
      const month = new Date(from);
      return get().fetchTransactions(month, type as TransactionType | "all");
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
  transactionsByKey: Record<string, QueryEntry<Transaction[]>>;
  summaryByKey: Record<string, QueryEntry<FinancialSummary>>;
  creating: boolean;
  createError: Error | null;
  fetchTransactions: (
    month: Date,
    type: TransactionType | "all",
  ) => Promise<void>;
  fetchFinancialSummary: (month: Date) => Promise<void>;
  createTransaction: (input: TransactionInput) => Promise<Transaction>;
  updateTransaction: (
    id: string,
    input: TransactionUpdatePayload,
  ) => Promise<Transaction>;
};

export const useFinancesStore = create<FinancesStore>((set, get) => ({
  transactionsByKey: {},
  summaryByKey: {},
  creating: false,
  createError: null,

  fetchTransactions: async (month, type) => {
    const key = transactionsKey(month, type);
    const previous = get().transactionsByKey[key];
    set({
      transactionsByKey: {
        ...get().transactionsByKey,
        [key]: loadingQueryEntry(previous),
      },
    });

    try {
      const from = format(startOfMonth(month), "yyyy-MM-dd");
      const to = format(endOfMonth(month), "yyyy-MM-dd");
      const transactions = await getTransactions(from, to, type);
      set({
        transactionsByKey: {
          ...get().transactionsByKey,
          [key]: successQueryEntry(transactions),
        },
      });
    } catch (cause) {
      logger.captureException(cause, {
        store: "finances-store",
        action: "fetchTransactions",
        month: key,
        type,
      });
      set({
        transactionsByKey: {
          ...get().transactionsByKey,
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

export { transactionsKey, summaryKey };

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
