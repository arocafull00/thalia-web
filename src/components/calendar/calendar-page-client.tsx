"use client";

import AppointmentCreateDialog from "@/components/appointments/components/appointment-create-dialog";
import CalendarEmployeeFilter from "@/components/calendar/calendar-employee-filter";
import CalendarToolbar from "@/components/calendar/components/calendar-toolbar";
import { useCalendarPage } from "@/components/calendar/hooks/use-calendar-page";
import ScheduleXCalendar from "@/components/calendar/schedule-x-calendar";

export default function CalendarPageClient() {
  const {
    rangeLabel,
    viewMode,
    dialogOpen,
    createStartsAt,
    openCreateDialog,
    closeDialog,
    onPrevious,
    onNext,
    onToday,
    onChangeViewMode,
  } = useCalendarPage();

  return (
    <div className="flex h-dvh flex-col overflow-hidden">
      <CalendarToolbar
        rangeLabel={rangeLabel}
        viewMode={viewMode}
        filter={<CalendarEmployeeFilter />}
        onPrevious={onPrevious}
        onNext={onNext}
        onToday={onToday}
        onNewAppointment={() => openCreateDialog()}
        onChangeViewMode={onChangeViewMode}
      />
      <div className="min-h-0 flex-1 bg-surface">
        <ScheduleXCalendar />
      </div>
      <AppointmentCreateDialog
        open={dialogOpen}
        onOpenChange={(open) => {
          if (!open) {
            closeDialog();
          }
        }}
        initialStartsAt={createStartsAt}
      />
    </div>
  );
}
