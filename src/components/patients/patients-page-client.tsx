"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import PatientCreateForm from "@/components/patients/components/patient-create-form";
import AppDialog from "@/components/ui/app-dialog";
import AppDialogDescription from "@/components/ui/app-dialog-description";
import AppDialogFooter from "@/components/ui/app-dialog-footer";
import AppDialogHeader from "@/components/ui/app-dialog-header";
import AppDialogTitle from "@/components/ui/app-dialog-title";
import AppSheetContent from "@/components/ui/app-sheet-content";
import { ActionButton } from "@/components/ui/primitives/action-button";
import { Notice } from "@/components/ui/primitives/notice";
import { PageHeader } from "@/components/ui/primitives/page-header";
import { SkeletonList } from "@/components/ui/primitives/skeleton-list";
import { PATIENT_CREATE_COPY } from "@/copy/patient-create-copy";
import { useDebouncedValue } from "@/lib/hooks/use-debounced-value";
import { usePatientCreateDialog } from "@/lib/hooks/use-patient-create-dialog";
import { usePatients } from "@/lib/hooks/use-patients";
import { useTopbarSearchStore } from "@/stores/topbar-search-store";

const SEARCH_DEBOUNCE_MS = 300;

export default function PatientsPageClient() {
  const router = useRouter();
  const [dialogOpen, setDialogOpen] = useState(false);
  const topbarQuery = useTopbarSearchStore((state) => state.query);
  const debouncedSearch = useDebouncedValue(topbarQuery, SEARCH_DEBOUNCE_MS);
  const patients = usePatients(debouncedSearch);
  const dialog = usePatientCreateDialog(() => setDialogOpen(false));
  const patientData = patients.data ?? [];
  const hasPatients = patientData.length > 0;
  const showEmptyState =
    !patients.isLoading &&
    !patients.error &&
    !debouncedSearch.trim() &&
    !hasPatients;

  const handleDialogOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      dialog.reset();
    }

    setDialogOpen(nextOpen);
  };

  return (
    <div className="space-y-6 p-8">
      <div className="flex items-start justify-between gap-4">
        <PageHeader
          subtitle={`${patientData.length} pacientes registrados`}
          title="Pacientes"
        />
        <ActionButton
          title="Nuevo paciente"
          onClick={() => setDialogOpen(true)}
        />
      </div>
      {patients.isLoading ? <SkeletonList /> : null}
      {patients.error ? (
        <Notice tone="danger" message="No se pudieron cargar los pacientes." />
      ) : null}
      {showEmptyState ? (
        <div className="rounded-2xl border border-dashed border-border p-10 text-center text-ink-secondary">
          Todavía no hay pacientes registrados.
        </div>
      ) : null}
      {!showEmptyState && !patients.isLoading ? (
        <div className="overflow-hidden rounded-2xl border border-border bg-surface">
          <div className="grid grid-cols-[1.4fr_1fr_1fr] gap-4 border-b border-border px-4 py-2 text-xs uppercase tracking-wide text-ink-muted">
            <span>Paciente</span>
            <span>Telefono</span>
            <span>Email</span>
          </div>
          {patientData.map((patient) => (
            <button
              key={patient.id}
              type="button"
              onClick={() => router.push(`/patients/${patient.id}`)}
              className="grid w-full grid-cols-[1.4fr_1fr_1fr] gap-4 border-b border-border-subtle px-4 py-4 text-left transition hover:bg-canvas"
            >
              <span className="truncate font-medium text-ink">
                {patient.full_name}
              </span>
              <span className="truncate text-sm text-ink-secondary">
                {patient.phone ?? "Sin telefono"}
              </span>
              <span className="truncate text-sm text-ink-secondary">
                {patient.email ?? "-"}
              </span>
            </button>
          ))}
          {!hasPatients ? (
            <p className="p-6 text-center text-ink-secondary">
              No hay pacientes con ese criterio.
            </p>
          ) : null}
        </div>
      ) : null}
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
