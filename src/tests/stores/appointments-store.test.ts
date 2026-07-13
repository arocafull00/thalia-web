import { describe, it, expect, beforeEach, vi } from "vitest";

import * as appointmentsDal from "@/dal/appointments.dal";
import * as treatmentsDal from "@/dal/treatments.dal";
import {
  useAppointmentsStore,
  appointmentsKey,
} from "@/stores/appointments-store";
import {
  mockAppointment,
  mockTreatment,
  CLINIC_ID,
  PATIENT_ID,
  EMPLOYEE_ID,
  TREATMENT_ID,
  APPOINTMENT_ID,
} from "@/tests/mocks";

vi.mock("@/lib/supabase", () => ({
  supabase: {
    auth: { getSession: vi.fn() },
    channel: vi.fn(() => ({
      on: vi.fn().mockReturnThis(),
      subscribe: vi.fn(),
    })),
    removeChannel: vi.fn(),
  },
  assertSupabaseConfigured: vi.fn(),
}));

vi.mock("@/dal/appointments.dal", () => ({
  getAppointments: vi.fn(),
  getAppointment: vi.fn(),
  getAppointmentInventoryItems: vi.fn(),
  getDefaultMaterials: vi.fn(),
  insertAppointment: vi.fn(),
  insertAppointmentTreatments: vi.fn(),
  updateAppointment: vi.fn(),
  updateAppointmentStatus: vi.fn(),
  deleteAppointmentTreatments: vi.fn(),
  rescheduleAppointment: vi.fn(),
  replaceAppointmentInventoryItems: vi.fn(),
}));

vi.mock("@/dal/treatments.dal", () => ({
  getTreatmentsByIds: vi.fn(),
}));

vi.mock("@/lib/active-clinic-id", () => ({
  getActiveClinicId: () => CLINIC_ID,
}));

vi.mock("@/lib/logger", () => ({
  logger: { captureException: vi.fn() },
}));

vi.mock("@/stores/dashboard-store", () => ({
  useDashboardStore: {
    getState: vi.fn(() => ({
      fetchDashboard: vi.fn().mockResolvedValue(undefined),
    })),
  },
}));

vi.mock("@/stores/inventory-store", () => ({
  useInventoryStore: {
    getState: vi.fn(() => ({
      fetchInventoryItems: vi.fn().mockResolvedValue(undefined),
    })),
  },
}));

const initialState = {
  byRange: {},
  byId: {},
  appointmentInventoryById: {},
  defaultMaterialsByKey: {},
  replacingInventory: false,
  replaceInventoryError: null,
  creating: false,
  createError: null,
  updatingStatus: false,
  updateStatusError: null,
  rescheduling: false,
  rescheduleError: null,
  updating: false,
  updateError: null,
};

const start = new Date("2030-06-01T00:00:00Z");
const end = new Date("2030-06-30T23:59:59Z");

describe("appointments-store", () => {
  beforeEach(() => {
    useAppointmentsStore.setState(initialState);
  });

  it("has correct initial state", () => {
    const state = useAppointmentsStore.getState();
    expect(state.byRange).toEqual({});
    expect(state.creating).toBe(false);
    expect(state.createError).toBeNull();
    expect(state.updatingStatus).toBe(false);
  });

  it("fetchAppointments sets data on success", async () => {
    vi.mocked(appointmentsDal.getAppointments).mockResolvedValue([
      mockAppointment as never,
    ]);

    await useAppointmentsStore
      .getState()
      .fetchAppointments({ start, end, employeeId: null });

    const key = appointmentsKey(start.toISOString(), end.toISOString(), null);
    const entry = useAppointmentsStore.getState().byRange[key];
    expect(entry.data).toEqual([mockAppointment]);
    expect(entry.error).toBeNull();
    expect(entry.loading).toBe(false);
  });

  it("fetchAppointments sets error on DAL failure", async () => {
    vi.mocked(appointmentsDal.getAppointments).mockRejectedValue(
      new Error("DB error"),
    );

    await useAppointmentsStore
      .getState()
      .fetchAppointments({ start, end, employeeId: null });

    const key = appointmentsKey(start.toISOString(), end.toISOString(), null);
    const entry = useAppointmentsStore.getState().byRange[key];
    expect(entry.error).toBeTruthy();
    expect(entry.data).toBeNull();
  });

  it("createAppointment inserts appointment and treatments", async () => {
    vi.mocked(treatmentsDal.getTreatmentsByIds).mockResolvedValue([
      mockTreatment as never,
    ]);
    vi.mocked(appointmentsDal.insertAppointment).mockResolvedValue(
      mockAppointment as never,
    );
    vi.mocked(appointmentsDal.insertAppointmentTreatments).mockResolvedValue(
      undefined,
    );

    const futureDate = new Date(Date.now() + 86_400_000);

    const result = await useAppointmentsStore.getState().createAppointment({
      clinicId: CLINIC_ID,
      patientId: PATIENT_ID,
      employeeId: EMPLOYEE_ID,
      startsAt: futureDate,
      treatmentIds: [TREATMENT_ID],
      notes: null,
    });

    expect(result).toEqual(mockAppointment);
    expect(appointmentsDal.insertAppointment).toHaveBeenCalled();
    expect(appointmentsDal.insertAppointmentTreatments).toHaveBeenCalled();
    expect(useAppointmentsStore.getState().creating).toBe(false);
    expect(useAppointmentsStore.getState().createError).toBeNull();
  });

  it("createAppointment sets createError on DAL failure", async () => {
    vi.mocked(treatmentsDal.getTreatmentsByIds).mockResolvedValue([
      mockTreatment as never,
    ]);
    vi.mocked(appointmentsDal.insertAppointment).mockRejectedValue(
      new Error("insert failed"),
    );

    const futureDate = new Date(Date.now() + 86_400_000);

    await expect(
      useAppointmentsStore.getState().createAppointment({
        clinicId: CLINIC_ID,
        patientId: PATIENT_ID,
        employeeId: EMPLOYEE_ID,
        startsAt: futureDate,
        treatmentIds: [TREATMENT_ID],
        notes: null,
      }),
    ).rejects.toThrow("insert failed");

    expect(useAppointmentsStore.getState().createError).toBeTruthy();
    expect(useAppointmentsStore.getState().creating).toBe(false);
  });

  it("updateAppointmentStatus sets status and clears loading", async () => {
    vi.mocked(appointmentsDal.updateAppointmentStatus).mockResolvedValue({
      ...mockAppointment,
      status: "completed",
    } as never);
    vi.mocked(appointmentsDal.getAppointment).mockResolvedValue(
      mockAppointment as never,
    );

    const result = await useAppointmentsStore
      .getState()
      .updateAppointmentStatus(APPOINTMENT_ID, "completed");

    expect(result.status).toBe("completed");
    expect(useAppointmentsStore.getState().updatingStatus).toBe(false);
    expect(useAppointmentsStore.getState().updateStatusError).toBeNull();
  });
});
