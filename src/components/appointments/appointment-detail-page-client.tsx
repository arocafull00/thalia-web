"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";

import AppointmentCreateDialog from "@/components/appointments/components/appointment-create-dialog";
import AppointmentDetailTreatmentItem from "@/components/appointments/components/appointment-detail-treatment-item";
import { ActionButton } from "@/components/ui/primitives/action-button";
import { Notice } from "@/components/ui/primitives/notice";
import { SkeletonList } from "@/components/ui/primitives/skeleton-list";
import { APPOINTMENT_DETAIL_COPY } from "@/copy/appointment-detail-copy";
import {
  appointmentStatusLabel,
  formatAppointmentDetailDay,
  formatAppointmentTimeRange,
} from "@/lib/format";
import { useAppointmentDetail } from "@/lib/hooks/use-appointment-detail";

type AppointmentDetailPageClientProps = {
  appointmentId: string;
};

export default function AppointmentDetailPageClient({
  appointmentId,
}: AppointmentDetailPageClientProps) {
  const {
    appointment,
    isLoading,
    error,
    dialogOpen,
    openEditDialog,
    closeDialog,
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

  const employeeColor = appointment.employees?.color ?? null;
  const treatments = appointment.appointment_treatments;

  return (
    <div className="space-y-6 p-8">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-4">
          <Link
            href="/appointments"
            className="inline-flex items-center gap-2 text-sm text-ink-secondary hover:text-ink"
          >
            <ArrowLeft size={16} />
            {APPOINTMENT_DETAIL_COPY.back}
          </Link>
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-3xl font-medium tracking-tight text-ink">
                {appointment.patients?.full_name ?? "Paciente"}
              </h1>
              <span className="rounded-full bg-primary-subtle/40 px-3 py-1 text-[11px] uppercase tracking-wide text-ink-secondary">
                {appointmentStatusLabel(appointment.status)}
              </span>
            </div>
            <p className="mt-2 text-ink-secondary">
              {formatAppointmentDetailDay(appointment.starts_at)} ·{" "}
              {formatAppointmentTimeRange(
                appointment.starts_at,
                appointment.ends_at,
              )}
            </p>
          </div>
        </div>
        <ActionButton
          title={APPOINTMENT_DETAIL_COPY.edit}
          onClick={openEditDialog}
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <section
          aria-label={APPOINTMENT_DETAIL_COPY.patient}
          className="rounded-2xl border border-border bg-surface p-5"
        >
          <h2 className="text-xs uppercase tracking-wide text-ink-muted">
            {APPOINTMENT_DETAIL_COPY.patient}
          </h2>
          <p className="mt-3 text-lg font-medium text-ink">
            {appointment.patients?.full_name ?? "Paciente"}
          </p>
          <p className="mt-1 text-sm text-ink-secondary">
            {appointment.patients?.phone ?? APPOINTMENT_DETAIL_COPY.noPhone}
          </p>
        </section>

        <section
          aria-label={APPOINTMENT_DETAIL_COPY.employee}
          className="rounded-2xl border border-border bg-surface p-5"
        >
          <h2 className="text-xs uppercase tracking-wide text-ink-muted">
            {APPOINTMENT_DETAIL_COPY.employee}
          </h2>
          <div className="mt-3 flex items-center gap-2">
            <span
              className={`h-2 w-2 shrink-0 rounded-full ${employeeColor ? "" : "bg-border"}`}
              style={
                employeeColor ? { backgroundColor: employeeColor } : undefined
              }
            />
            <p className="text-lg font-medium text-ink">
              {appointment.employees?.full_name ?? "-"}
            </p>
          </div>
          {appointment.employees?.specialty ? (
            <p className="mt-1 text-sm text-ink-secondary">
              {appointment.employees.specialty}
            </p>
          ) : null}
        </section>
      </div>

      <section
        aria-label={APPOINTMENT_DETAIL_COPY.treatments}
        className="rounded-2xl border border-border bg-surface p-5"
      >
        <h2 className="text-xs uppercase tracking-wide text-ink-muted">
          {APPOINTMENT_DETAIL_COPY.treatments}
        </h2>
        {treatments.length === 0 ? (
          <p className="mt-3 text-sm text-ink-secondary">
            {APPOINTMENT_DETAIL_COPY.noTreatments}
          </p>
        ) : (
          <div className="mt-2">
            {treatments.map((entry) => (
              <AppointmentDetailTreatmentItem
                key={entry.id}
                name={entry.treatment_types?.name ?? "Tratamiento"}
                price={entry.treatment_types?.price ?? null}
                durationMinutes={
                  entry.treatment_types?.duration_minutes ?? null
                }
              />
            ))}
          </div>
        )}
      </section>

      <section
        aria-label={APPOINTMENT_DETAIL_COPY.notes}
        className="rounded-2xl border border-border bg-surface p-5"
      >
        <h2 className="text-xs uppercase tracking-wide text-ink-muted">
          {APPOINTMENT_DETAIL_COPY.notes}
        </h2>
        <p className="mt-3 whitespace-pre-wrap text-sm text-ink-secondary">
          {appointment.notes?.trim()
            ? appointment.notes
            : APPOINTMENT_DETAIL_COPY.noNotes}
        </p>
      </section>

      <AppointmentCreateDialog
        open={dialogOpen}
        onOpenChange={(open) => {
          if (!open) {
            closeDialog();
          }
        }}
        appointment={appointment}
      />
    </div>
  );
}
