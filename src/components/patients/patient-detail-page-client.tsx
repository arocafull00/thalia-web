"use client";

import { useParams } from "next/navigation";
import { useMemo, useState } from "react";

import AppointmentCreateDialog from "@/components/appointments/components/appointment-create-dialog";
import PatientDetailSidebar from "@/components/patients/components/detail/patient-detail-sidebar";
import PatientDetailTabBar from "@/components/patients/components/detail/patient-detail-tab-bar";
import PatientDetailTabContent from "@/components/patients/components/detail/patient-detail-tab-content";
import PatientTimeline from "@/components/patients/components/detail/patient-timeline";
import PatientFileDeleteConfirmDialog from "@/components/patients/components/files/patient-file-delete-confirm-dialog";
import PatientFileUploaderDialog from "@/components/patients/components/files/patient-file-uploader-dialog";
import PatientEditDialog from "@/components/patients/components/form/patient-edit-dialog";
import PatientImageDeleteConfirmDialog from "@/components/patients/components/gallery/patient-image-delete-confirm-dialog";
import PatientImageUploaderDialog from "@/components/patients/components/gallery/patient-image-uploader-dialog";
import PatientAppointmentsTab from "@/components/patients/components/tabs/patient-appointments-tab";
import PatientTreatmentsTab from "@/components/patients/components/tabs/patient-treatments-tab";
import { usePatientAppointmentStatusChange } from "@/components/patients/hooks/use-patient-appointment-status-change";
import {
  getPatientDetailMenuSections,
  getPatientDetailPrimaryAction,
} from "@/components/patients/patient-detail-actions";
import PageSurface from "@/components/ui/page-surface";
import { BackButton } from "@/components/ui/primitives/back-button";
import { Notice } from "@/components/ui/primitives/notice";
import { SkeletonList } from "@/components/ui/primitives/skeleton-list";
import { Tabs } from "@/components/ui/tabs";
import { PATIENT_DETAIL_COPY } from "@/copy/patient-detail-copy";
import { useActiveClinic } from "@/lib/hooks/use-active-clinic";
import { usePatientAvatar } from "@/lib/hooks/use-patient-avatar";
import { usePatientDetailTabs } from "@/lib/hooks/use-patient-detail-tabs";
import { usePatient, usePatientAppointments } from "@/lib/hooks/use-patients";
import { useTopbarActions } from "@/lib/hooks/use-topbar-actions";
import { useTopbarBreadcrumb } from "@/lib/hooks/use-topbar-breadcrumb";
import { usePatientFilesStore } from "@/stores/patient-files-store";
import { usePatientImagesStore } from "@/stores/patient-images-store";
import { usePatientsStore } from "@/stores/patients-store";
import type { AppointmentWithRelations, Patient } from "@/types/database.types";

type PatientDetailPageClientProps = {
  patient?: Patient;
  initialAppointments?: AppointmentWithRelations[];
};

