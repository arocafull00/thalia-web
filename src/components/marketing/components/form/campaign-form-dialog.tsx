"use client";

import CampaignCreateForm from "@/components/marketing/components/form/campaign-create-form";
import type { TreatmentOption } from "@/components/marketing/components/form/campaign-segment-fields";
import { MARKETING_COPY } from "@/components/marketing/marketing-copy";
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
import type { useCampaignCreateDialog } from "@/lib/hooks/use-campaign-create-dialog";

const { createDialog, editDialog } = MARKETING_COPY;

type CampaignFormDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  dialog: ReturnType<typeof useCampaignCreateDialog>;
  treatments: TreatmentOption[];
  onCancel: () => void;
};

/**
 * Asistente de campaña en diálogo, compartido por el listado (crear) y el
 * detalle (editar un borrador). El modo lo decide el hook: aquí sólo cambian
 * los textos según `dialog.isEditing`.
 */
export default function CampaignFormDialog({
  open,
  onOpenChange,
  dialog,
  treatments,
  onCancel,
}: CampaignFormDialogProps) {
  const DismissStepIcon = dialog.isFirstStep
    ? FORM_ACTION_ICONS.cancel
    : FORM_ACTION_ICONS.back;

  return (
    <AppDialog open={open} onOpenChange={onOpenChange}>
      <AppSheetContent>
        <AppDialogHeader>
          <AppDialogTitle>
            {dialog.isEditing ? editDialog.title : createDialog.title}
          </AppDialogTitle>
          <AppDialogDescription>
            {dialog.isEditing
              ? editDialog.description
              : createDialog.description}
          </AppDialogDescription>
        </AppDialogHeader>
        <div className="min-h-0 flex-1 overflow-y-auto px-1">
          <CampaignCreateForm
            step={dialog.step}
            stepIndex={dialog.stepIndex}
            register={dialog.register}
            errors={dialog.errors}
            segmentInputs={dialog.segmentInputs}
            segmentErrors={dialog.segmentErrors}
            treatments={treatments}
            onSegmentChange={dialog.setSegmentInput}
            onImageChange={dialog.setImage}
            currentImageUrl={dialog.storedImageUrl}
            previewContent={dialog.watch("content") ?? ""}
            previewFooterText={dialog.watch("footer_text") ?? ""}
            previewFooterWebsite={dialog.watch("footer_website") ?? ""}
            previewFooterPhone={dialog.watch("footer_phone") ?? ""}
            previewImageUrl={dialog.imagePreviewUrl}
            recipientCount={dialog.preview.count}
            recipientsLoading={dialog.preview.isLoading}
            recipientsError={dialog.preview.error != null}
          />
        </div>
        <AppDialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={dialog.isFirstStep ? onCancel : dialog.goBack}
            className="rounded-button px-3 py-1.5 text-sm"
          >
            <DismissStepIcon
              className={FORM_ACTION_ICON_CLASS}
              aria-hidden="true"
            />
            {dialog.isFirstStep
              ? createDialog.actions.cancel
              : createDialog.actions.back}
          </Button>
          {dialog.isLastStep ? (
            <ActionButton
              icon={FORM_ACTION_ICONS.save}
              title={
                dialog.isPending
                  ? dialog.isEditing
                    ? editDialog.saving
                    : createDialog.actions.saving
                  : dialog.isEditing
                    ? editDialog.save
                    : createDialog.actions.save
              }
              disabled={dialog.isPending}
              testId="campaign-create-submit"
              onClick={dialog.handleSubmit}
            />
          ) : (
            <ActionButton
              title={createDialog.actions.next}
              testId="campaign-create-next"
              onClick={() => void dialog.goNext()}
            />
          )}
        </AppDialogFooter>
      </AppSheetContent>
    </AppDialog>
  );
}
