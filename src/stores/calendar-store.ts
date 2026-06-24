import { create } from "zustand";

type CalendarStore = {
  weekAnchor: Date;
  employeeId: string | null;
  setWeekAnchor: (weekAnchor: Date) => void;
  setEmployeeId: (employeeId: string | null) => void;
};

export const useCalendarStore = create<CalendarStore>((set) => ({
  weekAnchor: new Date(),
  employeeId: null,
  setWeekAnchor: (weekAnchor) => set({ weekAnchor }),
  setEmployeeId: (employeeId) => set({ employeeId }),
}));
