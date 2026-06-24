"use client";

import { useEffect, useMemo } from "react";
import { addWeeks, endOfWeek, format, startOfWeek } from "date-fns";
import { useRouter, useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";

import CalendarEmployeeFilter from "@/components/calendar/calendar-employee-filter";
import ScheduleXCalendar from "@/components/calendar/schedule-x-calendar";
import { ActionButton, PageHeader } from "@/components/ui/primitives";
import { formatWeekRange } from "@/lib/calendar-grid";
import { useAppointments } from "@/lib/hooks/use-appointments";
import { useCalendarStore } from "@/stores/calendar-store";

export default function CalendarPageClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const employeeIdParam = searchParams.get("employeeId");
  const weekAnchor = useCalendarStore((state) => state.weekAnchor);
  const employeeId = useCalendarStore((state) => state.employeeId);
  const setWeekAnchor = useCalendarStore((state) => state.setWeekAnchor);
  const setEmployeeId = useCalendarStore((state) => state.setEmployeeId);

  const rangeStart = startOfWeek(weekAnchor, { weekStartsOn: 1 });
  const rangeEnd = endOfWeek(weekAnchor, { weekStartsOn: 1 });
  const appointments = useAppointments({ start: rangeStart, end: rangeEnd }, employeeId);

  useEffect(() => {
    if (employeeIdParam) {
      setEmployeeId(employeeIdParam);
    }
  }, [employeeIdParam, setEmployeeId]);

  const events = useMemo(
    () =>
      (appointments.data ?? []).map((appointment) => ({
        id: appointment.id,
        title: `${appointment.patients?.full_name ?? "Paciente"} · ${
          appointment.appointment_treatments[0]?.treatment_types?.name ?? "Cita"
        }`,
        start: appointment.starts_at,
        end: appointment.ends_at,
        calendarId: appointment.employee_id,
      })),
    [appointments.data],
  );

  const monthLabel = new Intl.DateTimeFormat("es-ES", { month: "long", year: "numeric" }).format(
    weekAnchor,
  );

  return (
    <div className="flex h-[calc(100vh-72px)] flex-col gap-4 p-8">
      <div className="flex items-center gap-4">
        <div className="flex-1">
          <PageHeader subtitle={formatWeekRange(weekAnchor)} title={monthLabel} />
        </div>
        <button
          type="button"
          aria-label="Semana anterior"
          onClick={() => setWeekAnchor(addWeeks(weekAnchor, -1))}
          className="rounded-full border border-zinc-200 p-2"
        >
          <ChevronLeft size={18} />
        </button>
        <button
          type="button"
          aria-label="Semana siguiente"
          onClick={() => setWeekAnchor(addWeeks(weekAnchor, 1))}
          className="rounded-full border border-zinc-200 p-2"
        >
          <ChevronRight size={18} />
        </button>
        <ActionButton title="Nueva cita" onClick={() => router.push("/appointments/new")} />
      </div>
      <CalendarEmployeeFilter />
      <div className="min-h-0 flex-1 overflow-hidden rounded-3xl border border-zinc-200 bg-white p-4">
        <ScheduleXCalendar
          weekAnchor={weekAnchor}
          events={events}
          onEventClick={(eventId) => router.push(`/appointments/${eventId}`)}
        />
      </div>
      {appointments.isLoading ? (
        <p className="text-sm text-zinc-500">Cargando citas de {format(rangeStart, "dd/MM")}...</p>
      ) : null}
    </div>
  );
}
