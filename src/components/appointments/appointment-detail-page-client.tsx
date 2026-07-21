"use client";

import { BadgeCheck, CheckCircle, Pencil } from "lucide-react";

import { getAppointmentDetailMenuActions } from "@/components/appointments/appointment-detail-actions";
import AppointmentCreateDialog from "@/components/appointments/components/appointment-create-dialog";
import AppointmentDetailSidebar from "@/components/appointments/components/appointment-detail-sidebar";
import AppointmentHeader from "@/components/appointments/components/appointment-header";
import AppointmentMaterialsSection from "@/components/appointments/components/appointment-materials-section";
import AppointmentTreatmentsSection from "@/components/appointments/components/appointment-treatments-section";
import AppConfirmDialog from "@/components/ui/app-confirm-dialog";
import { BackButton } from "@/components/ui/primitives/back-button";
import { Notice } from "@/components/ui/primitives/notice";
import { SkeletonList } from "@/components/ui/primitives/skeleton-list";
import { APPOINTMENT_DETAIL_COPY } from "@/copy/appointment-detail-copy";
import { useAppointmentDetail } from "@/lib/hooks/use-appointment-detail";
import { useTopbarActions } from "@/lib/hooks/use-topbar-actions";
import { useTopbarBreadcrumb } from "@/lib/hooks/use-topbar-breadcrumb";

type AppointmentDetailPageClientProps = {
  appointmentId: string;
};

function resolveTotalDurationMinutes(
  treatments: {
    treatment: { duration_minutes: number | null } | null;
  }[],
  startsAt: string,
  endsAt: string,
) {
  const fromTreatments = treatments.reduce(
    (sum, entry) => sum + (entry.treatment?.duration_minutes ?? 0),
    0,
  );

  if (fromTreatments > 0) {
    return fromTreatments;
  }

  return Math.max(
    1,
    Math.round(
      (new Date(endsAt).getTime() - new Date(startsAt).getTime()) / 60000,
    ),
  );
}

export default function AppointmentDetailPageClient({
  appointmentId,
}: AppointmentDetailPageClientProps) {
  const {
    appointment,
    isLoading,
    error,
    dialogOpen,
    cancelConfirmOpen,
    cancelError,
    updatingStatus,
    canChangeStatus,
    openEditDialog,
    closeDialog,
    openCancelConfirm,
    closeCancelConfirm,
    handleStatusChange,
    confirmCancel,
  } = useAppointmentDetail(appointmentId);

  const breadcrumbLabel =
    appointment?.patients?.full_name ?? APPOINTMENT_DETAIL_COPY.patient;

  useTopbarBreadcrumb(
    appointment
      ? {
          rootLabel: APPOINTMENT_DETAIL_COPY.breadcrumbRoot,
          rootHref: "/appointments",
          currentLabel: breadcrumbLabel,
        }
      : null,
  );

  useTopbarActions(
    appointment
      ? {
          buttons: [
            {
              title: APPOINTMENT_DETAIL_COPY.edit,
              icon: Pencil,
              onClick: openEditDialog,
            },
            ...(canChangeStatus
              ? [
                  ...(appointment.status === "scheduled"
                    ? [
                        {
                          title: "Confirmar cita",
                          icon: BadgeCheck,
                          variant: "ghost" as const,
                          disabled: updatingStatus,
                          onClick: () => {
                            void handleStatusChange("confirmed");
                          },
                        },
                      ]
                    : []),
                  {
                    title: APPOINTMENT_DETAIL_COPY.markCompleted,
                    icon: CheckCircle,
                    variant: "ghost" as const,
                    disabled: updatingStatus,
                    onClick: () => {
                      void handleStatusChange("completed");
                    },
                  },
                ]
              : []),
          ],
          menu: {
            actions: getAppointmentDetailMenuActions(canChangeStatus, {
              onEdit: openEditDialog,
              onMarkCompleted: () => {
                void handleStatusChange("completed");
              },
              onCancel: openCancelConfirm,
            }),
            ariaLabel: APPOINTMENT_DETAIL_COPY.moreActions,
          },
        }
      : null,
  );

  if (isLoading) {
    return (
      <div className="p-8" aria-busy="true">
        <SkeletonList count={4} />
      </div>
    );
  }

  if (error || !appointment) {
    return (
      <div className="flex min-h-0 flex-1 flex-col overflow-y-auto space-y-6 p-8">
        <BackButton
          fallbackHref="/appointments"
          label={APPOINTMENT_DETAIL_COPY.back}
        />
        <Notice
          tone="danger"
          message={
            error
              ? APPOINTMENT_DETAIL_COPY.loadError
              : APPOINTMENT_DETAIL_COPY.notFound
          }
        />
      </div>
    );
  }

  const treatments = appointment.appointment_treatments;
  const totalDurationMinutes = resolveTotalDurationMinutes(
    treatments,
    appointment.starts_at,
    appointment.ends_at,
  );

  return (
    <div
      data-testid="appointment-detail-page"
      className="flex min-h-0 flex-1 flex-col overflow-y-auto"
    >
      <AppointmentHeader appointment={appointment} />

      <div className="flex flex-col gap-6 px-4 py-8 lg:px-8">
        <div className="grid gap-8 xl:grid-cols-[1fr_320px]">
          <div className="flex flex-col divide-y divide-border-subtle">
            <AppointmentTreatmentsSection
              treatments={treatments}
              totalDurationMinutes={totalDurationMinutes}
            />
            <div className="pt-6">
              <AppointmentMaterialsSection appointment={appointment} />
            </div>
          </div>

          <div className="hidden xl:flex xl:flex-col xl:gap-6">
            <AppointmentDetailSidebar appointment={appointment} />
          </div>
        </div>
      </div>

      <AppointmentCreateDialog
        open={dialogOpen}
        onOpenChange={(open) => {
          if (!open) {
            closeDialog();
          }
        }}
        appointment={appointment}
      />

      <AppConfirmDialog
        open={cancelConfirmOpen}
        onOpenChange={(open) => {
          if (!open) {
            closeCancelConfirm();
          }
        }}
        title={APPOINTMENT_DETAIL_COPY.confirmCancelTitle}
        description={APPOINTMENT_DETAIL_COPY.confirmCancelDescription}
        confirmLabel={APPOINTMENT_DETAIL_COPY.confirmCancel}
        cancelLabel={APPOINTMENT_DETAIL_COPY.cancelDialogCancel}
        pendingLabel={APPOINTMENT_DETAIL_COPY.cancelPending}
        isPending={updatingStatus}
        onConfirm={() => {
          void confirmCancel();
        }}
        confirmTone="danger"
        errorMessage={cancelError ?? undefined}
      />
    </div>
  );
}
