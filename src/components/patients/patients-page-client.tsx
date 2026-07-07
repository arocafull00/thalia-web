"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

import PatientCreateForm from "@/components/patients/components/patient-create-form";
import PatientsTable from "@/components/patients/components/patients-table";
import AppDialog from "@/components/ui/app-dialog";
import AppDialogDescription from "@/components/ui/app-dialog-description";
import AppDialogFooter from "@/components/ui/app-dialog-footer";
import AppDialogHeader from "@/components/ui/app-dialog-header";
import AppDialogTitle from "@/components/ui/app-dialog-title";
import AppSheetContent from "@/components/ui/app-sheet-content";
import FilterPills from "@/components/ui/filter-pills";
import { ActionButton } from "@/components/ui/primitives/action-button";
import { Notice } from "@/components/ui/primitives/notice";
import { PageHeader } from "@/components/ui/primitives/page-header";
import { SkeletonList } from "@/components/ui/primitives/skeleton-list";
import { PATIENT_CREATE_COPY } from "@/copy/patient-create-copy";
import { PATIENTS_COPY } from "@/copy/patients-copy";
import { usePatientCreateDialog } from "@/lib/hooks/use-patient-create-dialog";
import { usePatients } from "@/lib/hooks/use-patients";
import { useSearch } from "@/lib/hooks/use-search";
import { useUrlFilters } from "@/lib/hooks/use-url-filters";

const PATIENT_FILTER_DEFAULTS = { status: "" };

const statusOptions = [
  { label: PATIENTS_COPY.filters.all, value: "" },
  { label: PATIENTS_COPY.filters.active, value: "active" },
  { label: PATIENTS_COPY.filters.inactive, value: "inactive" },
];

export default function PatientsPageClient() {
  const router = useRouter();
  const [dialogOpen, setDialogOpen] = useState(false);
  const debouncedSearch = useSearch();
  const { filters, setFilter } = useUrlFilters(PATIENT_FILTER_DEFAULTS);
  const patients = usePatients(debouncedSearch);
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
  const hasActiveFilters = Boolean(debouncedSearch.trim() || filters.status);
  const showEmptyState =
    !patients.isLoading && !patients.error && !hasActiveFilters && !hasPatients;

  const handleDialogOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      dialog.reset();
    }

    setDialogOpen(nextOpen);
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="shrink-0 border-b border-border-subtle bg-canvas px-4 py-3 lg:px-8 lg:py-4">
        <div className="flex items-center justify-between gap-4">
          <PageHeader
            subtitle={PATIENTS_COPY.page.subtitle(patientData.length)}
            title={PATIENTS_COPY.page.title}
          />
          <ActionButton
            title="Nuevo paciente"
            onClick={() => setDialogOpen(true)}
          />
        </div>
        <div className="mt-3">
          <FilterPills
            options={statusOptions}
            active={filters.status}
            onChange={(value) => setFilter("status", value)}
            ariaLabel={PATIENTS_COPY.filters.status}
          />
        </div>
      </div>
      <div className="min-h-0 flex-1 space-y-6 overflow-y-auto px-4 py-4 lg:px-8 lg:py-6">
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
    </div>
  );
}
