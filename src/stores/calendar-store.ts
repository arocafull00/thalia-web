import { create } from "zustand";

type CalendarStore = {
  weekAnchor: Date;
  employeeId: string | null;
  dialogOpen: boolean;
  createStartsAt: Date | null;
  setWeekAnchor: (weekAnchor: Date) => void;
  setEmployeeId: (employeeId: string | null) => void;
  openCreateDialog: (startsAt?: Date) => void;
  closeDialog: () => void;
};

export const useCalendarStore = create<CalendarStore>((set) => ({
  weekAnchor: new Date(),
  employeeId: null,
  dialogOpen: false,
  createStartsAt: null,
  setWeekAnchor: (weekAnchor) => set({ weekAnchor }),
  setEmployeeId: (employeeId) => set({ employeeId }),
  openCreateDialog: (startsAt) =>
    set({ dialogOpen: true, createStartsAt: startsAt ?? null }),
  closeDialog: () => set({ dialogOpen: false }),
}));
