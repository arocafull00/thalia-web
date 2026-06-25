"use client";

import { useRouter } from "next/navigation";

import { ActionButton, Notice, PageHeader, SkeletonList } from "@/components/ui/primitives";
import { useDebouncedValue } from "@/lib/hooks/use-debounced-value";
import { usePatients } from "@/lib/hooks/use-patients";
import { useTopbarSearchStore } from "@/stores/topbar-search-store";

const SEARCH_DEBOUNCE_MS = 300;

export default function PatientsPageClient() {
  const router = useRouter();
  const topbarQuery = useTopbarSearchStore((state) => state.query);
  const debouncedSearch = useDebouncedValue(topbarQuery, SEARCH_DEBOUNCE_MS);
  const patients = usePatients(debouncedSearch);
  const patientData = patients.data ?? [];
  const hasPatients = patientData.length > 0;
  const showEmptyState =
    !patients.isLoading && !patients.error && !debouncedSearch.trim() && !hasPatients;

  return (
    <div className="space-y-6 p-8">
      <div className="flex items-start justify-between gap-4">
        <PageHeader subtitle={`${patientData.length} pacientes registrados`} title="Pacientes" />
        <ActionButton title="Nuevo paciente" onClick={() => router.push("/patients/new")} />
      </div>
      {patients.isLoading ? <SkeletonList /> : null}
      {patients.error ? <Notice tone="danger" message="No se pudieron cargar los pacientes." /> : null}
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
              <span className="truncate font-medium text-ink">{patient.full_name}</span>
              <span className="truncate text-sm text-ink-secondary">{patient.phone ?? "Sin telefono"}</span>
              <span className="truncate text-sm text-ink-secondary">{patient.email ?? "-"}</span>
            </button>
          ))}
          {!hasPatients ? (
            <p className="p-6 text-center text-ink-secondary">No hay pacientes con ese criterio.</p>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
