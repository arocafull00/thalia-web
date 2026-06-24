import { create } from "zustand";

import type { EmployeeRole } from "@/types/database.types";

type EmployeesUiStore = {
  roleFilter: EmployeeRole | "";
  setRoleFilter: (role: EmployeeRole | "") => void;
};

export const useEmployeesUiStore = create<EmployeesUiStore>((set) => ({
  roleFilter: "",
  setRoleFilter: (roleFilter) => set({ roleFilter }),
}));
