import TreatmentForm from "@/components/treatments/components/treatment-form";
import { useTreatmentDialog } from "@/components/treatments/hooks/use-treatment-dialog";
import { TREATMENTS_COPY } from "@/components/treatments/treatments-copy";
import AppDialog from "@/components/ui/app-dialog";
import AppDialogDescription from "@/components/ui/app-dialog-description";
import AppDialogFooter from "@/components/ui/app-dialog-footer";
import AppDialogHeader from "@/components/ui/app-dialog-header";
import AppDialogTitle from "@/components/ui/app-dialog-title";
import AppSheetContent from "@/components/ui/app-sheet-content";
import { ActionButton } from "@/components/ui/primitives/action-button";
import { useTreatment } from "@/lib/hooks/use-treatment";

type TreatmentDialogProps = {
  open: boolean;
  treatmentId: string | null;
  onOpenChange: (open: boolean) => void;
};

export default function TreatmentDialog({
  open,
  treatmentId,
  onOpenChange,
}: TreatmentDialogProps) {
  const treatmentQuery = useTreatment(treatmentId ?? "");
  const treatment =
    treatmentId && treatmentQuery.data ? treatmentQuery.data : null;
  const dialog = useTreatmentDialog(treatment, () => onOpenChange(false));
  const isEdit = Boolean(treatmentId);

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
            {isEdit
              ? TREATMENTS_COPY.dialog.editTitle
              : TREATMENTS_COPY.dialog.createTitle}
          </AppDialogTitle>
          <AppDialogDescription>
            {isEdit
              ? TREATMENTS_COPY.dialog.editDescription
              : TREATMENTS_COPY.dialog.createDescription}
          </AppDialogDescription>
        </AppDialogHeader>
        <div className="min-h-0 flex-1 overflow-y-auto px-1">
          {isEdit && treatmentQuery.isLoading ? null : (
            <TreatmentForm
              register={dialog.register}
              control={dialog.control}
              errors={dialog.errors}
            />
          )}
        </div>
        <AppDialogFooter>
          <button
            type="button"
            onClick={() => handleOpenChange(false)}
            className="rounded-full border border-border px-4 py-2 text-xs font-medium uppercase tracking-wide text-ink-secondary hover:bg-canvas"
          >
            {TREATMENTS_COPY.dialog.cancel}
          </button>
          <ActionButton
            title={
              dialog.isPending
                ? TREATMENTS_COPY.dialog.saving
                : TREATMENTS_COPY.dialog.save
            }
            disabled={dialog.isPending || (isEdit && treatmentQuery.isLoading)}
            onClick={dialog.handleSubmit}
          />
        </AppDialogFooter>
      </AppSheetContent>
    </AppDialog>
  );
}
