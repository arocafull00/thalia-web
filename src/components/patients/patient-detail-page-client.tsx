"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

import PatientAppointmentRow from "@/components/patients/components/patient-appointment-row";
import { Notice } from "@/components/ui/primitives/notice";
import { SkeletonList } from "@/components/ui/primitives/skeleton-list";
import { PATIENT_DETAIL_COPY } from "@/copy/patient-detail-copy";
import { formatBirthDateWithAge } from "@/lib/format";
import { usePatient, usePatientAppointments } from "@/lib/hooks/use-patients";

type PatientDetailPageClientProps = {
  patientId: string;
};

export default function PatientDetailPageClient({
  patientId,
}: PatientDetailPageClientProps) {
  const patientQuery = usePatient(patientId);
  const appointmentsQuery = usePatientAppointments(patientId);
  if (patientQuery.isLoading) {
    return (
      <div className="p-8" aria-busy="true">
        <SkeletonList />
      </div>
    );
  }

  if (patientQuery.error) {
    return (
      <div className="p-8">
        <Notice tone="danger" message={PATIENT_DETAIL_COPY.errors.load} />
      </div>
    );
  }

  const patient = patientQuery.data;

  if (!patient) {
    notFound();
  }

  const appointments = appointmentsQuery.data ?? [];

  return (
    <div className="space-y-8 p-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-3">
          <Link
            href="/patients"
            className="inline-flex items-center gap-1.5 text-sm text-ink-secondary hover:text-ink"
          >
            <ArrowLeft className="size-4" aria-hidden="true" />
            {PATIENT_DETAIL_COPY.back}
          </Link>
          <h1 className="text-2xl font-semibold text-ink">
            {patient.full_name}
          </h1>
        </div>
      </div>

      <section aria-labelledby="patient-general-heading">
        <h2
          id="patient-general-heading"
          className="mb-4 text-lg font-medium text-ink"
        >
          {PATIENT_DETAIL_COPY.sections.general}
        </h2>
        <dl className="grid gap-4 rounded-2xl border border-border bg-surface p-6 sm:grid-cols-2">
          <div>
            <dt className="text-xs uppercase tracking-wide text-ink-muted">
              {PATIENT_DETAIL_COPY.fields.dni}
            </dt>
            <dd className="mt-1 text-sm text-ink">{patient.dni ?? "—"}</dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-wide text-ink-muted">
              {PATIENT_DETAIL_COPY.fields.birthDate}
            </dt>
            <dd className="mt-1 text-sm text-ink">
              {formatBirthDateWithAge(patient.birth_date) ?? "—"}
            </dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-wide text-ink-muted">
              {PATIENT_DETAIL_COPY.fields.phone}
            </dt>
            <dd className="mt-1 text-sm text-ink">{patient.phone ?? "—"}</dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-wide text-ink-muted">
              {PATIENT_DETAIL_COPY.fields.email}
            </dt>
            <dd className="mt-1 text-sm text-ink">{patient.email ?? "—"}</dd>
          </div>
          <div className="sm:col-span-2">
            <dt className="text-xs uppercase tracking-wide text-ink-muted">
              {PATIENT_DETAIL_COPY.fields.address}
            </dt>
            <dd className="mt-1 text-sm text-ink">{patient.address ?? "—"}</dd>
          </div>
          {patient.notes ? (
            <div className="sm:col-span-2">
              <dt className="text-xs uppercase tracking-wide text-ink-muted">
                {PATIENT_DETAIL_COPY.fields.notes}
              </dt>
              <dd className="mt-1 whitespace-pre-wrap text-sm text-ink">
                {patient.notes}
              </dd>
            </div>
          ) : null}
        </dl>
      </section>

      <section aria-labelledby="patient-history-heading">
        <h2
          id="patient-history-heading"
          className="mb-4 text-lg font-medium text-ink"
        >
          {PATIENT_DETAIL_COPY.sections.history}
        </h2>
        {appointmentsQuery.isLoading ? <SkeletonList /> : null}
        {appointmentsQuery.error ? (
          <Notice tone="danger" message={PATIENT_DETAIL_COPY.errors.history} />
        ) : null}
        {!appointmentsQuery.isLoading && !appointmentsQuery.error ? (
          appointments.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border p-10 text-center text-ink-secondary">
              {PATIENT_DETAIL_COPY.history.empty}
            </div>
          ) : (
            <div className="overflow-hidden rounded-2xl border border-border bg-surface">
              <table className="w-full text-left">
                <caption className="sr-only">
                  {PATIENT_DETAIL_COPY.history.caption}
                </caption>
                <thead>
                  <tr className="border-b border-border text-xs uppercase tracking-wide text-ink-muted">
                    <th scope="col" className="px-4 py-2">
                      {PATIENT_DETAIL_COPY.history.columns.date}
                    </th>
                    <th scope="col" className="px-4 py-2">
                      {PATIENT_DETAIL_COPY.history.columns.time}
                    </th>
                    <th scope="col" className="px-4 py-2">
                      {PATIENT_DETAIL_COPY.history.columns.professional}
                    </th>
                    <th scope="col" className="px-4 py-2">
                      {PATIENT_DETAIL_COPY.history.columns.status}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {appointments.map((appointment) => (
                    <PatientAppointmentRow
                      key={appointment.id}
                      appointment={appointment}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          )
        ) : null}
      </section>
    </div>
  );
}
