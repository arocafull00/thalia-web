import { describe, it, expect, beforeEach, vi } from "vitest";

import * as patientsDal from "@/dal/patients.dal";
import { usePatientsStore } from "@/stores/patients-store";
import { mockPatient, CLINIC_ID, PATIENT_ID } from "@/tests/mocks";

vi.mock("@/dal/patients.dal", () => ({
  getPatients: vi.fn(),
  getPatient: vi.fn(),
  insertPatient: vi.fn(),
  updatePatient: vi.fn(),
  getPatientAppointments: vi.fn(),
  getUpcomingPatientAppointments: vi.fn(),
}));

vi.mock("@/lib/active-clinic-id", () => ({
  getActiveClinicId: () => CLINIC_ID,
}));

vi.mock("@/lib/logger", () => ({
  logger: { captureException: vi.fn() },
}));

vi.mock("@/lib/storage", () => ({
  uploadFile: vi.fn(),
}));

const initialState = {
  listBySearch: {},
  byId: {},
  appointmentsByPatientId: {},
  upcomingByPatientId: {},
  creating: false,
  createError: null,
  updating: false,
  updateError: null,
  uploadingAvatar: false,
  uploadAvatarError: null,
};

describe("patients-store", () => {
  beforeEach(() => {
    usePatientsStore.setState(initialState);
  });

  it("has correct initial state", () => {
    const state = usePatientsStore.getState();
    expect(state.listBySearch).toEqual({});
    expect(state.byId).toEqual({});
    expect(state.creating).toBe(false);
    expect(state.createError).toBeNull();
  });

  it("fetchPatients sets data under __all__ key on empty search", async () => {
    vi.mocked(patientsDal.getPatients).mockResolvedValue([
      mockPatient as never,
    ]);

    await usePatientsStore.getState().fetchPatients("");

    const entry = usePatientsStore.getState().listBySearch["__all__"];
    expect(entry.data).toEqual([mockPatient]);
    expect(entry.error).toBeNull();
    expect(entry.loading).toBe(false);
    expect(patientsDal.getPatients).toHaveBeenCalledWith(CLINIC_ID, "");
  });

  it("fetchPatients sets error on DAL failure", async () => {
    vi.mocked(patientsDal.getPatients).mockRejectedValue(new Error("timeout"));

    await usePatientsStore.getState().fetchPatients("");

    const entry = usePatientsStore.getState().listBySearch["__all__"];
    expect(entry.error).toBeTruthy();
    expect(entry.data).toBeNull();
  });

  it("fetchPatient sets data in byId", async () => {
    vi.mocked(patientsDal.getPatient).mockResolvedValue(mockPatient as never);

    await usePatientsStore.getState().fetchPatient(PATIENT_ID);

    const entry = usePatientsStore.getState().byId[PATIENT_ID];
    expect(entry.data).toEqual(mockPatient);
    expect(entry.error).toBeNull();
  });

  it("createPatient calls insertPatient and clears creating flag", async () => {
    vi.mocked(patientsDal.insertPatient).mockResolvedValue(
      mockPatient as never,
    );

    const result = await usePatientsStore.getState().createPatient({
      clinic_id: CLINIC_ID,
      full_name: "Carlos López",
      dni: null,
      birth_date: null,
      phone: null,
      email: null,
      address: null,
      notes: null,
      marketing_opt_in: false,
    });

    expect(result).toEqual(mockPatient);
    expect(patientsDal.insertPatient).toHaveBeenCalled();
    expect(usePatientsStore.getState().creating).toBe(false);
    expect(usePatientsStore.getState().createError).toBeNull();
  });

  it("createPatient sets createError on DAL failure", async () => {
    vi.mocked(patientsDal.insertPatient).mockRejectedValue(
      new Error("insert failed"),
    );

    await expect(
      usePatientsStore.getState().createPatient({
        clinic_id: CLINIC_ID,
        full_name: "Carlos López",
        dni: null,
        birth_date: null,
        phone: null,
        email: null,
        address: null,
        notes: null,
        marketing_opt_in: false,
      }),
    ).rejects.toThrow("insert failed");

    expect(usePatientsStore.getState().createError).toBeTruthy();
    expect(usePatientsStore.getState().creating).toBe(false);
  });

  it("updatePatient calls updatePatient DAL and refreshes byId", async () => {
    const updated = { ...mockPatient, full_name: "Carlos M. López" };
    vi.mocked(patientsDal.updatePatient).mockResolvedValue(updated as never);
    vi.mocked(patientsDal.getPatient).mockResolvedValue(updated as never);

    const result = await usePatientsStore
      .getState()
      .updatePatient(PATIENT_ID, { full_name: "Carlos M. López" });

    expect(result.full_name).toBe("Carlos M. López");
    expect(patientsDal.updatePatient).toHaveBeenCalledWith(PATIENT_ID, {
      full_name: "Carlos M. López",
    });
    expect(usePatientsStore.getState().updating).toBe(false);
  });
});
