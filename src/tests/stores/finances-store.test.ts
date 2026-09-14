import { describe, it, expect, beforeEach, vi } from "vitest";

import * as financesDal from "@/dal/finances.dal";
import { transactionsToCsv } from "@/lib/finances-csv";
import {
  useFinancesStore,
  transactionsPageKey,
  summaryKey,
} from "@/stores/finances-store";
import { CLINIC_ID } from "@/tests/mocks";

vi.mock("@/dal/finances.dal", () => ({
  getTransactionsPage: vi.fn(),
  getTransactions: vi.fn(),
  getTransactionsForExport: vi.fn(),
  insertTransaction: vi.fn(),
  updateTransaction: vi.fn(),
}));

vi.mock("@/lib/active-clinic-id", () => ({
  getActiveClinicId: () => "00000000-0000-0000-0000-000000000001",
}));

vi.mock("@/lib/logger", () => ({
  logger: { captureException: vi.fn() },
}));

const JUN_2024 = new Date("2024-06-01");

const jan3 = {
  id: "t1",
  clinic_id: CLINIC_ID,
  type: "income" as const,
  category_id: "cat-consulta",
  category: {
    id: "cat-consulta",
    type: "income" as const,
    name: "Consulta",
    is_active: true,
  },
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
  category_id: "cat-material",
  category: {
    id: "cat-material",
    type: "expense" as const,
    name: "Material",
    is_active: true,
  },
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
  category_id: "cat-tratamiento",
  category: {
    id: "cat-tratamiento",
    type: "income" as const,
    name: "Tratamiento",
    is_active: true,
  },
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
  category_id: "cat-limpieza",
  category: {
    id: "cat-limpieza",
    type: "expense" as const,
    name: "Limpieza",
    is_active: true,
  },
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
  category_id: "cat-consulta",
  category: {
    id: "cat-consulta",
    type: "income" as const,
    name: "Consulta",
    is_active: true,
  },
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
  category_id: "cat-consulta",
  category: {
    id: "cat-consulta",
    type: "income" as const,
    name: "Consulta",
    is_active: true,
  },
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
  category_id: "cat-alquiler",
  category: {
    id: "cat-alquiler",
    type: "expense" as const,
    name: "Alquiler",
    is_active: true,
  },
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
  category_id: "cat-nueva",
  category: {
    id: "cat-nueva",
    type: "income" as const,
    name: "Nueva",
    is_active: true,
  },
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
  summaryByKey: {},
  creating: false,
  createError: null,
  exporting: false,
  exportError: null,
};

