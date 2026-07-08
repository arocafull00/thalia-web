import { create } from "zustand";

export type CalendarViewMode = "day" | "week" | "month";

type CalendarStore = {
  weekAnchor: Date;
  viewMode: CalendarViewMode;
  employeeId: string | null;
  dialogOpen: boolean;
  createStartsAt: Date | null;
  visibleRangeStart: string | null;
  visibleRangeEnd: string | null;
  setWeekAnchor: (weekAnchor: Date) => void;
  setViewMode: (viewMode: CalendarViewMode) => void;
  setEmployeeId: (employeeId: string | null) => void;
  openCreateDialog: (startsAt?: Date) => void;
  closeDialog: () => void;
  setVisibleRange: (start: string, end: string) => void;
};

export const useCalendarStore = create<CalendarStore>((set) => ({
  weekAnchor: new Date(),
  viewMode: "week",
  employeeId: null,
  dialogOpen: false,
  createStartsAt: null,
  visibleRangeStart: null,
  visibleRangeEnd: null,
  setWeekAnchor: (weekAnchor) => set({ weekAnchor }),
  setViewMode: (viewMode) => set({ viewMode }),
  setEmployeeId: (employeeId) => set({ employeeId }),
  openCreateDialog: (startsAt) =>
    set({ dialogOpen: true, createStartsAt: startsAt ?? null }),
  closeDialog: () => set({ dialogOpen: false }),
  setVisibleRange: (visibleRangeStart, visibleRangeEnd) =>
    set({ visibleRangeStart, visibleRangeEnd }),
}));
