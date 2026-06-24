import { create } from "zustand";

import type { FinancesTabValue } from "@/components/finances/finances-tab-bar";

type FinancesUiStore = {
  month: Date;
  tab: FinancesTabValue;
  setMonth: (month: Date) => void;
  setTab: (tab: FinancesTabValue) => void;
};

export const useFinancesUiStore = create<FinancesUiStore>((set) => ({
  month: new Date(),
  tab: "income",
  setMonth: (month) => set({ month }),
  setTab: (tab) => set({ tab }),
}));

export function useFinancesPageState() {
  const month = useFinancesUiStore((state) => state.month);
  const tab = useFinancesUiStore((state) => state.tab);
  const setMonth = useFinancesUiStore((state) => state.setMonth);
  const setTab = useFinancesUiStore((state) => state.setTab);

  return { month, tab, setMonth, setTab };
}
