import { describe, it, expect, beforeEach, vi } from "vitest";

import * as financesDal from "@/dal/finances.dal";
import {
  useFinancesStore,
  transactionsPageKey,
  summaryKey,
  transactionsToCsv,
} from "@/stores/finances-store";
import { CLINIC_ID } from "@/tests/mocks";

vi.mock("@/dal/finances.dal", () => ({
  getTransactionsPage: vi.fn(),
  getTransactionCategories: vi.fn(),
  getTransactions: vi.fn(),
  insertTransaction: vi.fn(),
}));

vi.mock("@/lib/logger", () => ({
  logger: { captureException: vi.fn() },
}));

const JUN_2024 = new Date("2024-06-01");

const jan3 = {
  id: "t1",
  clinic_id: CLINIC_ID,
  type: "income" as const,
  category: "Consulta",
  amount: 100,
  description: null,
  date: "2024-01-03",
  appointment_id: null,
  created_by: "emp-1",
  created_at: null,
  updated_at: null,
};
const jan10 = {
  id: "t2",
  clinic_id: CLINIC_ID,
  type: "expense" as const,
  category: "Material",
  amount: 50,
  description: null,
  date: "2024-01-10",
  appointment_id: null,
  created_by: "emp-1",
  created_at: null,
  updated_at: null,
};
const jan15 = {
  id: "t3",
  clinic_id: CLINIC_ID,
  type: "income" as const,
  category: "Tratamiento",
  amount: 200,
  description: null,
  date: "2024-01-15",
  appointment_id: null,
  created_by: "emp-1",
  created_at: null,
  updated_at: null,
};
const jan22 = {
  id: "t4",
  clinic_id: CLINIC_ID,
  type: "expense" as const,
  category: "Limpieza",
  amount: 30,
  description: null,
  date: "2024-01-22",
  appointment_id: null,
  created_by: "emp-1",
  created_at: null,
  updated_at: null,
};
const jan29 = {
  id: "t5",
  clinic_id: CLINIC_ID,
  type: "income" as const,
  category: "Consulta",
  amount: 75,
  description: null,
  date: "2024-01-29",
  appointment_id: null,
  created_by: "emp-1",
  created_at: null,
  updated_at: null,
};

const janTransactions = [jan3, jan10, jan15, jan22, jan29];

const decIncome = {
  id: "t6",
  clinic_id: CLINIC_ID,
  type: "income" as const,
  category: "Consulta",
  amount: 500,
  description: null,
  date: "2023-12-15",
  appointment_id: null,
  created_by: "emp-1",
  created_at: null,
  updated_at: null,
};
const decExpense = {
  id: "t7",
  clinic_id: CLINIC_ID,
  type: "expense" as const,
  category: "Alquiler",
  amount: 100,
  description: null,
  date: "2023-12-20",
  appointment_id: null,
  created_by: "emp-1",
  created_at: null,
  updated_at: null,
};
const decTransactions = [decIncome, decExpense];

const mockTransaction = {
  id: "t-new",
  clinic_id: CLINIC_ID,
  type: "income" as const,
  category: "Nueva",
  amount: 300,
  description: "extra",
  date: "2024-06-15",
  appointment_id: null,
  created_by: "emp-1",
  created_at: null,
  updated_at: null,
};

const initialState = {
  byPage: {},
  categoriesByRange: {},
  summaryByKey: {},
  creating: false,
  createError: null,
};

