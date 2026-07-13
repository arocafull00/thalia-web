import { describe, it, expect, beforeEach, vi } from "vitest";

import * as treatmentsDal from "@/dal/treatments.dal";
import { useTreatmentStore } from "@/stores/treatment-store";
import { CLINIC_ID, TREATMENT_ID } from "@/tests/mocks";

vi.mock("@/dal/treatments.dal", () => ({
  getTreatments: vi.fn(),
  getTreatment: vi.fn(),
  insertTreatment: vi.fn(),
  updateTreatment: vi.fn(),
  deleteTreatment: vi.fn(),
  replaceTreatmentInventoryLinks: vi.fn(),
}));

vi.mock("@/lib/logger", () => ({
  logger: { captureException: vi.fn() },
}));

const mockTreatment = {
  id: TREATMENT_ID,
  clinic_id: CLINIC_ID,
  name: "Limpieza dental",
  category: "Limpieza",
  duration_minutes: 60,
  price: 50,
  color: "#6366f1",
  created_at: "2024-01-01T00:00:00Z",
  updated_at: "2024-01-01T00:00:00Z",
  treatment_inventory_items: [],
};

const mockTreatmentWithInventory = {
  ...mockTreatment,
  treatment_inventory_items: [
    {
      id: "inv-link-1",
      treatment_id: TREATMENT_ID,
      inventory_item_id: "item-1",
      quantity: 2,
      created_at: null,
      inventory_items: { id: "item-1", name: "Guantes", unit: "ud" },
    },
  ],
};

const initialState = {
  list: { data: null, loading: false, error: null },
  byId: {},
  creating: false,
  createError: null,
  updating: false,
  updateError: null,
  deleting: false,
  deleteError: null,
};

