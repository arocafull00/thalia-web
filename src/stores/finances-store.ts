import { endOfMonth, format, startOfMonth, subMonths } from "date-fns";
import { create } from "zustand";

import {
  getTransactions,
  getTransactionsForExport,
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
import { getQueryEpoch, isCurrentQueryEpoch } from "@/stores/query-epoch";
import type { Transaction, TransactionType } from "@/types/database.types";

export type TransactionInput = {
  clinic_id: string;
  appointment_id: string | null;
  type: TransactionType;
  category_id: string | null;
  amount: number;
  description: string | null;
  date: string;
  created_by: string;
};

export type TransactionUpdatePayload = {
  type: TransactionType;
  category_id: string | null;
  amount: number;
  description: string | null;
  date: string;
};

export type CategoryBreakdownEntry = {
  categoryId: string | null;
  category: string;
  type: TransactionType;
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
   * Top 4 de categorías del mes, separado por tipo. Va en el resumen y no en el
   * hook porque el hook ya sólo ve la página visible; el resumen, en cambio, se
   * calcula sobre el mes completo y no cuesta ninguna consulta extra.
   *
   * Se calculan los dos de una vez para que el selector de la pantalla cambie
   * de uno a otro sin volver a consultar.
   */
  breakdown: {
    income: CategoryBreakdownEntry[];
    expense: CategoryBreakdownEntry[];
  };
};

export type TransactionsPageQuery = Omit<TransactionPageParams, "clinicId">;

export type TransactionExportQuery = {
  from: string;
  to: string;
  type: TransactionType | "all";
  categoryIds: string[];
};

export function transactionsPageKey(query: TransactionsPageQuery) {
  return JSON.stringify({
    from: query.from,
    to: query.to,
    type: query.type,
    categoryId: query.categoryId,
    search: query.search.trim().toLowerCase(),
    page: query.page,
    pageSize: query.pageSize,
  });
}

function summaryKey(month: Date, categoryId: string) {
  return `${format(month, "yyyy-MM")}:${categoryId}`;
}

async function refreshFinancesCaches(get: () => FinancesStore) {
  const pageKeys = Object.keys(get().byPage);
  await Promise.all(
    pageKeys.map((key) =>
      get().fetchTransactionsPage(JSON.parse(key) as TransactionsPageQuery),
    ),
  );

  const summaryKeys = Object.keys(get().summaryByKey);
  await Promise.all(
    summaryKeys.map((key) => {
      const [month, categoryId = ""] = key.split(":");
      return get().fetchFinancialSummary(new Date(`${month}-01`), categoryId);
    }),
  );
}

type FinancesStore = {
  byPage: Record<string, QueryEntry<TransactionPageResult>>;
  summaryByKey: Record<string, QueryEntry<FinancialSummary>>;
  creating: boolean;
  createError: Error | null;
  exporting: boolean;
  exportError: Error | null;
  fetchTransactionsPage: (query: TransactionsPageQuery) => Promise<void>;
  seedTransactionsPage: (
    query: TransactionsPageQuery,
    result: TransactionPageResult,
  ) => void;
  fetchFinancialSummary: (month: Date, categoryId: string) => Promise<void>;
  seedFinancialSummary: (
    month: Date,
    categoryId: string,
    summary: FinancialSummary,
  ) => void;
  refreshCaches: () => Promise<void>;
  invalidateCaches: () => void;
  exportTransactions: (query: TransactionExportQuery) => Promise<Transaction[]>;
  createTransaction: (input: TransactionInput) => Promise<Transaction>;
  updateTransaction: (
    id: string,
    input: TransactionUpdatePayload,
  ) => Promise<Transaction>;
};

export const useFinancesStore = create<FinancesStore>((set, get) => ({
  byPage: {},
  summaryByKey: {},
  creating: false,
  createError: null,
  exporting: false,
  exportError: null,

  seedFinancialSummary: (month, categoryId, summary) => {
    const key = summaryKey(month, categoryId);

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
    const epoch = getQueryEpoch();
    const key = transactionsPageKey(query);
    const previous = get().byPage[key];
    if (!isCurrentQueryEpoch(epoch)) return;
    set({ byPage: { ...get().byPage, [key]: loadingQueryEntry(previous) } });

    try {
      const result = await getTransactionsPage({
        ...query,
        clinicId: getActiveClinicId(),
      });
      if (!isCurrentQueryEpoch(epoch)) return;
      set({ byPage: { ...get().byPage, [key]: successQueryEntry(result) } });
    } catch (cause) {
      logger.captureException(cause, {
        store: "finances-store",
        action: "fetchTransactionsPage",
        clinicId: getActiveClinicId(),
      });
      if (!isCurrentQueryEpoch(epoch)) return;
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

  fetchFinancialSummary: async (month, categoryId) => {
    const epoch = getQueryEpoch();
    const key = summaryKey(month, categoryId);
    const previous = get().summaryByKey[key];
    if (!isCurrentQueryEpoch(epoch)) return;
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
        getTransactions(currentFrom, currentTo, "all", categoryId),
        getTransactions(previousFrom, previousTo, "all", categoryId),
      ]);
      const summary = buildFinancialSummary(current, previousTransactions);

      if (!isCurrentQueryEpoch(epoch)) return;
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
      if (!isCurrentQueryEpoch(epoch)) return;
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

  refreshCaches: () => refreshFinancesCaches(get),

  invalidateCaches: () => set({ byPage: {}, summaryByKey: {} }),

  exportTransactions: async (query) => {
    const clinicId = getActiveClinicId();
    set({ exporting: true, exportError: null });

    try {
      if (!clinicId) {
        throw new Error("No hay una clínica activa.");
      }

      const transactions = await getTransactionsForExport({
        ...query,
        clinicId,
      });
      set({ exporting: false });
      return transactions;
    } catch (cause) {
      const error = cause instanceof Error ? cause : new Error(String(cause));
      logger.captureException(error, {
        store: "finances-store",
        action: "exportTransactions",
        clinicId,
      });
      set({ exporting: false, exportError: error });
      throw error;
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
