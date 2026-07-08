"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

import PatientCreateForm from "@/components/patients/components/patient-create-form";
import PatientsFilters from "@/components/patients/components/patients-filters";
import PatientsFiltersSheet from "@/components/patients/components/patients-filters-sheet";
import PatientsTable from "@/components/patients/components/patients-table";
import AppDialog from "@/components/ui/app-dialog";
import AppDialogDescription from "@/components/ui/app-dialog-description";
import AppDialogFooter from "@/components/ui/app-dialog-footer";
import AppDialogHeader from "@/components/ui/app-dialog-header";
import AppDialogTitle from "@/components/ui/app-dialog-title";
import AppSheetContent from "@/components/ui/app-sheet-content";
import PageStickyFiltersSection from "@/components/ui/page-sticky-filters-section";
import { ActionButton } from "@/components/ui/primitives/action-button";
import { MobileFab } from "@/components/ui/primitives/mobile-fab";
import { Notice } from "@/components/ui/primitives/notice";
import { SkeletonList } from "@/components/ui/primitives/skeleton-list";
import { PATIENT_CREATE_COPY } from "@/copy/patient-create-copy";
import { PATIENTS_COPY } from "@/copy/patients-copy";
import { useFilterSearch } from "@/lib/hooks/use-filter-search";
import { usePatientCreateDialog } from "@/lib/hooks/use-patient-create-dialog";
import { usePatients } from "@/lib/hooks/use-patients";
import { useUrlFilters } from "@/lib/hooks/use-url-filters";

const PATIENT_FILTER_DEFAULTS = { q: "", status: "" };

export default function PatientsPageClient() {
  const router = useRouter();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [sheetKey, setSheetKey] = useState(0);
  const { filters, setFilter, setFilters } = useUrlFilters(
    PATIENT_FILTER_DEFAULTS,
  );
  const { searchQuery, handleSearchChange } = useFilterSearch(
    filters.q,
    setFilter,
  );
  const patients = usePatients(searchQuery);
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

  const hasPatients = patientData.length > 0;
  const hasActiveFilters = Boolean(searchQuery.trim() || filters.status);
  const showEmptyState =
    !patients.isLoading && !patients.error && !hasActiveFilters && !hasPatients;

  const handleDialogOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      dialog.reset();
    }

    setDialogOpen(nextOpen);
  };

  const handleOpenFiltersSheet = () => {
    setSheetKey((key) => key + 1);
    setSheetOpen(true);
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="shrink-0 hidden lg:flex items-center justify-end border-b border-border-subtle bg-canvas px-4 py-3 lg:px-8 lg:py-4">
        <ActionButton
          title="Nuevo paciente"
          onClick={() => setDialogOpen(true)}
        />
      </div>
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
              onRowClick={(id) => router.push(`/patients/${id}`)}
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
            />
          </div>
          <AppDialogFooter>
            <button
              type="button"
              onClick={() => handleDialogOpenChange(false)}
              className="rounded-full border border-border px-4 py-2 text-xs font-medium uppercase tracking-wide text-ink-secondary hover:bg-canvas"
            >
              {PATIENT_CREATE_COPY.actions.cancel}
            </button>
            <ActionButton
              title={
                dialog.isPending
                  ? PATIENT_CREATE_COPY.actions.saving
                  : PATIENT_CREATE_COPY.actions.save
              }
              disabled={dialog.isPending}
              onClick={dialog.handleSubmit}
            />
          </AppDialogFooter>
        </AppSheetContent>
      </AppDialog>
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
