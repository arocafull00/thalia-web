"use client";

import { useMemo, useState } from "react";

import AppointmentCreateDialog from "@/components/appointments/components/appointment-create-dialog";
import PatientDetailHeader from "@/components/patients/components/patient-detail-header";
import PatientDetailStatsRow from "@/components/patients/components/patient-detail-stats";
import PatientDetailTabBar from "@/components/patients/components/patient-detail-tab-bar";
import PatientDetailTabContent from "@/components/patients/components/patient-detail-tab-content";
import PatientEditDialog from "@/components/patients/components/patient-edit-dialog";
import PatientGalleryDialog from "@/components/patients/components/patient-gallery-dialog";
import { getPatientDetailActions } from "@/components/patients/patient-detail-actions";
import { BackButton } from "@/components/ui/primitives/back-button";
import { Notice } from "@/components/ui/primitives/notice";
import { SkeletonList } from "@/components/ui/primitives/skeleton-list";
import { PATIENT_DETAIL_COPY } from "@/copy/patient-detail-copy";
import { usePatientDetailTabs } from "@/lib/hooks/use-patient-detail-tabs";
import {
  usePatient,
  usePatientAppointments,
  useUpcomingPatientAppointments,
} from "@/lib/hooks/use-patients";
import { useTopbarActions } from "@/lib/hooks/use-topbar-actions";
import { useTopbarBreadcrumb } from "@/lib/hooks/use-topbar-breadcrumb";
import { derivePatientDetailStats } from "@/lib/patient-detail-stats";
import { usePatientsStore } from "@/stores/patients-store";

type PatientDetailPageClientProps = {
  patientId: string;
};

export default function PatientDetailPageClient({
  patientId,
}: PatientDetailPageClientProps) {
  const patientQuery = usePatient(patientId);
  const appointmentsQuery = usePatientAppointments(patientId);
  const upcomingQuery = useUpcomingPatientAppointments(patientId);
  const fetchPatient = usePatientsStore((state) => state.fetchPatient);
  const fetchPatientAppointments = usePatientsStore(
    (state) => state.fetchPatientAppointments,
  );
  const { activeTab, setActiveTab } = usePatientDetailTabs();
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [appointmentDialogOpen, setAppointmentDialogOpen] = useState(false);
  const [galleryDialogOpen, setGalleryDialogOpen] = useState(false);

  const appointments = useMemo(
    () => appointmentsQuery.data ?? [],
    [appointmentsQuery.data],
  );
  const upcomingAppointments = useMemo(
    () => upcomingQuery.data ?? [],
    [upcomingQuery.data],
  );
  const stats = useMemo(
    () =>
      derivePatientDetailStats(
        appointments,
        upcomingAppointments,
        PATIENT_DETAIL_COPY.stats.empty,
      ),
    [appointments, upcomingAppointments],
  );

  const refetch = () => {
    void fetchPatient(patientId);
    void fetchPatientAppointments(patientId);
  };

  const patient = patientQuery.data;

  useTopbarBreadcrumb(
    patient
      ? {
          rootLabel: PATIENT_DETAIL_COPY.breadcrumbRoot,
          rootHref: "/patients",
          currentLabel: patient.full_name,
        }
      : null,
  );

  useTopbarActions(
    patient
      ? {
          buttons: [],
          menu: {
            actions: getPatientDetailActions(patient, {
              onEdit: () => setEditDialogOpen(true),
              onCreateAppointment: () => setAppointmentDialogOpen(true),
              onOpenGallery: () => setGalleryDialogOpen(true),
            }),
            ariaLabel: PATIENT_DETAIL_COPY.moreActions,
          },
        }
      : null,
  );

  if (patientQuery.isLoading) {
    return (
      <div className="p-8" aria-busy="true">
        <SkeletonList />
      </div>
    );
  }

  if (patientQuery.error || !patient) {
    return (
      <div className="flex min-h-0 flex-1 flex-col overflow-y-auto space-y-6 p-8">
        <BackButton fallbackHref="/patients" label={PATIENT_DETAIL_COPY.back} />
        <Notice
          tone="danger"
          message={
            patientQuery.error
              ? PATIENT_DETAIL_COPY.errors.load
              : PATIENT_DETAIL_COPY.errors.notFound
          }
        />
      </div>
    );
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-y-auto">
      <PatientDetailHeader
        patient={patient}
        onEdit={() => setEditDialogOpen(true)}
        onOpenGallery={() => setGalleryDialogOpen(true)}
      />

      <div className="flex flex-col gap-6 px-4 pb-8 lg:px-8">
        <PatientDetailStatsRow stats={stats} />
        <PatientDetailTabBar activeTab={activeTab} onTabChange={setActiveTab} />
        <div role="tabpanel">
          <PatientDetailTabContent
            activeTab={activeTab}
            patient={patient}
            appointments={appointments}
            isLoading={appointmentsQuery.isLoading}
            error={appointmentsQuery.error}
            onEditNotes={() => setEditDialogOpen(true)}
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

      <PatientGalleryDialog
        patient={patient}
        open={galleryDialogOpen}
        onOpenChange={setGalleryDialogOpen}
      />
    </div>
  );
}
