import { QueryClient } from "@tanstack/react-query";
import { describe, expect, it } from "vitest";

import {
  employeeKeys,
  invalidateEmployeeDirectory,
  requireEmployeeId,
  requireEmployeeQueryScope,
  setEmployeeQueryData,
  type EmployeeQueryScope,
  type EmployeesPageQuery,
} from "@/lib/query/employees-query";
import { CLINIC_ID, EMPLOYEE_ID, mockEmployee } from "@/tests/mocks";
import type { Employee } from "@/types/database.types";

const USER_ID = "user-1";
const OTHER_USER_ID = "user-2";
const OTHER_CLINIC_ID = "clinic-2";
const SCOPE: EmployeeQueryScope = {
  userId: USER_ID,
  clinicId: CLINIC_ID,
};
const PAGE_QUERY: EmployeesPageQuery = {
  search: " Ana ",
  role: "doctor",
  active: true,
  page: 1,
  pageSize: 10,
};
const employee: Employee = {
  ...mockEmployee,
  account_type: "internal",
  active: true,
  role: "doctor",
};

describe("employees-query", () => {
  it("isolates keys by user and clinic", () => {
    expect(
      employeeKeys.list({ userId: OTHER_USER_ID, clinicId: CLINIC_ID }),
    ).not.toEqual(employeeKeys.list(SCOPE));
    expect(
      employeeKeys.list({ userId: USER_ID, clinicId: OTHER_CLINIC_ID }),
    ).not.toEqual(employeeKeys.list(SCOPE));
  });

  it("normalizes page search values in the cache key", () => {
    expect(employeeKeys.page(SCOPE, PAGE_QUERY)).toEqual(
      employeeKeys.page(SCOPE, {
        ...PAGE_QUERY,
        search: "ana",
        role: " DOCTOR ",
      }),
    );
  });

  it("rejects incomplete scopes and employee ids", () => {
    expect(() =>
      requireEmployeeQueryScope({ userId: "", clinicId: CLINIC_ID }),
    ).toThrow("No hay sesión activa");
    expect(() => requireEmployeeId("")).toThrow("No hay empleado seleccionado");
  });

  it("updates the exact employee detail cache", () => {
    const queryClient = new QueryClient();

    setEmployeeQueryData(queryClient, SCOPE, employee);

    expect(
      queryClient.getQueryData(employeeKeys.detail(SCOPE, EMPLOYEE_ID)),
    ).toEqual(employee);
  });

  it("invalidates employee lists and pages without invalidating details", async () => {
    const queryClient = new QueryClient();
    const pageKey = employeeKeys.page(SCOPE, PAGE_QUERY);
    const detailKey = employeeKeys.detail(SCOPE, EMPLOYEE_ID);
    queryClient.setQueryData(employeeKeys.list(SCOPE), [employee]);
    queryClient.setQueryData(pageKey, {
      employees: [employee],
      total: 1,
    });
    queryClient.setQueryData(detailKey, employee);

    await invalidateEmployeeDirectory(queryClient, SCOPE);

    expect(
      queryClient.getQueryState(employeeKeys.list(SCOPE))?.isInvalidated,
    ).toBe(true);
    expect(queryClient.getQueryState(pageKey)?.isInvalidated).toBe(true);
    expect(queryClient.getQueryState(detailKey)?.isInvalidated).toBe(false);
  });
});
