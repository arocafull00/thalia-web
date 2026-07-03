"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";

import AppointmentCreateDialog from "@/components/appointments/components/appointment-create-dialog";
import AppointmentDetailSidebar from "@/components/appointments/components/appointment-detail-sidebar";
import AppointmentHeader from "@/components/appointments/components/appointment-header";
import AppointmentPatientCard from "@/components/appointments/components/appointment-patient-card";
import AppointmentProfessionalCard from "@/components/appointments/components/appointment-professional-card";
import AppointmentTreatmentsSection from "@/components/appointments/components/appointment-treatments-section";
import AppConfirmDialog from "@/components/ui/app-confirm-dialog";
import { Notice } from "@/components/ui/primitives/notice";
import { SkeletonList } from "@/components/ui/primitives/skeleton-list";
import { APPOINTMENT_DETAIL_COPY } from "@/copy/appointment-detail-copy";
import { useAppointmentDetail } from "@/lib/hooks/use-appointment-detail";

type AppointmentDetailPageClientProps = {
  appointmentId: string;
};

function resolveTotalDurationMinutes(
  treatments: {
    treatment_types: { duration_minutes: number | null } | null;
  }[],
  startsAt: string,
  endsAt: string,
) {
  const fromTreatments = treatments.reduce(
    (sum, entry) => sum + (entry.treatment_types?.duration_minutes ?? 0),
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
      <div className="space-y-6 p-8">
        <SkeletonList count={4} />
      </div>
    );
  }

  if (error || !appointment) {
    return (
      <div className="space-y-6 p-8">
        <Link
          href="/appointments"
          className="inline-flex items-center gap-2 text-sm text-ink-secondary hover:text-ink"
        >
          <ArrowLeft size={16} />
          {APPOINTMENT_DETAIL_COPY.back}
        </Link>
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
    <div className="flex flex-col gap-6 p-8">
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

      <div className="grid gap-6 xl:grid-cols-[1fr_320px]">
        <div className="flex flex-col gap-6">
          <div className="grid gap-6 sm:grid-cols-2">
            <AppointmentPatientCard patient={appointment.patients} />
            <AppointmentProfessionalCard employee={appointment.employees} />
          </div>
          <AppointmentTreatmentsSection
            treatments={treatments}
            totalDurationMinutes={totalDurationMinutes}
          />
        </div>
        <AppointmentDetailSidebar appointment={appointment} />
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
      />
    </div>
  );
}
