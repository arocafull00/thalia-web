import { create } from "zustand";

type ShellStore = {
  showEmployees: boolean;
  showFinances: boolean;
  showInventory: boolean;
  setNavVisibility: (values: {
    showEmployees: boolean;
    showFinances: boolean;
    showInventory: boolean;
  }) => void;
};

export const useShellStore = create<ShellStore>((set) => ({
  showEmployees: true,
  showFinances: true,
  showInventory: true,
  setNavVisibility: (values) => set(values),
}));
