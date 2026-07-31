"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

import PatientCreateForm from "@/components/patients/components/form/patient-create-form";
import PatientEditDialog from "@/components/patients/components/form/patient-edit-dialog";
import PatientsFilters from "@/components/patients/components/list/patients-filters";
import PatientsFiltersSheet from "@/components/patients/components/list/patients-filters-sheet";
import PatientsTable from "@/components/patients/components/list/patients-table";
import AppDialog from "@/components/ui/app-dialog";
import AppDialogDescription from "@/components/ui/app-dialog-description";
import AppDialogFooter from "@/components/ui/app-dialog-footer";
import AppDialogHeader from "@/components/ui/app-dialog-header";
import AppDialogTitle from "@/components/ui/app-dialog-title";
import AppSheetContent from "@/components/ui/app-sheet-content";
import { Button } from "@/components/ui/button";
import PageStickyFiltersSection from "@/components/ui/page-sticky-filters-section";
import { ActionButton } from "@/components/ui/primitives/action-button";
import { MobileFab } from "@/components/ui/primitives/mobile-fab";
import { Notice } from "@/components/ui/primitives/notice";
import { SkeletonList } from "@/components/ui/primitives/skeleton-list";
import { PATIENT_CREATE_COPY } from "@/copy/patient-create-copy";
import { PATIENTS_COPY } from "@/copy/patients-copy";
import { useFilterSearch } from "@/lib/hooks/use-filter-search";
import { usePatientAvatar } from "@/lib/hooks/use-patient-avatar";
import { usePatientCreateDialog } from "@/lib/hooks/use-patient-create-dialog";
import { usePatients } from "@/lib/hooks/use-patients";
import { useTopbarAction } from "@/lib/hooks/use-topbar-action";
import { useUrlFilters } from "@/lib/hooks/use-url-filters";
import type { Patient } from "@/types/database.types";

const PATIENT_FILTER_DEFAULTS = { q: "", status: "" };

type PatientsPageClientProps = {
  initialPatients: Patient[];
  initialSearch: string;
};

