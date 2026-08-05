"use client";

import { useParams } from "next/navigation";
import { useMemo, useState } from "react";

import AppointmentCreateDialog from "@/components/appointments/components/appointment-create-dialog";
import PatientDetailHeader from "@/components/patients/components/detail/patient-detail-header";
import PatientDetailTabBar from "@/components/patients/components/detail/patient-detail-tab-bar";
import PatientDetailTabContent from "@/components/patients/components/detail/patient-detail-tab-content";
import PatientFileDeleteConfirmDialog from "@/components/patients/components/files/patient-file-delete-confirm-dialog";
import PatientFileUploaderDialog from "@/components/patients/components/files/patient-file-uploader-dialog";
import PatientEditDialog from "@/components/patients/components/form/patient-edit-dialog";
import PatientImageDeleteConfirmDialog from "@/components/patients/components/gallery/patient-image-delete-confirm-dialog";
import PatientImageUploaderDialog from "@/components/patients/components/gallery/patient-image-uploader-dialog";
import {
  getPatientDetailMenuSections,
  getPatientDetailPrimaryAction,
} from "@/components/patients/patient-detail-actions";
import { BackButton } from "@/components/ui/primitives/back-button";
import { Notice } from "@/components/ui/primitives/notice";
import { SkeletonList } from "@/components/ui/primitives/skeleton-list";
import { PATIENT_DETAIL_COPY } from "@/copy/patient-detail-copy";
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
  const filesDeleteConfirm = usePatientFilesStore(
    (state) => state.deleteConfirm,
  );
  const closeFilesDeleteConfirm = usePatientFilesStore(
    (state) => state.closeDeleteConfirm,
  );

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
    patient
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
    <div
      data-testid="patient-detail-page"
      className="surface-card no-scrollbar flex min-h-0 flex-1 flex-col overflow-y-auto rounded-dialog"
    >
      <PatientDetailHeader
        patient={patient}
        avatarDisplayUri={patientAvatar.avatarDisplayUri}
        avatarUploadPending={patientAvatar.avatarUploadPending}
        onAvatarFileSelected={patientAvatar.onAvatarFileSelected}
      />

      <div className="flex flex-col gap-6 px-4 pb-8 lg:px-8">
        <PatientDetailTabBar activeTab={activeTab} onTabChange={setActiveTab} />
        <div role="tabpanel">
          <PatientDetailTabContent
            activeTab={activeTab}
            patient={patient}
            appointments={appointments}
            isLoading={appointmentsQuery.isLoading}
            error={appointmentsQuery.error}
            onOpenUploader={() => setUploaderOpen(true)}
            onOpenFilesUploader={() => setFilesUploaderOpen(true)}
          />
        </div>
      </div>

      <PatientEditDialog
        patient={patient}
        open={editDialogOpen}
        avatarDisplayUri={patientAvatar.avatarDisplayUri}
        avatarUploadPending={patientAvatar.avatarUploadPending}
        onAvatarFileSelected={patientAvatar.onAvatarFileSelected}
        onOpenChange={setEditDialogOpen}
        onSuccess={refetch}
      />

      <AppointmentCreateDialog
        open={appointmentDialogOpen}
        onOpenChange={setAppointmentDialogOpen}
        initialPatientId={patient.id}
      />

      <PatientImageUploaderDialog
        patientId={patient.id}
        open={uploaderOpen}
        onOpenChange={setUploaderOpen}
      />

      <PatientFileUploaderDialog
        patientId={patient.id}
        open={filesUploaderOpen}
        onOpenChange={setFilesUploaderOpen}
      />

      {deleteConfirm ? (
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

      {filesDeleteConfirm ? (
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
