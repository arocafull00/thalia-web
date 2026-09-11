"use client";

import EmployeeInviteForm from "@/components/employees/components/form/employee-invite-form";
import { useEmployeeInvitationEditDialog } from "@/components/employees/invitations/hooks/use-employee-invitation-edit-dialog";
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
import { EMPLOYEE_INVITATIONS_COPY } from "@/copy/employee-invitations-copy";
import type { PendingEmployeeInvitation } from "@/types/database.types";

type EmployeeInvitationEditDialogProps = {
  invitation: PendingEmployeeInvitation;
  onClose: () => void;
};

export default function EmployeeInvitationEditDialog({
  invitation,
  onClose,
}: EmployeeInvitationEditDialogProps) {
  const form = useEmployeeInvitationEditDialog(invitation, onClose);

  return (
    <AppDialog
      open
      onOpenChange={(open) => {
        if (!open) {
          onClose();
        }
      }}
    >
      <AppSheetContent>
        <AppDialogHeader>
          <AppDialogTitle>
            {EMPLOYEE_INVITATIONS_COPY.edit.title}
          </AppDialogTitle>
          <AppDialogDescription>
            {EMPLOYEE_INVITATIONS_COPY.edit.description}
          </AppDialogDescription>
        </AppDialogHeader>
        <div className="min-h-0 flex-1 overflow-y-auto px-1">
          <EmployeeInviteForm
            register={form.register}
            control={form.control}
            errors={form.errors}
          />
        </div>
        <AppDialogFooter>
          <Button
            type="button"
            variant="outline"
            disabled={form.isPending}
            onClick={onClose}
            className="rounded-button px-3 py-1.5 text-sm"
          >
            <FORM_ACTION_ICONS.cancel
              className={FORM_ACTION_ICON_CLASS}
              aria-hidden="true"
            />
            {EMPLOYEE_INVITATIONS_COPY.common.dismiss}
          </Button>
          <ActionButton
            icon={FORM_ACTION_ICONS.save}
            title={
              form.isPending
                ? EMPLOYEE_INVITATIONS_COPY.edit.saving
                : EMPLOYEE_INVITATIONS_COPY.edit.save
            }
            disabled={form.isPending || !form.isDirty}
            onClick={form.submit}
          />
        </AppDialogFooter>
      </AppSheetContent>
    </AppDialog>
  );
}
