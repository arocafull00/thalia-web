"use client";

import AppointmentCreateDialog from "@/components/appointments/components/appointment-create-dialog";
import CalendarEmployeeFilter from "@/components/calendar/calendar-employee-filter";
import CalendarToolbar from "@/components/calendar/components/calendar-toolbar";
import { useCalendarPage } from "@/components/calendar/hooks/use-calendar-page";
import ScheduleXCalendar from "@/components/calendar/schedule-x-calendar";

export default function CalendarPageClient() {
  const {
    weekRangeLabel,
    isLoading,
    loadingLabel,
    dialogOpen,
    createStartsAt,
    openCreateDialog,
    closeDialog,
    onPreviousWeek,
    onNextWeek,
    onToday,
  } = useCalendarPage();

  return (
    <div className="flex h-dvh flex-col overflow-hidden">
      <CalendarToolbar
        weekRangeLabel={weekRangeLabel}
        isLoading={isLoading}
        loadingLabel={loadingLabel}
        filter={<CalendarEmployeeFilter />}
        onPreviousWeek={onPreviousWeek}
        onNextWeek={onNextWeek}
        onToday={onToday}
        onNewAppointment={() => openCreateDialog()}
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
