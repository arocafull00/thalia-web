"use client";

import { Pencil } from "lucide-react";

import AppointmentCreateDialog from "@/components/appointments/components/appointment-create-dialog";
import AppointmentDetailSidebar from "@/components/appointments/components/appointment-detail-sidebar";
import AppointmentHeader from "@/components/appointments/components/appointment-header";
import AppointmentMaterialsSection from "@/components/appointments/components/appointment-materials-section";
import AppointmentPatientCard from "@/components/appointments/components/appointment-patient-card";
import AppointmentProfessionalCard from "@/components/appointments/components/appointment-professional-card";
import AppointmentTreatmentsSection from "@/components/appointments/components/appointment-treatments-section";
import AppConfirmDialog from "@/components/ui/app-confirm-dialog";
import { BackButton } from "@/components/ui/primitives/back-button";
import { MobileFab } from "@/components/ui/primitives/mobile-fab";
import { Notice } from "@/components/ui/primitives/notice";
import { SkeletonList } from "@/components/ui/primitives/skeleton-list";
import { APPOINTMENT_DETAIL_COPY } from "@/copy/appointment-detail-copy";
import { useAppointmentDetail } from "@/lib/hooks/use-appointment-detail";

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
    updatingStatus,
    canChangeStatus,
    openEditDialog,
    closeDialog,
    openCancelConfirm,
    closeCancelConfirm,
    handleStatusChange,
    confirmCancel,
  } = useAppointmentDetail(appointmentId);

  if (isLoading) {
    return (
      <div
        className="flex min-h-0 flex-1 flex-col overflow-y-auto p-8"
        aria-busy="true"
      >
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
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="min-h-0 flex-1 overflow-y-auto px-4 py-6 lg:px-8 lg:py-8">
        <div className="grid gap-8 xl:grid-cols-[1fr_320px]">
          <div className="flex flex-col divide-y divide-border-subtle">
            <div className="pb-6">
              <AppointmentHeader
                appointment={appointment}
                canChangeStatus={canChangeStatus}
                updatingStatus={updatingStatus}
                onEdit={openEditDialog}
                onMarkCompleted={() => {
                  void handleStatusChange("completed");
                }}
                onCancel={openCancelConfirm}
              />
            </div>
            <div className="grid gap-8 py-6 sm:grid-cols-2">
              <AppointmentPatientCard patient={appointment.patients} />
              <AppointmentProfessionalCard employee={appointment.employees} />
            </div>
            <div className="py-6">
              <AppointmentTreatmentsSection
                treatments={treatments}
                totalDurationMinutes={totalDurationMinutes}
              />
            </div>
            <div className="pt-6">
              <AppointmentMaterialsSection appointment={appointment} />
            </div>
          </div>

          <div className="hidden xl:flex xl:flex-col xl:gap-6">
            <AppointmentDetailSidebar appointment={appointment} />
          </div>
        </div>
      </div>

      <MobileFab
        label={APPOINTMENT_DETAIL_COPY.edit}
        icon={Pencil}
        onClick={openEditDialog}
      />

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
      />
    </div>
  );
}
