import { describe, it, expect, beforeEach, vi } from "vitest";

import * as dashboardDal from "@/dal/dashboard.dal";
import { useDashboardStore } from "@/stores/dashboard-store";
import { CLINIC_ID } from "@/tests/mocks";

vi.mock("@/dal/dashboard.dal", () => ({
  getTodayAppointments: vi.fn(),
}));

vi.mock("@/lib/active-clinic-id", () => ({
  getActiveClinicId: () => CLINIC_ID,
}));

vi.mock("@/lib/logger", () => ({
  logger: { captureException: vi.fn() },
}));

const mockAppointment = {
  id: "apt-1",
  clinic_id: CLINIC_ID,
  patient_id: "patient-1",
  employee_id: "emp-1",
  starts_at: "2030-06-01T10:00:00Z",
  ends_at: "2030-06-01T11:00:00Z",
  status: "scheduled",
  notes: null,
  reminder_sent: null,
  created_at: null,
  updated_at: null,
  patients: { id: "patient-1", full_name: "Carlos López", phone: null },
  employees: { id: "emp-1", full_name: "Dr. García", color: "#6366f1" },
  appointment_treatments: [],
};

describe("dashboard-store", () => {
  beforeEach(() => {
    useDashboardStore.setState({
      data: { data: null, loading: false, error: null },
    });
  });

  it("has correct initial state", () => {
    const state = useDashboardStore.getState();
    expect(state.data).toEqual({ data: null, loading: false, error: null });
  });

  it("fetchDashboard sets appointments on success", async () => {
    vi.mocked(dashboardDal.getTodayAppointments).mockResolvedValue([
      mockAppointment as never,
    ]);

    await useDashboardStore.getState().fetchDashboard();

    const { data } = useDashboardStore.getState();
    expect(data.data?.appointments).toEqual([mockAppointment]);
    expect(data.error).toBeNull();
    expect(data.loading).toBe(false);
    expect(dashboardDal.getTodayAppointments).toHaveBeenCalledWith(
      expect.any(String),
      expect.any(String),
      CLINIC_ID,
    );
  });

  it("fetchDashboard sets error on DAL failure", async () => {
    vi.mocked(dashboardDal.getTodayAppointments).mockRejectedValue(
      new Error("DB error"),
    );

    await useDashboardStore.getState().fetchDashboard();

    const { data } = useDashboardStore.getState();
    expect(data.error).toBeTruthy();
    expect(data.data).toBeNull();
  });
});
