"use client";

import { useMemo, useState } from "react";

import AppointmentCreateDialog from "@/components/appointments/components/appointment-create-dialog";
import DashboardAgenda from "@/components/dashboard/components/dashboard-agenda";
import DashboardHeader from "@/components/dashboard/components/dashboard-header";
import DashboardRecentActivity from "@/components/dashboard/components/dashboard-recent-activity";
import { DASHBOARD_COPY } from "@/components/dashboard/dashboard-copy";
import { MobileFab } from "@/components/ui/primitives/mobile-fab";
import { toAgendaAppointments } from "@/lib/calendar-agenda";
import { useAuth } from "@/lib/hooks/use-auth";
import { useDashboard } from "@/lib/hooks/use-dashboard";
import { useTopbarAction } from "@/lib/hooks/use-topbar-action";

export default function DashboardPageClient() {
  const { profile } = useAuth();
  const { data, isLoading, error } = useDashboard();
  const [dialogOpen, setDialogOpen] = useState(false);

  const appointments = data?.appointments ?? [];
  const agendaAppointments = useMemo(
    () => toAgendaAppointments(appointments),
    [appointments],
  );
  const confirmedCount = appointments.filter(
    (a) => a.status === "confirmed",
  ).length;
  const firstName =
    profile?.full_name?.split(" ")[0] ?? DASHBOARD_COPY.fallbackName;

  useTopbarAction({
    title: DASHBOARD_COPY.actions.newAppointment,
    onClick: () => setDialogOpen(true),
  });

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="min-h-0 flex-1 overflow-y-auto">
        <div className="space-y-8 p-4 lg:p-8">
          <DashboardHeader
            firstName={firstName}
            appointmentsCount={appointments.length}
            confirmedCount={confirmedCount}
          />
          <div className="grid gap-8 xl:grid-cols-[1.8fr_1fr]">
            <DashboardAgenda
              appointments={agendaAppointments}
              isLoading={isLoading}
              error={error}
            />
            <DashboardRecentActivity appointments={appointments} />
          </div>
        </div>
      </div>
      <AppointmentCreateDialog open={dialogOpen} onOpenChange={setDialogOpen} />
      <MobileFab
        label={DASHBOARD_COPY.actions.newAppointmentLabel}
        onClick={() => setDialogOpen(true)}
      />
    </div>
  );
}