export default function PatientDetailPageClient({
  patient: serverPatient,
  initialAppointments,
}: PatientDetailPageClientProps) {
  const { id: routePatientId } = useParams<{ id: string }>();
  const { isExternal } = useActiveClinic();
  const patientId = serverPatient?.id ?? routePatientId;
  const patientQuery = usePatient(serverPatient ?? patientId);
  const appointmentsQuery = usePatientAppointments(
    patientId,
    initialAppointments,
  );
  const fetchPatient = usePatientsStore((state) => state.fetchPatient);
  const fetchPatientAppointments = usePatientsStore(
    (state) => state.fetchPatientAppointments,
  );
  const { activeTab, setActiveTab } = usePatientDetailTabs();
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [appointmentDialogOpen, setAppointmentDialogOpen] = useState(false);
  const [uploaderOpen, setUploaderOpen] = useState(false);
  const [filesUploaderOpen, setFilesUploaderOpen] = useState(false);
  const deleteConfirm = usePatientImagesStore((state) => state.deleteConfirm);
  const closeDeleteConfirm = usePatientImagesStore(
    (state) => state.closeDeleteConfirm,
  );
  const openDeleteConfirm = usePatientImagesStore(
    (state) => state.openDeleteConfirm,
  );
  const filesDeleteConfirm = usePatientFilesStore(
    (state) => state.deleteConfirm,
  );
  const closeFilesDeleteConfirm = usePatientFilesStore(
    (state) => state.closeDeleteConfirm,
  );
  const openFilesDeleteConfirm = usePatientFilesStore(
    (state) => state.openDeleteConfirm,
  );
  const handleAppointmentStatusChange =
    usePatientAppointmentStatusChange(patientId);

  const appointments = useMemo(
    () => appointmentsQuery.data ?? [],
    [appointmentsQuery.data],
  );

  const refetch = () => {
    void fetchPatient(patientId);
    void fetchPatientAppointments(patientId);
  };

  const patient = patientQuery.data;
  const patientAvatar = usePatientAvatar(patient);

  useTopbarBreadcrumb(
    patient && !isExternal
      ? {
          rootLabel: PATIENT_DETAIL_COPY.breadcrumbRoot,
          rootHref: "/patients",
          currentLabel: patient.full_name,
        }
      : null,
  );

  const patientActionHandlers = {
    onEdit: () => setEditDialogOpen(true),
    onCreateAppointment: () => setAppointmentDialogOpen(true),
  };

  useTopbarActions(
    patient
      ? {
          buttons: [getPatientDetailPrimaryAction(patientActionHandlers)],
          menu: {
            sections: getPatientDetailMenuSections(
              patient,
              patientActionHandlers,
            ),
            ariaLabel: PATIENT_DETAIL_COPY.moreActions,
          },
        }
      : null,
  );

  if (patientQuery.isLoading && !patient) {
    return (
      <PageSurface busy>
        <SkeletonList />
      </PageSurface>
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
    <div
      data-testid="patient-detail-page"
      className="flex min-h-0 flex-1 flex-col"
    >
      <div className="shrink-0 px-8 pt-6 pb-4">
        <BackButton fallbackHref="/patients" label={PATIENT_DETAIL_COPY.back} />
      </div>

      <div className="grid min-h-0 flex-1 lg:grid-cols-[20%_1fr]">
        <PatientDetailSidebar
          patient={patient}
          appointments={appointments}
          avatarDisplayUri={patientAvatar.avatarDisplayUri}
          avatarUploadPending={patientAvatar.avatarUploadPending}
          onAvatarFileSelected={patientAvatar.onAvatarFileSelected}
          onEdit={patientActionHandlers.onEdit}
          onCreateAppointment={patientActionHandlers.onCreateAppointment}
          readOnly={isExternal}
        />

        <div className="flex min-h-0 flex-1 flex-col overflow-y-auto px-6 py-8">
          <PatientTimeline
            appointments={appointments}
            isLoading={appointmentsQuery.isLoading}
            error={appointmentsQuery.error}
            heading={PATIENT_DETAIL_COPY.tabs.clinicalHistory}
            headingId="patient-clinical-history-heading"
          />

          <section
            aria-labelledby="patient-treatments-heading"
            className="mt-12 border-t border-border-subtle pt-8"
          >
            <h2
              id="patient-treatments-heading"
              className="border-b border-border-subtle pb-4 text-base font-medium text-ink"
            >
              {PATIENT_DETAIL_COPY.tabs.treatments}
            </h2>
            <div className="pt-6">
              <PatientTreatmentsTab appointments={appointments} />
            </div>
          </section>

          <section
            aria-labelledby="patient-appointments-heading"
            className="mt-12 border-t border-border-subtle pt-8"
          >
            <h2
              id="patient-appointments-heading"
              className="border-b border-border-subtle pb-4 text-base font-medium text-ink"
            >
              {PATIENT_DETAIL_COPY.tabs.appointments}
            </h2>
            <div className="pt-6">
              <PatientAppointmentsTab
                appointments={appointments}
                onStatusChange={handleAppointmentStatusChange}
                readOnly={isExternal}
              />
            </div>
          </section>

          <Tabs
            value={activeTab}
            onValueChange={(value) => setActiveTab(value as typeof activeTab)}
            className="mt-12 flex flex-col gap-6 border-t border-border-subtle pt-8"
          >
            <PatientDetailTabBar />
            <PatientDetailTabContent
              patient={patient}
              onDeleteFile={openFilesDeleteConfirm}
              onDeleteImage={openDeleteConfirm}
              onOpenUploader={() => setUploaderOpen(true)}
              onOpenFilesUploader={() => setFilesUploaderOpen(true)}
              readOnly={isExternal}
            />
          </Tabs>
        </div>
      </div>

      {!isExternal ? (
        <PatientEditDialog
          patient={patient}
          open={editDialogOpen}
          avatarDisplayUri={patientAvatar.avatarDisplayUri}
          avatarUploadPending={patientAvatar.avatarUploadPending}
          onAvatarFileSelected={patientAvatar.onAvatarFileSelected}
          onOpenChange={setEditDialogOpen}
          onSuccess={refetch}
        />
      ) : null}

      {!isExternal ? (
        <AppointmentCreateDialog
          open={appointmentDialogOpen}
          onOpenChange={setAppointmentDialogOpen}
          initialPatientId={patient.id}
        />
      ) : null}

      {!isExternal ? (
        <PatientImageUploaderDialog
          patientId={patient.id}
          open={uploaderOpen}
          onOpenChange={setUploaderOpen}
        />
      ) : null}

      {!isExternal ? (
        <PatientFileUploaderDialog
          patientId={patient.id}
          open={filesUploaderOpen}
          onOpenChange={setFilesUploaderOpen}
        />
      ) : null}

      {!isExternal && deleteConfirm ? (
        <PatientImageDeleteConfirmDialog
          patientId={patientId}
          image={deleteConfirm.image}
          open={true}
          onOpenChange={(open) => {
            if (!open) {
              closeDeleteConfirm();
            }
          }}
          onSuccess={() => {
            deleteConfirm.onSuccess?.();
          }}
        />
      ) : null}

      {!isExternal && filesDeleteConfirm ? (
        <PatientFileDeleteConfirmDialog
          patientId={patientId}
          file={filesDeleteConfirm.file}
          open={true}
          onOpenChange={(open) => {
            if (!open) {
              closeFilesDeleteConfirm();
            }
          }}
          onSuccess={() => {
            filesDeleteConfirm.onSuccess?.();
          }}
        />
      ) : null}
    </div>
  );
}