describe("finances-store", () => {
  beforeEach(() => {
    useFinancesStore.setState(initialState);
  });

  it("has correct initial state", () => {
    const state = useFinancesStore.getState();
    expect(state.byPage).toEqual({});
    expect(state.categoriesByRange).toEqual({});
    expect(state.summaryByKey).toEqual({});
    expect(state.creating).toBe(false);
    expect(state.createError).toBeNull();
  });

  describe("fetchTransactionsPage", () => {
    const PAGE_QUERY = {
      from: "2024-01-01",
      to: "2024-01-31",
      type: "all" as const,
      category: "",
      search: "",
      page: 0,
      pageSize: 20,
    };

    it("stores the page and its total under the query key", async () => {
      vi.mocked(financesDal.getTransactionsPage).mockResolvedValue({
        transactions: janTransactions as never,
        total: 57,
      });

      await useFinancesStore.getState().fetchTransactionsPage(PAGE_QUERY);

      const entry =
        useFinancesStore.getState().byPage[transactionsPageKey(PAGE_QUERY)];
      expect(entry.data).toEqual({ transactions: janTransactions, total: 57 });
      expect(entry.error).toBeNull();
    });

    it("sets error on DAL failure", async () => {
      vi.mocked(financesDal.getTransactionsPage).mockRejectedValue(
        new Error("boom"),
      );

      await useFinancesStore.getState().fetchTransactionsPage(PAGE_QUERY);

      const entry =
        useFinancesStore.getState().byPage[transactionsPageKey(PAGE_QUERY)];
      expect(entry.error).toBeTruthy();
      expect(entry.data).toBeNull();
    });

    it("keeps client data when seeding the same page", () => {
      const store = useFinancesStore.getState();
      const client = { transactions: janTransactions as never, total: 3 };

      store.seedTransactionsPage(PAGE_QUERY, client);
      store.seedTransactionsPage(PAGE_QUERY, { transactions: [], total: 0 });

      expect(
        useFinancesStore.getState().byPage[transactionsPageKey(PAGE_QUERY)]
          .data,
      ).toEqual(client);
    });
  });

  describe("fetchFinancialSummary", () => {
    it("computes summary with correct aggregation", async () => {
      vi.mocked(financesDal.getTransactions).mockResolvedValueOnce(
        janTransactions as never,
      );
      vi.mocked(financesDal.getTransactions).mockResolvedValueOnce(
        decTransactions as never,
      );

      await useFinancesStore
        .getState()
        .fetchFinancialSummary(new Date("2024-01-01"));

      const key = summaryKey(new Date("2024-01-01"));
      const entry = useFinancesStore.getState().summaryByKey[key];

      expect(entry.data?.income).toBe(375);
      expect(entry.data?.expenses).toBe(80);
      expect(entry.data?.net).toBe(295);
      expect(entry.data?.previousNet).toBe(400);
      expect(entry.data?.difference).toBe(-105);
      expect(entry.error).toBeNull();
    });

    it("buckets transactions into correct weeks", async () => {
      vi.mocked(financesDal.getTransactions).mockResolvedValueOnce(
        janTransactions as never,
      );
      vi.mocked(financesDal.getTransactions).mockResolvedValueOnce([] as never);

      await useFinancesStore
        .getState()
        .fetchFinancialSummary(new Date("2024-01-01"));

      const key = summaryKey(new Date("2024-01-01"));
      const { weekly } = useFinancesStore.getState().summaryByKey[key].data!;

      expect(weekly[0]).toEqual({ week: 1, income: 100, expenses: 0 });
      expect(weekly[1]).toEqual({ week: 2, income: 0, expenses: 50 });
      expect(weekly[2]).toEqual({ week: 3, income: 200, expenses: 0 });
      expect(weekly[3]).toEqual({ week: 4, income: 0, expenses: 30 });
      expect(weekly[4]).toEqual({ week: 5, income: 75, expenses: 0 });
    });

    it("sets error on DAL failure", async () => {
      vi.mocked(financesDal.getTransactions).mockRejectedValue(
        new Error("network error"),
      );

      await useFinancesStore
        .getState()
        .fetchFinancialSummary(new Date("2024-01-01"));

      const key = summaryKey(new Date("2024-01-01"));
      const entry = useFinancesStore.getState().summaryByKey[key];
      expect(entry.error).toBeTruthy();
      expect(entry.loading).toBe(false);
    });
  });

  describe("createTransaction", () => {
    it("inserts and invalidates all cached keys", async () => {
      const pageQuery = {
        from: "2024-06-01",
        to: "2024-06-30",
        type: "all" as const,
        category: "",
        search: "",
        page: 0,
        pageSize: 20,
      };
      const sumKey = summaryKey(JUN_2024);

      useFinancesStore.setState({
        byPage: {
          [transactionsPageKey(pageQuery)]: {
            data: { transactions: [], total: 0 },
            loading: false,
            error: null,
          },
        },
        categoriesByRange: {
          "2024-06-01:2024-06-30": {
            data: ["Vieja"],
            loading: false,
            error: null,
          },
        },
        summaryByKey: {
          [sumKey]: {
            data: {
              income: 0,
              expenses: 0,
              net: 0,
              previousNet: 0,
              difference: 0,
              weekly: [],
              breakdown: [],
            },
            loading: false,
            error: null,
          },
        },
      });

      vi.mocked(financesDal.insertTransaction).mockResolvedValue(
        mockTransaction as never,
      );
      vi.mocked(financesDal.getTransactions).mockResolvedValue([]);
      vi.mocked(financesDal.getTransactionsPage).mockResolvedValue({
        transactions: [],
        total: 1,
      });
      vi.mocked(financesDal.getTransactionCategories).mockResolvedValue([
        "Vieja",
        "Nueva",
      ]);

      await useFinancesStore.getState().createTransaction({
        clinic_id: CLINIC_ID,
        appointment_id: null,
        type: "income",
        category: "Nueva",
        amount: 300,
        description: "extra",
        date: "2024-06-15",
        created_by: "emp-1",
      });

      expect(financesDal.insertTransaction).toHaveBeenCalled();
      // La página en caché, sus categorías y el resumen se releen: el total
      // cambia al insertar y la categoría nueva tiene que aparecer en el filtro.
      expect(financesDal.getTransactionsPage).toHaveBeenCalled();
      expect(financesDal.getTransactionCategories).toHaveBeenCalled();
      expect(financesDal.getTransactions).toHaveBeenCalledTimes(2);
      expect(useFinancesStore.getState().creating).toBe(false);
      expect(useFinancesStore.getState().createError).toBeNull();
    });

    it("sets createError on DAL failure", async () => {
      vi.mocked(financesDal.insertTransaction).mockRejectedValue(
        new Error("insert failed"),
      );

      await expect(
        useFinancesStore.getState().createTransaction({
          clinic_id: CLINIC_ID,
          appointment_id: null,
          type: "income",
          category: null,
          amount: 100,
          description: null,
          date: "2024-06-15",
          created_by: "emp-1",
        }),
      ).rejects.toThrow("insert failed");

      expect(useFinancesStore.getState().creating).toBe(false);
      expect(useFinancesStore.getState().createError).toBeTruthy();
    });
  });

  describe("transactionsPageKey", () => {
    it("normalises the search so casing and spacing do not split the cache", () => {
      const base = {
        from: "2024-06-01",
        to: "2024-06-30",
        type: "all" as const,
        category: "",
        page: 0,
        pageSize: 20,
      };

      expect(transactionsPageKey({ ...base, search: "  Luz  " })).toBe(
        transactionsPageKey({ ...base, search: "luz" }),
      );
    });

    it("separates pages and filters", () => {
      const base = {
        from: "2024-06-01",
        to: "2024-06-30",
        type: "all" as const,
        category: "",
        search: "",
        pageSize: 20,
      };

      expect(transactionsPageKey({ ...base, page: 0 })).not.toBe(
        transactionsPageKey({ ...base, page: 1 }),
      );
      expect(transactionsPageKey({ ...base, page: 0 })).not.toBe(
        transactionsPageKey({ ...base, page: 0, category: "Luz" }),
      );
    });
  });

  describe("transactionsToCsv", () => {
    it("converts transactions to CSV string", () => {
      const csv = transactionsToCsv([jan3, jan10]);
      const lines = csv.split("\n");

      expect(lines[0]).toBe('"date","type","category","amount","description"');
      expect(lines[1]).toContain('"2024-01-03"');
      expect(lines[1]).toContain('"income"');
      expect(lines[1]).toContain("100");
      expect(lines[2]).toContain('"2024-01-10"');
      expect(lines[2]).toContain('"expense"');
    });

    it("escapes double quotes in values", () => {
      const withQuotes = { ...jan3, description: 'texto "con" comillas' };
      const csv = transactionsToCsv([withQuotes]);
      expect(csv).toContain('"texto ""con"" comillas"');
    });

    it("handles empty array", () => {
      const csv = transactionsToCsv([]);
      expect(csv).toBe('"date","type","category","amount","description"');
    });
  });
});
