import { endOfMonth, format, startOfMonth, subMonths } from "date-fns";
import { create } from "zustand";

import { supabase } from "@/lib/supabase";
import { unwrapSupabase, unwrapSupabaseList } from "@/lib/supabase-query";
import {
  emptyQueryEntry,
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

type FinancesStore = {
  transactionsByKey: Record<string, QueryEntry<Transaction[]>>;
  summaryByKey: Record<string, QueryEntry<FinancialSummary>>;
  creating: boolean;
  createError: Error | null;
  fetchTransactions: (month: Date, type: TransactionType | "all") => Promise<void>;
  fetchFinancialSummary: (month: Date) => Promise<void>;
  createTransaction: (input: TransactionInput) => Promise<Transaction>;
};

export const useFinancesStore = create<FinancesStore>((set, get) => ({
  transactionsByKey: {},
  summaryByKey: {},
  creating: false,
  createError: null,

  fetchTransactions: async (month, type) => {
    const key = transactionsKey(month, type);
    const previous = get().transactionsByKey[key];
    set({ transactionsByKey: { ...get().transactionsByKey, [key]: loadingQueryEntry(previous) } });

    try {
      const from = format(startOfMonth(month), "yyyy-MM-dd");
      const to = format(endOfMonth(month), "yyyy-MM-dd");
      let query = supabase
        .from("transactions")
        .select("*")
        .gte("date", from)
        .lte("date", to)
        .order("date", { ascending: false });

      if (type !== "all") {
        query = query.eq("type", type);
      }

      const { data, error } = await query;
      const transactions = unwrapSupabaseList(data, error) as Transaction[];
      set({
        transactionsByKey: { ...get().transactionsByKey, [key]: successQueryEntry(transactions) },
      });
    } catch (cause) {
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
    set({ summaryByKey: { ...get().summaryByKey, [key]: loadingQueryEntry(previous) } });

    try {
      const currentFrom = format(startOfMonth(month), "yyyy-MM-dd");
      const currentTo = format(endOfMonth(month), "yyyy-MM-dd");
      const previousMonth = subMonths(month, 1);
      const previousFrom = format(startOfMonth(previousMonth), "yyyy-MM-dd");
      const previousTo = format(endOfMonth(previousMonth), "yyyy-MM-dd");

      const [currentResponse, previousResponse] = await Promise.all([
        supabase.from("transactions").select("*").gte("date", currentFrom).lte("date", currentTo),
        supabase.from("transactions").select("*").gte("date", previousFrom).lte("date", previousTo),
      ]);

      const current = unwrapSupabaseList(
        currentResponse.data,
        currentResponse.error,
      ) as Transaction[];
      const previousTransactions = unwrapSupabaseList(
        previousResponse.data,
        previousResponse.error,
      ) as Transaction[];
      const income = current
        .filter((transaction) => transaction.type === "income")
        .reduce((total, transaction) => total + transaction.amount, 0);
      const expenses = current
        .filter((transaction) => transaction.type === "expense")
        .reduce((total, transaction) => total + transaction.amount, 0);
      const previousNet = previousTransactions.reduce((total, transaction) => {
        return total + (transaction.type === "income" ? transaction.amount : -transaction.amount);
      }, 0);
      const net = income - expenses;

      const summary: FinancialSummary = {
        income,
        expenses,
        net,
        previousNet,
        difference: net - previousNet,
        weekly: [0, 1, 2, 3, 4].map((week) => {
          const weekTransactions = current.filter((transaction) => {
            const day = Number(transaction.date?.slice(8, 10) ?? 1);
            return Math.floor((day - 1) / 7) === week;
          });

          return {
            week: week + 1,
            income: weekTransactions
              .filter((transaction) => transaction.type === "income")
              .reduce((total, transaction) => total + transaction.amount, 0),
            expenses: weekTransactions
              .filter((transaction) => transaction.type === "expense")
              .reduce((total, transaction) => total + transaction.amount, 0),
          };
        }),
      };

      set({ summaryByKey: { ...get().summaryByKey, [key]: successQueryEntry(summary) } });
    } catch (cause) {
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
      const { data, error } = await supabase
        .from("transactions")
        .insert(input)
        .select("*")
        .single();
      const transaction = unwrapSupabase(data, error) as Transaction;

      const transactionKeys = Object.keys(get().transactionsByKey);
      await Promise.all(
        transactionKeys.map((key) => {
          const [from, to, type] = key.split(":");
          const month = new Date(from);
          return get().fetchTransactions(month, type as TransactionType | "all");
        }),
      );

      const summaryKeys = Object.keys(get().summaryByKey);
      await Promise.all(
        summaryKeys.map((key) => get().fetchFinancialSummary(new Date(`${key}-01`))),
      );

      set({ creating: false });
      return transaction;
    } catch (cause) {
      const error = cause instanceof Error ? cause : new Error(String(cause));
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
    .map((row) => row.map((value) => `"${value.replaceAll('"', '""')}"`).join(","))
    .join("\n");
}
