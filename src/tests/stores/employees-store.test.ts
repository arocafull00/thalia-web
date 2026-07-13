import { describe, it, expect, beforeEach, vi } from "vitest";

import * as employeesDal from "@/dal/employees.dal";
import { useEmployeesStore } from "@/stores/employees-store";
import { CLINIC_ID, EMPLOYEE_ID } from "@/tests/mocks";

vi.mock("@/dal/employees.dal", () => ({
  getEmployees: vi.fn(),
  getEmployee: vi.fn(),
  getEmployeeAppointments: vi.fn(),
  getEmployeeAppointmentStats: vi.fn(),
  inviteEmployee: vi.fn(),
  updateEmployee: vi.fn(),
}));

vi.mock("@/lib/active-clinic-id", () => ({
  getActiveClinicId: () => CLINIC_ID,
}));

vi.mock("@/lib/logger", () => ({
  logger: { captureException: vi.fn() },
}));

const mockEmployee = {
  id: EMPLOYEE_ID,
  clinic_id: CLINIC_ID,
  full_name: "Ana García",
  phone: null,
  specialty: null,
  color: "#6366f1",
  avatar_url: null,
  role: "doctor",
  email: "ana@clinic.com",
  created_at: "2024-01-01T00:00:00Z",
  updated_at: "2024-01-01T00:00:00Z",
};

const mockStats = { total: 50, completed: 30, upcoming: 10, cancelled: 5 };

const mockAppointmentRow = {
  id: "apt-1",
  clinic_id: CLINIC_ID,
  patient_id: "patient-1",
  employee_id: EMPLOYEE_ID,
  starts_at: "2030-06-01T10:00:00Z",
  ends_at: "2030-06-01T11:00:00Z",
  status: "scheduled",
  notes: null,
  reminder_sent: null,
  created_at: null,
  updated_at: null,
  patients: { id: "patient-1", full_name: "Carlos López" },
};

const initialState = {
  list: { data: null, loading: false, error: null },
  byId: {},
  statsByEmployeeId: {},
  appointmentsByEmployeeId: {},
  creating: false,
  createError: null,
  updating: false,
  updateError: null,
};

