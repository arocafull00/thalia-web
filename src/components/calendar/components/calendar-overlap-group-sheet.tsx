"use client";

import CalendarOverlapGroupRow from "@/components/calendar/components/calendar-overlap-group-row";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { CALENDAR_COPY } from "@/copy/calendar-copy";
import { countAvailableSlotsInGroup } from "@/lib/calendar-day-stats";
import type { AppointmentWithRelations } from "@/types/database.types";

export type CalendarOverlapGroupSheetState = {
  open: boolean;
  title: string;
  subtitle: string;
  appointments: AppointmentWithRelations[];
};

type CalendarOverlapGroupSheetProps = {
  state: CalendarOverlapGroupSheetState;
  onOpenChange: (open: boolean) => void;
  onSelectAppointment: (appointmentId: string) => void;
};

export default function CalendarOverlapGroupSheet({
  state,
  onOpenChange,
  onSelectAppointment,
}: CalendarOverlapGroupSheetProps) {
  const professionalCount = new Set(
    state.appointments.map((appointment) => appointment.employee_id),
  ).size;
  const availableSlots = countAvailableSlotsInGroup(state.appointments);

  return (
    <Sheet open={state.open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full gap-0 border-border-subtle bg-surface p-0 sm:max-w-md"
      >
        <SheetHeader className="border-b border-border-subtle px-5 py-5 text-left">
          <SheetTitle className="text-lg font-semibold text-ink">
            {state.title}
          </SheetTitle>
          <SheetDescription className="text-sm text-ink-muted">
            {state.subtitle}
          </SheetDescription>
        </SheetHeader>

        <div className="grid grid-cols-3 gap-2.5 px-5 pt-4">
          <div className="rounded-xl bg-canvas px-3 py-3">
            <strong className="block text-base font-semibold text-ink">
              {state.appointments.length}
            </strong>
            <span className="mt-0.5 block text-[11px] text-ink-muted">
              {CALENDAR_COPY.week.sheetAppointmentsLabel}
            </span>
          </div>
          <div className="rounded-xl bg-canvas px-3 py-3">
            <strong className="block text-base font-semibold text-ink">
              {professionalCount}
            </strong>
            <span className="mt-0.5 block text-[11px] text-ink-muted">
              {CALENDAR_COPY.week.sheetProfessionalsLabel}
            </span>
          </div>
          <div className="rounded-xl bg-canvas px-3 py-3">
            <strong className="block text-base font-semibold text-ink">
              {availableSlots}
            </strong>
            <span className="mt-0.5 block text-[11px] text-ink-muted">
              {CALENDAR_COPY.week.sheetSlotsLabel}
            </span>
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-5 pb-6 pt-2">
          <p className="mb-2 text-xs tracking-wide text-ink-muted uppercase">
            {CALENDAR_COPY.week.sheetSectionTitle}
          </p>
          {state.appointments.map((appointment) => (
            <CalendarOverlapGroupRow
              key={appointment.id}
              appointment={appointment}
              onSelect={onSelectAppointment}
            />
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
}