describe("finances-store", () => {
  beforeEach(() => {
    useFinancesStore.setState(initialState);
  });

  it("has correct initial state", () => {
    const state = useFinancesStore.getState();
    expect(state.byPage).toEqual({});
    expect(state.summaryByKey).toEqual({});
    expect(state.creating).toBe(false);
    expect(state.createError).toBeNull();
    expect(state.exporting).toBe(false);
    expect(state.exportError).toBeNull();
  });

  describe("fetchTransactionsPage", () => {
    const PAGE_QUERY = {
      from: "2024-01-01",
      to: "2024-01-31",
      type: "all" as const,
      categoryId: "",
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
    it("applies the category to current and previous month metrics", async () => {
      vi.mocked(financesDal.getTransactions).mockResolvedValue([]);

      await useFinancesStore
        .getState()
        .fetchFinancialSummary(new Date("2024-01-01"), "cat-consulta");

      expect(financesDal.getTransactions).toHaveBeenNthCalledWith(
        1,
        "2024-01-01",
        "2024-01-31",
        "all",
        "cat-consulta",
      );
      expect(financesDal.getTransactions).toHaveBeenNthCalledWith(
        2,
        "2023-12-01",
        "2023-12-31",
        "all",
        "cat-consulta",
      );
      expect(
        useFinancesStore.getState().summaryByKey[
          summaryKey(new Date("2024-01-01"), "cat-consulta")
        ].error,
      ).toBeNull();
    });

    it("computes summary with correct aggregation", async () => {
      vi.mocked(financesDal.getTransactions).mockResolvedValueOnce(
        janTransactions as never,
      );
      vi.mocked(financesDal.getTransactions).mockResolvedValueOnce(
        decTransactions as never,
      );

      await useFinancesStore
        .getState()
        .fetchFinancialSummary(new Date("2024-01-01"), "");

      const key = summaryKey(new Date("2024-01-01"), "");
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
        .fetchFinancialSummary(new Date("2024-01-01"), "");

      const key = summaryKey(new Date("2024-01-01"), "");
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
        .fetchFinancialSummary(new Date("2024-01-01"), "");

      const key = summaryKey(new Date("2024-01-01"), "");
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
        categoryId: "",
        search: "",
        page: 0,
        pageSize: 20,
      };
      const sumKey = summaryKey(JUN_2024, "");

      useFinancesStore.setState({
        byPage: {
          [transactionsPageKey(pageQuery)]: {
            data: { transactions: [], total: 0 },
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
      await useFinancesStore.getState().createTransaction({
        clinic_id: CLINIC_ID,
        appointment_id: null,
        type: "income",
        category_id: "cat-nueva",
        amount: 300,
        description: "extra",
        date: "2024-06-15",
        created_by: "emp-1",
      });

      expect(financesDal.insertTransaction).toHaveBeenCalled();
      expect(financesDal.getTransactionsPage).toHaveBeenCalled();
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
          category_id: null,
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

  describe("exportTransactions", () => {
    it("exports every row returned for the active clinic and filters", async () => {
      vi.mocked(financesDal.getTransactionsForExport).mockResolvedValue(
        janTransactions as never,
      );
      const query = {
        from: "2024-01-01",
        to: "2024-01-31",
        type: "all" as const,
        categoryIds: ["cat-consulta", "cat-material"],
      };

      const result = await useFinancesStore
        .getState()
        .exportTransactions(query);

      expect(result).toEqual(janTransactions);
      expect(financesDal.getTransactionsForExport).toHaveBeenCalledWith({
        ...query,
        clinicId: CLINIC_ID,
      });
      expect(useFinancesStore.getState().exporting).toBe(false);
      expect(useFinancesStore.getState().exportError).toBeNull();
    });

    it("exposes and rethrows export failures", async () => {
      vi.mocked(financesDal.getTransactionsForExport).mockRejectedValue(
        new Error("export failed"),
      );

      await expect(
        useFinancesStore.getState().exportTransactions({
          from: "2024-01-01",
          to: "2024-01-31",
          type: "income",
          categoryIds: [],
        }),
      ).rejects.toThrow("export failed");

      expect(useFinancesStore.getState().exporting).toBe(false);
      expect(useFinancesStore.getState().exportError?.message).toBe(
        "export failed",
      );
    });
  });

  describe("transactionsPageKey", () => {
    it("normalises the search so casing and spacing do not split the cache", () => {
      const base = {
        from: "2024-06-01",
        to: "2024-06-30",
        type: "all" as const,
        categoryId: "",
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
        categoryId: "",
        search: "",
        pageSize: 20,
      };

      expect(transactionsPageKey({ ...base, page: 0 })).not.toBe(
        transactionsPageKey({ ...base, page: 1 }),
      );
      expect(transactionsPageKey({ ...base, page: 0 })).not.toBe(
        transactionsPageKey({ ...base, page: 0, categoryId: "cat-luz" }),
      );
    });
  });

  describe("transactionsToCsv", () => {
    it("uses the Excel-compatible Spanish format", () => {
      const csv = transactionsToCsv([jan3, jan10]);
      const lines = csv.split("\r\n");

      expect(lines[0]).toBe(
        '\uFEFF"Fecha";"Tipo";"Categoría";"Concepto";"Importe (€)"',
      );
      expect(lines[1]).toBe('"03/01/2024";"Cobro";"Consulta";"";100,00');
      expect(lines[2]).toBe('"10/01/2024";"Gasto";"Material";"";50,00');
    });

    it("escapes quotes, separators, accents and line breaks", () => {
      const special = {
        ...jan3,
        category: { ...jan3.category, name: "Sesión; revisión" },
        description: 'Línea 1\nLínea "2"',
      };
      const csv = transactionsToCsv([special]);

      expect(csv).toContain('"Sesión; revisión"');
      expect(csv).toContain('"Línea 1\r\nLínea ""2"""');
    });

    it("neutralizes spreadsheet formulas in text fields", () => {
      const formula = {
        ...jan3,
        category: { ...jan3.category, name: "=DDE()" },
        description: "+SUM(1;1)",
      };
      const csv = transactionsToCsv([formula]);

      expect(csv).toContain('"\'=DDE()"');
      expect(csv).toContain('"\'+SUM(1;1)"');
    });

    it("handles empty array", () => {
      const csv = transactionsToCsv([]);
      expect(csv).toBe(
        '\uFEFF"Fecha";"Tipo";"Categoría";"Concepto";"Importe (€)"',
      );
    });
  });
});
