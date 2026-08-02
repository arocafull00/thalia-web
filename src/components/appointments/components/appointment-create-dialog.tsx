"use client";

import AppointmentCreateForm from "@/components/appointments/components/appointment-create-form";
import { LoaderInline } from "@/components/loader/components/loader-inline";
import AppDialog from "@/components/ui/app-dialog";
import AppDialogDescription from "@/components/ui/app-dialog-description";
import AppDialogFooter from "@/components/ui/app-dialog-footer";
import AppDialogHeader from "@/components/ui/app-dialog-header";
import AppDialogTitle from "@/components/ui/app-dialog-title";
import AppSheetContent from "@/components/ui/app-sheet-content";
import { Button } from "@/components/ui/button";
import { ActionButton } from "@/components/ui/primitives/action-button";
import {
  FORM_ACTION_ICONS,
  FORM_ACTION_ICON_CLASS,
} from "@/components/ui/primitives/form-action-icons";
import { APPOINTMENT_CREATE_COPY } from "@/copy/appointment-create-copy";
import { useAppointmentCreateDialog } from "@/lib/hooks/use-appointment-create-dialog";
import type { AppointmentWithRelations } from "@/types/database.types";

type AppointmentCreateDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  appointment?: AppointmentWithRelations | null;
  loading?: boolean;
  initialStartsAt?: Date | null;
  initialPatientId?: string | null;
  onViewDetail?: () => void;
};

export default function AppointmentCreateDialog({
  open,
  onOpenChange,
  appointment = null,
  loading = false,
  initialStartsAt = null,
  initialPatientId = null,
  onViewDetail,
}: AppointmentCreateDialogProps) {
  const dialog = useAppointmentCreateDialog(
    () => onOpenChange(false),
    appointment,
    initialStartsAt,
    initialPatientId,
  );

  const handleOpenChange = (nextOpen: boolean) => {
    onOpenChange(nextOpen);
  };

  const handleCancel = () => {
    dialog.reset();
    onOpenChange(false);
  };

  const isEditing = loading || dialog.isEditing;

  return (
    <AppDialog open={open} onOpenChange={handleOpenChange}>
      <AppSheetContent>
        <AppDialogHeader>
          <AppDialogTitle>
            {isEditing
              ? APPOINTMENT_CREATE_COPY.titleEdit
              : APPOINTMENT_CREATE_COPY.title}
          </AppDialogTitle>
          <AppDialogDescription>
            {APPOINTMENT_CREATE_COPY.description}
          </AppDialogDescription>
        </AppDialogHeader>
        <div className="no-scrollbar min-h-0 flex-1 overflow-y-auto px-1">
          {loading ? (
            <LoaderInline />
          ) : (
            <AppointmentCreateForm
              register={dialog.register}
              control={dialog.control}
              errors={dialog.errors}
              clinic={dialog.clinic}
              treatmentIds={dialog.treatmentIds}
              onToggleTreatment={dialog.toggleTreatment}
              patients={dialog.patients}
              patientsLoading={dialog.patientsLoading}
              employees={dialog.employees}
              employeesLoading={dialog.employeesLoading}
              treatments={dialog.treatments}
              treatmentsLoading={dialog.treatmentsLoading}
              slotsOpen={dialog.slotsOpen}
              slots={dialog.slots}
              slotsLoading={dialog.slotsLoading}
              slotSearchMode={dialog.slotSearchMode}
              onSlotSearchModeChange={dialog.changeSlotSearchMode}
              onOpenSlots={dialog.openSlots}
              onCloseSlots={dialog.closeSlots}
              onSelectSlot={dialog.selectSlot}
              onInvalidStartsAt={dialog.markStartsAtInvalid}
              onValidStartsAt={dialog.markStartsAtValid}
              showPastAppointmentWarning={dialog.showPastAppointmentWarning}
            />
          )}
        </div>
        <AppDialogFooter>
          {isEditing && onViewDetail ? (
            <Button
              type="button"
              variant="ghost"
              onClick={onViewDetail}
              className="mr-auto rounded-button px-3 py-1.5 text-sm"
            >
              <FORM_ACTION_ICONS.viewDetail
                className={FORM_ACTION_ICON_CLASS}
                aria-hidden="true"
              />
              {APPOINTMENT_CREATE_COPY.actions.viewDetail}
            </Button>
          ) : null}
          <Button
            type="button"
            variant="outline"
            onClick={handleCancel}
            className="rounded-button px-3 py-1.5 text-sm"
          >
            <FORM_ACTION_ICONS.cancel
              className={FORM_ACTION_ICON_CLASS}
              aria-hidden="true"
            />
            {APPOINTMENT_CREATE_COPY.actions.cancel}
          </Button>
          <ActionButton
            icon={FORM_ACTION_ICONS.save}
            title={
              dialog.isPending
                ? APPOINTMENT_CREATE_COPY.actions.saving
                : APPOINTMENT_CREATE_COPY.actions.save
            }
            disabled={dialog.isPending || loading}
            testId="appointment-create-submit"
            onClick={dialog.handleSubmit}
          />
        </AppDialogFooter>
      </AppSheetContent>
    </AppDialog>
  );
}
