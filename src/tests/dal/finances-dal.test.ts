import { beforeEach, describe, expect, it, vi } from "vitest";

import { getTransactionsForExport } from "@/dal/finances.dal";
import { CLINIC_ID } from "@/tests/mocks";

const supabaseMock = vi.hoisted(() => ({
  from: vi.fn(),
}));

vi.mock("@/lib/supabase", () => ({
  supabase: supabaseMock,
}));

function transactionRow(id: number) {
  return {
    id: `transaction-${id}`,
    clinic_id: CLINIC_ID,
    appointment_id: null,
    type: "income" as const,
    category_id: "00000000-0000-0000-0000-000000000002",
    amount: 25,
    description: null,
    date: "2026-09-01",
    created_by: "00000000-0000-0000-0000-000000000003",
    created_at: null,
    updated_at: null,
    category: null,
  };
}

describe("getTransactionsForExport", () => {
  beforeEach(() => {
    supabaseMock.from.mockReset();
  });

  it("loads every matching transaction in stable 1000-row batches", async () => {
    const ranges: Array<[number, number]> = [];
    const filters: Array<[string, unknown]> = [];
    const categoryFilters: string[][] = [];
    const batches = [
      Array.from({ length: 1000 }, (_, index) => transactionRow(index)),
      [transactionRow(1000)],
    ];

    supabaseMock.from.mockImplementation(() => {
      const batch = batches[supabaseMock.from.mock.calls.length - 1];
      const builder = {
        select: vi.fn(() => builder),
        eq: vi.fn((column: string, value: unknown) => {
          filters.push([column, value]);
          return builder;
        }),
        gte: vi.fn((column: string, value: unknown) => {
          filters.push([column, value]);
          return builder;
        }),
        lte: vi.fn((column: string, value: unknown) => {
          filters.push([column, value]);
          return builder;
        }),
        order: vi.fn(() => builder),
        range: vi.fn((from: number, to: number) => {
          ranges.push([from, to]);
          return builder;
        }),
        in: vi.fn((_column: string, values: string[]) => {
          categoryFilters.push(values);
          return builder;
        }),
        then: (resolve: (value: unknown) => void) =>
          resolve({ data: batch, error: null }),
      };

      return builder;
    });

    const result = await getTransactionsForExport({
      clinicId: CLINIC_ID,
      from: "2026-09-01",
      to: "2026-09-30",
      type: "income",
      categoryIds: ["00000000-0000-0000-0000-000000000002"],
    });

    expect(result).toHaveLength(1001);
    expect(ranges).toEqual([
      [0, 999],
      [1000, 1999],
    ]);
    expect(filters).toContainEqual(["clinic_id", CLINIC_ID]);
    expect(filters).toContainEqual(["type", "income"]);
    expect(categoryFilters).toEqual([
      ["00000000-0000-0000-0000-000000000002"],
      ["00000000-0000-0000-0000-000000000002"],
    ]);
  });
});
