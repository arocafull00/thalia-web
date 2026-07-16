"use client";

import DayAgendaList from "@/components/calendar/components/day-agenda-list";
import AppDialog from "@/components/ui/app-dialog";
import AppDialogHeader from "@/components/ui/app-dialog-header";
import AppDialogTitle from "@/components/ui/app-dialog-title";
import AppSheetContent from "@/components/ui/app-sheet-content";
import type { AgendaAppointment } from "@/lib/calendar-agenda";
import { formatFullDayLabel } from "@/lib/calendar-grid";

type CalendarDayDialogProps = {
  open: boolean;
  day: Date | null;
  appointments: AgendaAppointment[];
  onOpenChange: (open: boolean) => void;
  onAppointmentClick: (appointmentId: string) => void;
};

export default function CalendarDayDialog({
  open,
  day,
  appointments,
  onOpenChange,
  onAppointmentClick,
}: CalendarDayDialogProps) {
  return (
    <AppDialog open={open} onOpenChange={onOpenChange}>
      <AppSheetContent className="fixed inset-0 z-50 flex h-dvh w-full flex-col gap-0 overflow-hidden border-0 bg-surface p-0 outline-none data-[state=open]:animate-overlay-in data-[state=closed]:animate-overlay-out">
        <AppDialogHeader className="flex shrink-0 flex-col gap-1 border-b border-border-subtle px-6 py-4 pr-12">
          <AppDialogTitle>{day ? formatFullDayLabel(day) : ""}</AppDialogTitle>
        </AppDialogHeader>
        <div className="flex min-h-0 flex-1 flex-col overflow-y-auto">
          {day ? (
            <DayAgendaList
              day={day}
              appointments={appointments}
              onAppointmentClick={onAppointmentClick}
            />
          ) : null}
        </div>
      </AppSheetContent>
    </AppDialog>
  );
}
