"use client";

import { useState } from "react";

import AppointmentCreateDialog from "@/components/appointments/components/appointment-create-dialog";
import { notifyAppointmentStatusError } from "@/components/appointments/components/appointment-status-error-toast";
import DashboardAgenda from "@/components/dashboard/components/dashboard-agenda";
import DashboardCurrentAppointments from "@/components/dashboard/components/dashboard-current-appointments";
import DashboardHeader from "@/components/dashboard/components/dashboard-header";
import { DASHBOARD_COPY } from "@/components/dashboard/dashboard-copy";
import PageCard from "@/components/ui/page-card";
import { MobileFab } from "@/components/ui/primitives/mobile-fab";
import {
  useActiveClinicTimezone,
  useIsExternalProfessional,
} from "@/lib/hooks/use-active-clinic";
import { useAuth } from "@/lib/hooks/use-auth";
import { useDashboard } from "@/lib/hooks/use-dashboard";
import { useTopbarAction } from "@/lib/hooks/use-topbar-action";
import { notifySuccess } from "@/lib/sound";
import { useAppointmentsStore } from "@/stores/appointments-store";
import type { DashboardData } from "@/stores/dashboard-store";

type DashboardPageClientProps = {
  initialData?: DashboardData;
};

export default function DashboardPageClient({
  initialData,
}: DashboardPageClientProps) {
  const { profile } = useAuth();
  const isExternal = useIsExternalProfessional();
  const timezone = useActiveClinicTimezone();
  const { day, isLoading, error } = useDashboard(initialData);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [completingId, setCompletingId] = useState<string | null>(null);

  const firstName =
    profile?.full_name?.split(" ")[0] ?? DASHBOARD_COPY.fallbackName;

  /*
   * Un identificador y no un booleano: con varias citas en curso a la vez, un
   * `completing: boolean` deshabilitaría los botones de todas las tarjetas al
   * pulsar una. Ya pasó en el listado de citas del profesional externo.
   */
  const handleComplete = async (id: string) => {
    setCompletingId(id);

    try {
      await useAppointmentsStore
        .getState()
        .updateAppointmentStatus(id, "completed");
      notifySuccess(DASHBOARD_COPY.current.statusUpdated);
    } catch (cause) {
      notifyAppointmentStatusError(cause);
    } finally {
      setCompletingId(null);
    }
  };

  /*
   * Un profesional externo no crea citas: la base le deja insertar la cita pero
   * no añadirle tratamientos, así que quedaría vacía y con un error que habla
   * de una tabla que él no ha tocado.
   */
  useTopbarAction(
    isExternal
      ? null
      : {
          title: DASHBOARD_COPY.actions.newAppointment,
          onClick: () => setDialogOpen(true),
        },
  );

  return (
    <div data-testid="dashboard-page" className="flex min-h-0 flex-1 flex-col">
      <PageCard fill>
        <div className="flex min-h-0 flex-1 flex-col gap-6 overflow-hidden pt-3.5">
          <DashboardHeader
            firstName={firstName}
            segments={day.segments}
            totalCount={day.totalCount}
          />
          <DashboardCurrentAppointments
            day={day}
            timezone={timezone}
            completingId={completingId}
            onComplete={handleComplete}
          />
          <DashboardAgenda
            appointments={day.agenda}
            isLoading={isLoading}
            error={error}
          />
        </div>
      </PageCard>
      <AppointmentCreateDialog open={dialogOpen} onOpenChange={setDialogOpen} />
      {isExternal ? null : (
        <MobileFab
          label={DASHBOARD_COPY.actions.newAppointmentLabel}
          onClick={() => setDialogOpen(true)}
        />
      )}
    </div>
  );
}
