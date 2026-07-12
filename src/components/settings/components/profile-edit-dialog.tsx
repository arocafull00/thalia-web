"use client";

import ProfileEditForm from "@/components/settings/components/profile-edit-form";
import AppDialog from "@/components/ui/app-dialog";
import AppDialogDescription from "@/components/ui/app-dialog-description";
import AppDialogFooter from "@/components/ui/app-dialog-footer";
import AppDialogHeader from "@/components/ui/app-dialog-header";
import AppDialogTitle from "@/components/ui/app-dialog-title";
import AppSheetContent from "@/components/ui/app-sheet-content";
import { Button } from "@/components/ui/button";
import { ActionButton } from "@/components/ui/primitives/action-button";
import { PROFILE_EDIT_COPY } from "@/copy/profile-edit-copy";
import { useProfileEditDialog } from "@/lib/hooks/use-profile-edit-dialog";
import type { Employee } from "@/types/database.types";

type ProfileEditDialogProps = {
  profile: Employee;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
};

export default function ProfileEditDialog({
  profile,
  open,
  onOpenChange,
  onSuccess,
}: ProfileEditDialogProps) {
  const dialog = useProfileEditDialog(profile, () => {
    onOpenChange(false);
    onSuccess();
  });

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
          <AppDialogTitle>{PROFILE_EDIT_COPY.title}</AppDialogTitle>
          <AppDialogDescription>
            {PROFILE_EDIT_COPY.description}
          </AppDialogDescription>
        </AppDialogHeader>
        <div className="min-h-0 flex-1 overflow-y-auto px-1">
          <ProfileEditForm
            register={dialog.register}
            control={dialog.control}
            errors={dialog.errors}
          />
        </div>
        <AppDialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => handleOpenChange(false)}
            className="rounded-button px-3 py-1.5 text-sm"
          >
            {PROFILE_EDIT_COPY.actions.cancel}
          </Button>
          <ActionButton
            title={
              dialog.isPending
                ? PROFILE_EDIT_COPY.actions.saving
                : PROFILE_EDIT_COPY.actions.save
            }
            disabled={dialog.isPending}
            onClick={dialog.handleSubmit}
          />
        </AppDialogFooter>
      </AppSheetContent>
    </AppDialog>
  );
}
