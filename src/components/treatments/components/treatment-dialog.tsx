import { LoaderInline } from "@/components/loader/components/loader-inline";
import TreatmentForm from "@/components/treatments/components/treatment-form";
import { useTreatmentDialog } from "@/components/treatments/hooks/use-treatment-dialog";
import { TREATMENTS_COPY } from "@/components/treatments/treatments-copy";
import AppDialog from "@/components/ui/app-dialog";
import AppDialogDescription from "@/components/ui/app-dialog-description";
import AppDialogFooter from "@/components/ui/app-dialog-footer";
import AppDialogHeader from "@/components/ui/app-dialog-header";
import AppDialogTitle from "@/components/ui/app-dialog-title";
import AppSheetContent from "@/components/ui/app-sheet-content";
import { Button } from "@/components/ui/button";
import { ActionButton } from "@/components/ui/primitives/action-button";
import { useTreatment } from "@/lib/hooks/use-treatment";

type TreatmentDialogProps = {
  open: boolean;
  treatmentId: string | null;
  onOpenChange: (open: boolean) => void;
  onViewDetail?: () => void;
};

export default function TreatmentDialog({
  open,
  treatmentId,
  onOpenChange,
  onViewDetail,
}: TreatmentDialogProps) {
  const treatmentQuery = useTreatment(treatmentId ?? "");
  const treatment =
    treatmentId && treatmentQuery.data ? treatmentQuery.data : null;
  const dialog = useTreatmentDialog(treatment, () => onOpenChange(false));
  const isEdit = Boolean(treatmentId);

  const handleOpenChange = (nextOpen: boolean) => {
    onOpenChange(nextOpen);
  };

  const handleCancel = () => {
    dialog.reset();
    onOpenChange(false);
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
          {isEdit && treatmentQuery.isLoading ? (
            <LoaderInline />
          ) : (
            <TreatmentForm
              register={dialog.register}
              control={dialog.control}
              errors={dialog.errors}
            />
          )}
        </div>
        <AppDialogFooter>
          {isEdit && onViewDetail ? (
            <Button
              type="button"
              variant="ghost"
              onClick={onViewDetail}
              className="mr-auto rounded-button px-3 py-1.5 text-sm"
            >
              {TREATMENTS_COPY.dialog.viewDetail}
            </Button>
          ) : null}
          <Button
            type="button"
            variant="outline"
            onClick={handleCancel}
            className="rounded-button px-3 py-1.5 text-sm"
          >
            {TREATMENTS_COPY.dialog.cancel}
          </Button>
          <ActionButton
            title={
              dialog.isPending
                ? TREATMENTS_COPY.dialog.saving
                : TREATMENTS_COPY.dialog.save
            }
            disabled={dialog.isPending || (isEdit && treatmentQuery.isLoading)}
            testId="treatment-create-submit"
            onClick={dialog.handleSubmit}
          />
        </AppDialogFooter>
      </AppSheetContent>
    </AppDialog>
  );
}
