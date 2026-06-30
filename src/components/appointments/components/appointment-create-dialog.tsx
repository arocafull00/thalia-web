"use client";

import AppointmentCreateForm from "@/components/appointments/components/appointment-create-form";
import AppDialog from "@/components/ui/app-dialog";
import AppDialogContent from "@/components/ui/app-dialog-content";
import AppDialogDescription from "@/components/ui/app-dialog-description";
import AppDialogFooter from "@/components/ui/app-dialog-footer";
import AppDialogHeader from "@/components/ui/app-dialog-header";
import AppDialogTitle from "@/components/ui/app-dialog-title";
import { ActionButton } from "@/components/ui/primitives/action-button";
import { APPOINTMENT_CREATE_COPY } from "@/copy/appointment-create-copy";
import { useAppointmentCreateDialog } from "@/lib/hooks/use-appointment-create-dialog";

type AppointmentCreateDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export default function AppointmentCreateDialog({
  open,
  onOpenChange,
}: AppointmentCreateDialogProps) {
  const dialog = useAppointmentCreateDialog(() => onOpenChange(false));

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      dialog.reset();
    }

    onOpenChange(nextOpen);
  };

  return (
    <AppDialog open={open} onOpenChange={handleOpenChange}>
      <AppDialogContent className="fixed left-1/2 top-1/2 z-50 max-h-[85vh] w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-2xl border border-border bg-surface p-6 shadow-lg focus:outline-none">
        <AppDialogHeader>
          <AppDialogTitle>{APPOINTMENT_CREATE_COPY.title}</AppDialogTitle>
          <AppDialogDescription>
            {APPOINTMENT_CREATE_COPY.description}
          </AppDialogDescription>
        </AppDialogHeader>
        <AppointmentCreateForm
          patientId={dialog.patientId}
          onPatientIdChange={dialog.setPatientId}
          onPatientSearchChange={dialog.setPatientSearch}
          employeeId={dialog.employeeId}
          onEmployeeIdChange={dialog.setEmployeeId}
          startsAt={dialog.startsAt}
          onStartsAtChange={dialog.setStartsAt}
          treatmentTypeIds={dialog.treatmentTypeIds}
          onToggleTreatmentType={dialog.toggleTreatmentType}
          notes={dialog.notes}
          onNotesChange={dialog.setNotes}
          patients={dialog.patients}
          patientsLoading={dialog.patientsLoading}
          employees={dialog.employees}
          employeesLoading={dialog.employeesLoading}
          treatmentTypes={dialog.treatmentTypes}
          treatmentTypesLoading={dialog.treatmentTypesLoading}
        />
        <AppDialogFooter>
          <button
            type="button"
            onClick={() => handleOpenChange(false)}
            className="rounded-full border border-border px-4 py-2 text-xs font-medium uppercase tracking-wide text-ink-secondary hover:bg-canvas"
          >
            {APPOINTMENT_CREATE_COPY.actions.cancel}
          </button>
          <ActionButton
            title={
              dialog.isPending
                ? APPOINTMENT_CREATE_COPY.actions.saving
                : APPOINTMENT_CREATE_COPY.actions.save
            }
            disabled={dialog.isPending}
            onClick={dialog.handleSubmit}
          />
        </AppDialogFooter>
      </AppDialogContent>
    </AppDialog>
  );
}