export default function PatientsPageClient({
  initialPatients,
  initialSearch,
}: PatientsPageClientProps) {
  const router = useRouter();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingPatientId, setEditingPatientId] = useState<string | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [sheetKey, setSheetKey] = useState(0);
  const { filters, setFilter, setFilters } = useUrlFilters(
    PATIENT_FILTER_DEFAULTS,
  );
  const { searchQuery, handleSearchChange } = useFilterSearch(
    filters.q,
    setFilter,
  );
  const patients = usePatients(
    searchQuery,
    searchQuery === initialSearch ? initialPatients : undefined,
  );
  const dialog = usePatientCreateDialog(() => setDialogOpen(false));
  const patientData = useMemo(() => patients.data ?? [], [patients.data]);

  const filteredPatients = useMemo(() => {
    if (!filters.status) {
      return patientData;
    }

    if (filters.status === "inactive") {
      return [];
    }

    return patientData;
  }, [filters.status, patientData]);

  const editingPatient = useMemo(
    () => filteredPatients.find((patient) => patient.id === editingPatientId),
    [editingPatientId, filteredPatients],
  );
  const editingPatientAvatar = usePatientAvatar(editingPatient);

  const hasPatients = patientData.length > 0;
  const hasActiveFilters = Boolean(searchQuery.trim() || filters.status);
  const showEmptyState =
    !patients.isLoading && !patients.error && !hasActiveFilters && !hasPatients;

  const handleDialogOpenChange = (nextOpen: boolean) => {
    setDialogOpen(nextOpen);
  };

  const handleCancelCreate = () => {
    dialog.reset();
    setDialogOpen(false);
  };

  const handleOpenFiltersSheet = () => {
    setSheetKey((key) => key + 1);
    setSheetOpen(true);
  };

  const handleEditDialogOpenChange = (nextOpen: boolean) => {
    setEditDialogOpen(nextOpen);
  };

  const handleRowClick = (id: string) => {
    setEditingPatientId(id);
    setEditDialogOpen(true);
  };

  useTopbarAction({
    title: "Nuevo paciente",
    testId: "patient-create-trigger",
    onClick: () => setDialogOpen(true),
  });

  return (
    <div data-testid="patients-page" className="flex min-h-0 flex-1 flex-col">
      <div className="min-h-0 flex-1 overflow-y-auto">
        <PageStickyFiltersSection>
          <PatientsFilters
            search={filters.q}
            status={filters.status}
            onSearchChange={handleSearchChange}
            onStatusChange={(value) => setFilter("status", value)}
            onOpenSheet={handleOpenFiltersSheet}
          />
        </PageStickyFiltersSection>
        <div className="space-y-6 px-4 py-4 lg:px-8 lg:py-6">
          {patients.isLoading ? <SkeletonList /> : null}
          {patients.error ? (
            <Notice tone="danger" message={PATIENTS_COPY.page.loadError} />
          ) : null}
          {showEmptyState ? (
            <div className="rounded-2xl border border-dashed border-border p-10 text-center text-ink-secondary">
              {PATIENTS_COPY.page.empty}
            </div>
          ) : null}
          {!showEmptyState && !patients.isLoading ? (
            <PatientsTable
              patients={filteredPatients}
              onRowClick={handleRowClick}
            />
          ) : null}
        </div>
      </div>
      <AppDialog open={dialogOpen} onOpenChange={handleDialogOpenChange}>
        <AppSheetContent>
          <AppDialogHeader>
            <AppDialogTitle>{PATIENT_CREATE_COPY.title}</AppDialogTitle>
            <AppDialogDescription>
              {PATIENT_CREATE_COPY.description}
            </AppDialogDescription>
          </AppDialogHeader>
          <div className="min-h-0 flex-1 overflow-y-auto px-1">
            <PatientCreateForm
              register={dialog.register}
              control={dialog.control}
              errors={dialog.errors}
              avatarDisplayUri={dialog.avatarDisplayUri}
              avatarInitials={dialog.avatarInitials}
              avatarUploadPending={dialog.avatarUploadPending}
              onAvatarFileSelected={dialog.onAvatarFileSelected}
            />
          </div>
          <AppDialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleCancelCreate}
              className="rounded-button px-3 py-1.5 text-sm"
            >
              {PATIENT_CREATE_COPY.actions.cancel}
            </Button>
            <ActionButton
              title={
                dialog.isPending
                  ? PATIENT_CREATE_COPY.actions.saving
                  : PATIENT_CREATE_COPY.actions.save
              }
              disabled={dialog.isPending}
              testId="patient-create-submit"
              onClick={dialog.handleSubmit}
            />
          </AppDialogFooter>
        </AppSheetContent>
      </AppDialog>
      {editingPatient ? (
        <PatientEditDialog
          patient={editingPatient}
          open={editDialogOpen}
          avatarDisplayUri={editingPatientAvatar.avatarDisplayUri}
          avatarUploadPending={editingPatientAvatar.avatarUploadPending}
          onAvatarFileSelected={editingPatientAvatar.onAvatarFileSelected}
          onOpenChange={handleEditDialogOpenChange}
          onSuccess={() => {}}
          onViewDetail={() => {
            handleEditDialogOpenChange(false);
            router.push(`/patients/${editingPatient.id}`);
          }}
        />
      ) : null}
      <PatientsFiltersSheet
        key={sheetKey}
        open={sheetOpen}
        filters={filters}
        onApply={(updates) => setFilters(updates)}
        onClear={() => setFilters(PATIENT_FILTER_DEFAULTS)}
        onDismiss={() => setSheetOpen(false)}
      />
      <MobileFab label="Nuevo paciente" onClick={() => setDialogOpen(true)} />
    </div>
  );
}
