import { describe, it, expect, beforeEach, vi } from "vitest";

import * as inventoryDal from "@/dal/inventory.dal";
import { useInventoryStore } from "@/stores/inventory-store";
import { emptyQueryEntry } from "@/stores/query-state";
import {
  mockInventoryItem,
  CLINIC_ID,
  ITEM_ID,
  EMPLOYEE_ID,
} from "@/tests/mocks";

vi.mock("@/dal/inventory.dal", () => ({
  getInventoryItems: vi.fn(),
  getInventoryItem: vi.fn(),
  getInventoryMovements: vi.fn(),
  insertInventoryItem: vi.fn(),
  insertInventoryMovement: vi.fn(),
}));

vi.mock("@/lib/active-clinic-id", () => ({
  getActiveClinicId: () => CLINIC_ID,
}));

vi.mock("@/lib/logger", () => ({
  logger: { captureException: vi.fn() },
}));

const initialState = {
  list: emptyQueryEntry<never>(),
  byId: {},
  movementsByItemId: {},
  creating: false,
  createError: null,
  recording: false,
  recordError: null,
};

describe("inventory-store", () => {
  beforeEach(() => {
    useInventoryStore.setState(initialState);
  });

  it("has correct initial state", () => {
    const state = useInventoryStore.getState();
    expect(state.list.data).toBeNull();
    expect(state.list.loading).toBe(false);
    expect(state.list.error).toBeNull();
    expect(state.byId).toEqual({});
    expect(state.creating).toBe(false);
    expect(state.createError).toBeNull();
  });

  it("fetchInventoryItems sets data on success", async () => {
    vi.mocked(inventoryDal.getInventoryItems).mockResolvedValue([
      mockInventoryItem as never,
    ]);

    await useInventoryStore.getState().fetchInventoryItems();

    const { list } = useInventoryStore.getState();
    expect(list.data).toEqual([mockInventoryItem]);
    expect(list.error).toBeNull();
    expect(list.loading).toBe(false);
    expect(inventoryDal.getInventoryItems).toHaveBeenCalledWith(CLINIC_ID);
  });

  it("fetchInventoryItems sets error on DAL failure", async () => {
    vi.mocked(inventoryDal.getInventoryItems).mockRejectedValue(
      new Error("connection refused"),
    );

    await useInventoryStore.getState().fetchInventoryItems();

    const { list } = useInventoryStore.getState();
    expect(list.error).toBeTruthy();
    expect(list.data).toBeNull();
  });

  it("fetchInventoryItem sets data in byId", async () => {
    vi.mocked(inventoryDal.getInventoryItem).mockResolvedValue(
      mockInventoryItem as never,
    );

    await useInventoryStore.getState().fetchInventoryItem(ITEM_ID);

    const entry = useInventoryStore.getState().byId[ITEM_ID];
    expect(entry.data).toEqual(mockInventoryItem);
    expect(entry.error).toBeNull();
  });

  it("createInventoryItem inserts and refetches list", async () => {
    vi.mocked(inventoryDal.insertInventoryItem).mockResolvedValue(
      mockInventoryItem as never,
    );
    vi.mocked(inventoryDal.getInventoryItems).mockResolvedValue([
      mockInventoryItem as never,
    ]);

    const result = await useInventoryStore.getState().createInventoryItem({
      clinic_id: CLINIC_ID,
      name: "Jeringuilla",
      category: "Material",
      unit: "ud",
      stock: 10,
      min_stock: 5,
      unit_price: 0.5,
    });

    expect(result).toEqual(mockInventoryItem);
    expect(inventoryDal.insertInventoryItem).toHaveBeenCalled();
    expect(inventoryDal.getInventoryItems).toHaveBeenCalled();
    expect(useInventoryStore.getState().creating).toBe(false);
    expect(useInventoryStore.getState().createError).toBeNull();
  });

  it("createInventoryItem sets createError on DAL failure", async () => {
    vi.mocked(inventoryDal.insertInventoryItem).mockRejectedValue(
      new Error("unique constraint"),
    );

    await expect(
      useInventoryStore.getState().createInventoryItem({
        clinic_id: CLINIC_ID,
        name: "Jeringuilla",
        category: null,
        unit: null,
        stock: 10,
        min_stock: 5,
        unit_price: null,
      }),
    ).rejects.toThrow("unique constraint");

    expect(useInventoryStore.getState().createError).toBeTruthy();
    expect(useInventoryStore.getState().creating).toBe(false);
  });

  it("recordInventoryMovement inserts and refreshes item state", async () => {
    vi.mocked(inventoryDal.insertInventoryMovement).mockResolvedValue(
      undefined,
    );
    vi.mocked(inventoryDal.getInventoryItems).mockResolvedValue([
      mockInventoryItem as never,
    ]);
    vi.mocked(inventoryDal.getInventoryItem).mockResolvedValue(
      mockInventoryItem as never,
    );
    vi.mocked(inventoryDal.getInventoryMovements).mockResolvedValue([]);

    await useInventoryStore.getState().recordInventoryMovement({
      item_id: ITEM_ID,
      employee_id: EMPLOYEE_ID,
      type: "entrada",
      quantity: 5,
      notes: null,
    });

    expect(inventoryDal.insertInventoryMovement).toHaveBeenCalled();
    expect(inventoryDal.getInventoryItems).toHaveBeenCalled();
    expect(inventoryDal.getInventoryItem).toHaveBeenCalledWith(ITEM_ID);
    expect(useInventoryStore.getState().recording).toBe(false);
    expect(useInventoryStore.getState().recordError).toBeNull();
  });
});
