"use client";

import AppointmentCreateForm from "@/components/appointments/components/appointment-create-form";
import AppDialog from "@/components/ui/app-dialog";
import AppDialogDescription from "@/components/ui/app-dialog-description";
import AppDialogFooter from "@/components/ui/app-dialog-footer";
import AppDialogHeader from "@/components/ui/app-dialog-header";
import AppDialogTitle from "@/components/ui/app-dialog-title";
import AppSheetContent from "@/components/ui/app-sheet-content";
import { ActionButton } from "@/components/ui/primitives/action-button";
import { APPOINTMENT_CREATE_COPY } from "@/copy/appointment-create-copy";
import { useAppointmentCreateDialog } from "@/lib/hooks/use-appointment-create-dialog";
import type { AppointmentWithRelations } from "@/types/database.types";

type AppointmentCreateDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  appointment?: AppointmentWithRelations | null;
  initialStartsAt?: Date | null;
};

export default function AppointmentCreateDialog({
  open,
  onOpenChange,
  appointment = null,
  initialStartsAt = null,
}: AppointmentCreateDialogProps) {
  const dialog = useAppointmentCreateDialog(
    () => onOpenChange(false),
    appointment,
    initialStartsAt,
  );

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      dialog.reset();
    }

    onOpenChange(nextOpen);
  };

  return (
    <AppDialog open={open} onOpenChange={handleOpenChange}>
      <AppSheetContent>
        <AppDialogHeader>
          <AppDialogTitle>
            {dialog.isEditing
              ? APPOINTMENT_CREATE_COPY.titleEdit
              : APPOINTMENT_CREATE_COPY.title}
          </AppDialogTitle>
          <AppDialogDescription>
            {APPOINTMENT_CREATE_COPY.description}
          </AppDialogDescription>
        </AppDialogHeader>
        <div className="min-h-0 flex-1 overflow-y-auto px-1">
          <AppointmentCreateForm
            register={dialog.register}
            control={dialog.control}
            errors={dialog.errors}
            treatmentTypeIds={dialog.treatmentTypeIds}
            onToggleTreatmentType={dialog.toggleTreatmentType}
            onPatientSearchChange={dialog.setPatientSearch}
            patients={dialog.patients}
            patientsLoading={dialog.patientsLoading}
            patientsSearching={dialog.patientsSearching}
            employees={dialog.employees}
            employeesLoading={dialog.employeesLoading}
            treatmentTypes={dialog.treatmentTypes}
            treatmentTypesLoading={dialog.treatmentTypesLoading}
          />
        </div>
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
      </AppSheetContent>
    </AppDialog>
  );
}
