"use client";

import { useRouter } from "next/navigation";
import { useCallback, useMemo, useState } from "react";

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
import PageCard from "@/components/ui/page-card";
import PageEmptyState from "@/components/ui/page-empty-state";
import { ActionButton } from "@/components/ui/primitives/action-button";
import {
  FORM_ACTION_ICONS,
  FORM_ACTION_ICON_CLASS,
} from "@/components/ui/primitives/form-action-icons";
import { MobileFab } from "@/components/ui/primitives/mobile-fab";
import { Notice } from "@/components/ui/primitives/notice";
import {
  PAGE_LIST_SKELETON_ROWS,
  SkeletonList,
} from "@/components/ui/primitives/skeleton-list";
import { PATIENT_CREATE_COPY } from "@/copy/patient-create-copy";
import { PATIENTS_COPY } from "@/copy/patients-copy";
import { useFilterSearch } from "@/lib/hooks/use-filter-search";
import { usePatientAvatar } from "@/lib/hooks/use-patient-avatar";
import { usePatientCreateDialog } from "@/lib/hooks/use-patient-create-dialog";
import { usePatientsPage } from "@/lib/hooks/use-patients";
import { useTopbarAction } from "@/lib/hooks/use-topbar-action";
import { useUrlFilters } from "@/lib/hooks/use-url-filters";
import {
  parseMarketingFilter,
  PATIENTS_PAGE_SIZE,
} from "@/lib/patient-pagination";
import type { PatientsPageQuery } from "@/stores/patients-store";
import type { Patient } from "@/types/database.types";

const PATIENT_FILTER_DEFAULTS = { marketing: "", page: "", q: "" };

type PatientsPageClientProps = {
  initialPatients: Patient[];
  initialTotal: number;
  initialQuery: PatientsPageQuery;
};

export default function PatientsPageClient({
  initialPatients,
  initialTotal,
  initialQuery,
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

  // Cualquier cambio de filtro, búsqueda incluida, vuelve a la página 1:
  // quedarse en la 5 tras filtrar deja la tabla vacía sin explicar por qué.
  const setFilterAndResetPage = useCallback(
    (key: string, value: string) => {
      setFilters({ [key]: value, page: "" });
    },
    [setFilters],
  );

  const { searchQuery, handleSearchChange } = useFilterSearch(
    filters.q,
    setFilterAndResetPage,
  );
  // La página vive en la URL para que un enlace compartido abra donde estaba.
  // El tope a 0 evita que un `?page=-3` escrito a mano llegue al offset del DAL.
  const pageIndex = Math.max(0, Number.parseInt(filters.page, 10) || 0);

  const pageFilters = useMemo(
    () => ({
      marketingOptIn: parseMarketingFilter(filters.marketing),
      page: pageIndex,
      search: searchQuery,
    }),
    [filters.marketing, pageIndex, searchQuery],
  );

  const patients = usePatientsPage(pageFilters, {
    initialPatients,
    initialTotal,
    initialQuery,
  });
  const dialog = usePatientCreateDialog(() => setDialogOpen(false));

  const editingPatient = useMemo(
    () => patients.patients.find((patient) => patient.id === editingPatientId),
    [editingPatientId, patients.patients],
  );
  const editingPatientAvatar = usePatientAvatar(editingPatient);

  const hasActiveFilters = Boolean(searchQuery.trim() || filters.marketing);
  const showEmptyState =
    !patients.isLoading &&
    !patients.error &&
    !hasActiveFilters &&
    patients.total === 0;

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
      <PageCard
        filters={
          <PatientsFilters
            search={filters.q}
            marketing={filters.marketing}
            isRefreshing={patients.isRefreshing}
            onSearchChange={handleSearchChange}
            onMarketingChange={(value) =>
              setFilterAndResetPage("marketing", value)
            }
            onOpenSheet={handleOpenFiltersSheet}
            onRefresh={() => void patients.refresh()}
          />
        }
      >
        {patients.isLoading ? (
          <SkeletonList count={PAGE_LIST_SKELETON_ROWS} />
        ) : null}
        {patients.error ? (
          <Notice tone="danger" message={PATIENTS_COPY.page.loadError} />
        ) : null}
        {showEmptyState ? (
          <PageEmptyState message={PATIENTS_COPY.page.empty} />
        ) : null}
        {!showEmptyState && !patients.isLoading ? (
          <PatientsTable
            patients={patients.patients}
            onRowClick={handleRowClick}
            onEdit={handleRowClick}
            pagination={{
              pageIndex,
              pageSize: PATIENTS_PAGE_SIZE,
              total: patients.total,
              onPageChange: (next) =>
                setFilter("page", next === 0 ? "" : String(next)),
            }}
          />
        ) : null}
      </PageCard>
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
              <FORM_ACTION_ICONS.cancel
                className={FORM_ACTION_ICON_CLASS}
                aria-hidden="true"
              />
              {PATIENT_CREATE_COPY.actions.cancel}
            </Button>
            <ActionButton
              icon={FORM_ACTION_ICONS.save}
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
        onApply={(updates) => setFilters({ ...updates, page: "" })}
        onClear={() => setFilters(PATIENT_FILTER_DEFAULTS)}
        onDismiss={() => setSheetOpen(false)}
      />
      <MobileFab label="Nuevo paciente" onClick={() => setDialogOpen(true)} />
    </div>
  );
}
