"use client";

import { notFound } from "next/navigation";
import { useState } from "react";

import AppointmentCreateDialog from "@/components/appointments/components/appointment-create-dialog";
import PatientDetailActionsMenu from "@/components/patients/components/patient-detail-actions-menu";
import PatientEditDialog from "@/components/patients/components/patient-edit-dialog";
import PatientProfileSidebar from "@/components/patients/components/patient-profile-sidebar";
import PatientTimeline from "@/components/patients/components/patient-timeline";
import { BackButton } from "@/components/ui/primitives/back-button";
import { Notice } from "@/components/ui/primitives/notice";
import { SkeletonList } from "@/components/ui/primitives/skeleton-list";
import { PATIENT_DETAIL_COPY } from "@/copy/patient-detail-copy";
import { usePatient, usePatientAppointments } from "@/lib/hooks/use-patients";
import { usePatientsStore } from "@/stores/patients-store";

type PatientDetailPageClientProps = {
  patientId: string;
};

export default function PatientDetailPageClient({
  patientId,
}: PatientDetailPageClientProps) {
  const patientQuery = usePatient(patientId);
  const appointmentsQuery = usePatientAppointments(patientId);
  const fetchPatient = usePatientsStore((state) => state.fetchPatient);
  const fetchPatientAppointments = usePatientsStore(
    (state) => state.fetchPatientAppointments,
  );
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [appointmentDialogOpen, setAppointmentDialogOpen] = useState(false);

  const refetch = () => {
    void fetchPatient(patientId);
    void fetchPatientAppointments(patientId);
  };

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
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="flex shrink-0 items-center justify-between gap-4 px-4 pt-6 pb-4 lg:px-8">
        <BackButton fallbackHref="/patients" label={PATIENT_DETAIL_COPY.back} />
        <PatientDetailActionsMenu
          patient={patient}
          onEdit={() => setEditDialogOpen(true)}
          onCreateAppointment={() => setAppointmentDialogOpen(true)}
        />
      </div>

      <div className="grid min-h-0 flex-1 grid-cols-1 lg:grid-cols-[20%_1fr]">
        <PatientProfileSidebar
          patient={patient}
          onEdit={() => setEditDialogOpen(true)}
          onCreateAppointment={() => setAppointmentDialogOpen(true)}
        />
        <div className="order-2 flex min-h-0 flex-1 flex-col overflow-y-auto px-4 py-6 lg:order-2 lg:px-6 lg:py-8">
          <PatientTimeline
            appointments={appointments}
            isLoading={appointmentsQuery.isLoading}
            error={appointmentsQuery.error}
          />
        </div>
      </div>

      <PatientEditDialog
        patient={patient}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        onSuccess={refetch}
      />

      <AppointmentCreateDialog
        open={appointmentDialogOpen}
        onOpenChange={setAppointmentDialogOpen}
        initialPatientId={patient.id}
      />
    </div>
  );
}