describe("treatment-store", () => {
  beforeEach(() => {
    useTreatmentStore.setState(initialState);
  });

  it("has correct initial state", () => {
    const state = useTreatmentStore.getState();
    expect(state.list).toEqual({ data: null, loading: false, error: null });
    expect(state.byId).toEqual({});
    expect(state.creating).toBe(false);
    expect(state.createError).toBeNull();
    expect(state.updating).toBe(false);
    expect(state.updateError).toBeNull();
    expect(state.deleting).toBe(false);
    expect(state.deleteError).toBeNull();
  });

  describe("fetchTreatments", () => {
    it("sets list on success", async () => {
      vi.mocked(treatmentsDal.getTreatments).mockResolvedValue([
        mockTreatment as never,
      ]);

      await useTreatmentStore.getState().fetchTreatments();

      const { list } = useTreatmentStore.getState();
      expect(list.data).toEqual([mockTreatment]);
      expect(list.error).toBeNull();
      expect(list.loading).toBe(false);
    });

    it("sets error on DAL failure", async () => {
      vi.mocked(treatmentsDal.getTreatments).mockRejectedValue(
        new Error("DB error"),
      );

      await useTreatmentStore.getState().fetchTreatments();

      const { list } = useTreatmentStore.getState();
      expect(list.error).toBeTruthy();
      expect(list.data).toBeNull();
    });
  });

  describe("fetchTreatment", () => {
    it("sets data in byId on success", async () => {
      vi.mocked(treatmentsDal.getTreatment).mockResolvedValue(
        mockTreatmentWithInventory as never,
      );

      await useTreatmentStore.getState().fetchTreatment(TREATMENT_ID);

      const entry = useTreatmentStore.getState().byId[TREATMENT_ID];
      expect(entry.data).toEqual(mockTreatmentWithInventory);
      expect(entry.error).toBeNull();
    });

    it("sets error in byId on DAL failure", async () => {
      vi.mocked(treatmentsDal.getTreatment).mockRejectedValue(
        new Error("not found"),
      );

      await useTreatmentStore.getState().fetchTreatment(TREATMENT_ID);

      const entry = useTreatmentStore.getState().byId[TREATMENT_ID];
      expect(entry.error).toBeTruthy();
      expect(entry.data).toBeNull();
    });
  });

  describe("createTreatment", () => {
    it("creates treatment with inventory links and refetches list", async () => {
      vi.mocked(treatmentsDal.insertTreatment).mockResolvedValue(
        mockTreatment as never,
      );
      vi.mocked(treatmentsDal.replaceTreatmentInventoryLinks).mockResolvedValue(
        undefined,
      );
      vi.mocked(treatmentsDal.getTreatment).mockResolvedValue(
        mockTreatmentWithInventory as never,
      );
      vi.mocked(treatmentsDal.getTreatments).mockResolvedValue([
        mockTreatment as never,
      ]);

      const result = await useTreatmentStore.getState().createTreatment({
        clinic_id: CLINIC_ID,
        name: "Limpieza dental",
        category: "Limpieza",
        duration_minutes: 60,
        price: 50,
        color: "#6366f1",
        inventoryLinks: [{ inventory_item_id: "item-1", quantity: 2 }],
      });

      expect(result).toEqual(mockTreatmentWithInventory);
      expect(treatmentsDal.insertTreatment).toHaveBeenCalledWith({
        clinic_id: CLINIC_ID,
        name: "Limpieza dental",
        category: "Limpieza",
        duration_minutes: 60,
        price: 50,
        color: "#6366f1",
      });
      expect(treatmentsDal.replaceTreatmentInventoryLinks).toHaveBeenCalledWith(
        TREATMENT_ID,
        [{ inventory_item_id: "item-1", quantity: 2 }],
      );
      expect(treatmentsDal.getTreatment).toHaveBeenCalledWith(TREATMENT_ID);
      expect(treatmentsDal.getTreatments).toHaveBeenCalled();
      expect(useTreatmentStore.getState().creating).toBe(false);
      expect(useTreatmentStore.getState().createError).toBeNull();
    });

    it("rolls back treatment on inventory links failure", async () => {
      vi.mocked(treatmentsDal.insertTreatment).mockResolvedValue(
        mockTreatment as never,
      );
      vi.mocked(treatmentsDal.replaceTreatmentInventoryLinks).mockRejectedValue(
        new Error("FK constraint"),
      );
      vi.mocked(treatmentsDal.deleteTreatment).mockResolvedValue(undefined);

      await expect(
        useTreatmentStore.getState().createTreatment({
          clinic_id: CLINIC_ID,
          name: "Limpieza dental",
          category: null,
          duration_minutes: 60,
          price: null,
          color: null,
          inventoryLinks: [{ inventory_item_id: "bad-item", quantity: 1 }],
        }),
      ).rejects.toThrow("FK constraint");

      expect(treatmentsDal.deleteTreatment).toHaveBeenCalledWith(TREATMENT_ID);
      expect(useTreatmentStore.getState().creating).toBe(false);
      expect(useTreatmentStore.getState().createError).toBeTruthy();
    });

    it("does not rollback if treatment creation itself fails", async () => {
      vi.mocked(treatmentsDal.insertTreatment).mockRejectedValue(
        new Error("insert failed"),
      );

      await expect(
        useTreatmentStore.getState().createTreatment({
          clinic_id: CLINIC_ID,
          name: "Limpieza dental",
          category: null,
          duration_minutes: 60,
          price: null,
          color: null,
          inventoryLinks: [],
        }),
      ).rejects.toThrow("insert failed");

      expect(treatmentsDal.deleteTreatment).not.toHaveBeenCalled();
      expect(useTreatmentStore.getState().creating).toBe(false);
      expect(useTreatmentStore.getState().createError).toBeTruthy();
    });
  });

  describe("updateTreatment", () => {
    it("updates treatment, replaces links, and refetches", async () => {
      vi.mocked(treatmentsDal.updateTreatment).mockResolvedValue(
        mockTreatment as never,
      );
      vi.mocked(treatmentsDal.replaceTreatmentInventoryLinks).mockResolvedValue(
        undefined,
      );
      vi.mocked(treatmentsDal.getTreatment).mockResolvedValue(
        mockTreatmentWithInventory as never,
      );
      vi.mocked(treatmentsDal.getTreatments).mockResolvedValue([
        mockTreatment as never,
      ]);

      const result = await useTreatmentStore
        .getState()
        .updateTreatment(TREATMENT_ID, {
          name: "Limpieza completa",
          category: null,
          duration_minutes: 90,
          price: null,
          color: null,
          inventoryLinks: [],
        });

      expect(result).toEqual(mockTreatmentWithInventory);
      expect(treatmentsDal.updateTreatment).toHaveBeenCalledWith(TREATMENT_ID, {
        name: "Limpieza completa",
        category: null,
        duration_minutes: 90,
        price: null,
        color: null,
      });
      expect(useTreatmentStore.getState().updating).toBe(false);
      expect(useTreatmentStore.getState().updateError).toBeNull();
    });

    it("sets updateError on DAL failure", async () => {
      vi.mocked(treatmentsDal.updateTreatment).mockRejectedValue(
        new Error("update failed"),
      );

      await expect(
        useTreatmentStore.getState().updateTreatment(TREATMENT_ID, {
          name: "Limpieza completa",
          category: null,
          duration_minutes: 90,
          price: null,
          color: null,
          inventoryLinks: [],
        }),
      ).rejects.toThrow("update failed");

      expect(useTreatmentStore.getState().updating).toBe(false);
      expect(useTreatmentStore.getState().updateError).toBeTruthy();
    });
  });

  describe("deleteTreatment", () => {
    it("deletes treatment and removes from byId", async () => {
      useTreatmentStore.setState({
        byId: {
          [TREATMENT_ID]: {
            data: mockTreatmentWithInventory,
            loading: false,
            error: null,
          },
        },
      });
      vi.mocked(treatmentsDal.deleteTreatment).mockResolvedValue(undefined);
      vi.mocked(treatmentsDal.getTreatments).mockResolvedValue([]);

      await useTreatmentStore.getState().deleteTreatment(TREATMENT_ID);

      expect(treatmentsDal.deleteTreatment).toHaveBeenCalledWith(TREATMENT_ID);
      expect(useTreatmentStore.getState().byId[TREATMENT_ID]).toBeUndefined();
      expect(useTreatmentStore.getState().deleting).toBe(false);
      expect(useTreatmentStore.getState().deleteError).toBeNull();
    });

    it("sets deleteError on DAL failure", async () => {
      vi.mocked(treatmentsDal.deleteTreatment).mockRejectedValue(
        new Error("FK constraint"),
      );

      await expect(
        useTreatmentStore.getState().deleteTreatment(TREATMENT_ID),
      ).rejects.toThrow("FK constraint");

      expect(useTreatmentStore.getState().deleting).toBe(false);
      expect(useTreatmentStore.getState().deleteError).toBeTruthy();
    });
  });
});