describe("employees-store", () => {
  beforeEach(() => {
    useEmployeesStore.setState(initialState);
  });

  it("has correct initial state", () => {
    const state = useEmployeesStore.getState();
    expect(state.list).toEqual({ data: null, loading: false, error: null });
    expect(state.byId).toEqual({});
    expect(state.statsByEmployeeId).toEqual({});
    expect(state.appointmentsByEmployeeId).toEqual({});
    expect(state.creating).toBe(false);
    expect(state.createError).toBeNull();
    expect(state.updating).toBe(false);
    expect(state.updateError).toBeNull();
  });

  describe("fetchEmployees", () => {
    it("sets list on success", async () => {
      vi.mocked(employeesDal.getEmployees).mockResolvedValue([
        mockEmployee as never,
      ]);

      await useEmployeesStore.getState().fetchEmployees();

      const { list } = useEmployeesStore.getState();
      expect(list.data).toEqual([mockEmployee]);
      expect(list.error).toBeNull();
      expect(list.loading).toBe(false);
      expect(employeesDal.getEmployees).toHaveBeenCalledWith(CLINIC_ID);
    });

    it("sets error on DAL failure", async () => {
      vi.mocked(employeesDal.getEmployees).mockRejectedValue(
        new Error("DB error"),
      );

      await useEmployeesStore.getState().fetchEmployees();

      const { list } = useEmployeesStore.getState();
      expect(list.error).toBeTruthy();
      expect(list.data).toBeNull();
    });
  });

  describe("fetchEmployee", () => {
    it("sets data in byId on success", async () => {
      vi.mocked(employeesDal.getEmployee).mockResolvedValue(
        mockEmployee as never,
      );

      await useEmployeesStore.getState().fetchEmployee(EMPLOYEE_ID);

      const entry = useEmployeesStore.getState().byId[EMPLOYEE_ID];
      expect(entry.data).toEqual(mockEmployee);
      expect(entry.error).toBeNull();
    });

    it("sets error in byId on DAL failure", async () => {
      vi.mocked(employeesDal.getEmployee).mockRejectedValue(
        new Error("not found"),
      );

      await useEmployeesStore.getState().fetchEmployee(EMPLOYEE_ID);

      const entry = useEmployeesStore.getState().byId[EMPLOYEE_ID];
      expect(entry.error).toBeTruthy();
      expect(entry.data).toBeNull();
    });
  });

  describe("fetchEmployeeStats", () => {
    it("sets stats on success", async () => {
      vi.mocked(employeesDal.getEmployeeAppointmentStats).mockResolvedValue(
        mockStats as never,
      );

      await useEmployeesStore.getState().fetchEmployeeStats(EMPLOYEE_ID);

      const entry = useEmployeesStore.getState().statsByEmployeeId[EMPLOYEE_ID];
      expect(entry.data).toEqual(mockStats);
      expect(entry.error).toBeNull();
    });

    it("sets error on DAL failure", async () => {
      vi.mocked(employeesDal.getEmployeeAppointmentStats).mockRejectedValue(
        new Error("stats failed"),
      );

      await useEmployeesStore.getState().fetchEmployeeStats(EMPLOYEE_ID);

      const entry = useEmployeesStore.getState().statsByEmployeeId[EMPLOYEE_ID];
      expect(entry.error).toBeTruthy();
      expect(entry.data).toBeNull();
    });
  });

  describe("fetchEmployeeAppointments", () => {
    it("sets appointments on success", async () => {
      vi.mocked(employeesDal.getEmployeeAppointments).mockResolvedValue([
        mockAppointmentRow as never,
      ]);

      await useEmployeesStore.getState().fetchEmployeeAppointments(EMPLOYEE_ID);

      const entry =
        useEmployeesStore.getState().appointmentsByEmployeeId[EMPLOYEE_ID];
      expect(entry.data).toEqual([mockAppointmentRow]);
      expect(entry.error).toBeNull();
    });

    it("sets error on DAL failure", async () => {
      vi.mocked(employeesDal.getEmployeeAppointments).mockRejectedValue(
        new Error("appointments failed"),
      );

      await useEmployeesStore.getState().fetchEmployeeAppointments(EMPLOYEE_ID);

      const entry =
        useEmployeesStore.getState().appointmentsByEmployeeId[EMPLOYEE_ID];
      expect(entry.error).toBeTruthy();
      expect(entry.data).toBeNull();
    });
  });

  describe("createEmployee", () => {
    it("validates input, invites employee, and refetches list", async () => {
      vi.mocked(employeesDal.inviteEmployee).mockResolvedValue(
        mockEmployee as never,
      );
      vi.mocked(employeesDal.getEmployees).mockResolvedValue([
        mockEmployee as never,
      ]);

      const result = await useEmployeesStore
        .getState()
        .createEmployee({ email: "new@clinic.com", role: "employee" });

      expect(result).toEqual(mockEmployee);
      expect(employeesDal.inviteEmployee).toHaveBeenCalledWith({
        email: "new@clinic.com",
        role: "employee",
        clinicId: CLINIC_ID,
      });
      expect(employeesDal.getEmployees).toHaveBeenCalled();
      expect(useEmployeesStore.getState().creating).toBe(false);
      expect(useEmployeesStore.getState().createError).toBeNull();
    });

    it("rejects invalid email with Zod error", async () => {
      await expect(
        useEmployeesStore.getState().createEmployee({
          email: "not-an-email",
          role: "employee",
        }),
      ).rejects.toThrow("El email no es válido");

      expect(employeesDal.inviteEmployee).not.toHaveBeenCalled();
      expect(useEmployeesStore.getState().creating).toBe(false);
      expect(useEmployeesStore.getState().createError).toBeTruthy();
    });

    it("sets createError on DAL failure", async () => {
      vi.mocked(employeesDal.inviteEmployee).mockRejectedValue(
        new Error("invite failed"),
      );

      await expect(
        useEmployeesStore.getState().createEmployee({
          email: "valid@clinic.com",
          role: "employee",
        }),
      ).rejects.toThrow("invite failed");

      expect(useEmployeesStore.getState().creating).toBe(false);
      expect(useEmployeesStore.getState().createError).toBeTruthy();
    });
  });

  describe("updateEmployee", () => {
    it("validates input, updates, and refetches list", async () => {
      const updated = { ...mockEmployee, full_name: "Ana García López" };
      vi.mocked(employeesDal.updateEmployee).mockResolvedValue(
        updated as never,
      );
      vi.mocked(employeesDal.getEmployees).mockResolvedValue([
        updated as never,
      ]);
      vi.mocked(employeesDal.getEmployee).mockResolvedValue(updated as never);

      const result = await useEmployeesStore
        .getState()
        .updateEmployee(EMPLOYEE_ID, { full_name: "Ana García López" });

      expect(result.full_name).toBe("Ana García López");
      expect(employeesDal.updateEmployee).toHaveBeenCalledWith(EMPLOYEE_ID, {
        full_name: "Ana García López",
      });
      expect(employeesDal.getEmployees).toHaveBeenCalled();
      expect(employeesDal.getEmployee).toHaveBeenCalledWith(EMPLOYEE_ID);
      expect(useEmployeesStore.getState().updating).toBe(false);
      expect(useEmployeesStore.getState().updateError).toBeNull();
    });

    it("sets updateError on DAL failure", async () => {
      vi.mocked(employeesDal.updateEmployee).mockRejectedValue(
        new Error("update failed"),
      );

      await expect(
        useEmployeesStore.getState().updateEmployee(EMPLOYEE_ID, {
          full_name: "Ana García López",
        }),
      ).rejects.toThrow("update failed");

      expect(useEmployeesStore.getState().updating).toBe(false);
      expect(useEmployeesStore.getState().updateError).toBeTruthy();
    });
  });
});
