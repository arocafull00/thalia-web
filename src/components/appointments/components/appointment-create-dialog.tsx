"use client";

import AppointmentCreateForm from "@/components/appointments/components/appointment-create-form";
import AppDialog from "@/components/ui/app-dialog";
import AppDialogDescription from "@/components/ui/app-dialog-description";
import AppDialogFooter from "@/components/ui/app-dialog-footer";
import AppDialogHeader from "@/components/ui/app-dialog-header";
import AppDialogTitle from "@/components/ui/app-dialog-title";
import AppSheetContent from "@/components/ui/app-sheet-content";
import { Button } from "@/components/ui/button";
import { ActionButton } from "@/components/ui/primitives/action-button";
import { APPOINTMENT_CREATE_COPY } from "@/copy/appointment-create-copy";
import { useAppointmentCreateDialog } from "@/lib/hooks/use-appointment-create-dialog";
import type { AppointmentWithRelations } from "@/types/database.types";

type AppointmentCreateDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  appointment?: AppointmentWithRelations | null;
  initialStartsAt?: Date | null;
  initialPatientId?: string | null;
};

export default function AppointmentCreateDialog({
  open,
  onOpenChange,
  appointment = null,
  initialStartsAt = null,
  initialPatientId = null,
}: AppointmentCreateDialogProps) {
  const dialog = useAppointmentCreateDialog(
    () => onOpenChange(false),
    appointment,
    initialStartsAt,
    initialPatientId,
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
            treatmentIds={dialog.treatmentIds}
            onToggleTreatment={dialog.toggleTreatment}
            patients={dialog.patients}
            patientsLoading={dialog.patientsLoading}
            employees={dialog.employees}
            employeesLoading={dialog.employeesLoading}
            treatments={dialog.treatments}
            treatmentsLoading={dialog.treatmentsLoading}
          />
        </div>
        <AppDialogFooter errorMessage={dialog.errors.root?.message}>
          <Button
            type="button"
            variant="outline"
            onClick={() => handleOpenChange(false)}
            className="rounded-button px-3 py-1.5 text-sm"
          >
            {APPOINTMENT_CREATE_COPY.actions.cancel}
          </Button>
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
