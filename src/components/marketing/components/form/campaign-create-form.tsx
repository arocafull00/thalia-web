import type { FieldErrors, UseFormRegister } from "react-hook-form";

import CampaignImageField from "@/components/marketing/components/form/campaign-image-field";
import CampaignMessageFields from "@/components/marketing/components/form/campaign-message-fields";
import CampaignMessagePreview from "@/components/marketing/components/form/campaign-message-preview";
import CampaignRecipientsPreview from "@/components/marketing/components/form/campaign-recipients-preview";
import CampaignSegmentFields, {
  type TreatmentOption,
} from "@/components/marketing/components/form/campaign-segment-fields";
import CampaignStepIndicator from "@/components/marketing/components/form/campaign-step-indicator";
import type {
  CampaignFormValues,
  CampaignSegmentInputs,
  CampaignStep,
} from "@/lib/hooks/use-campaign-create-dialog";
import type { CampaignSegmentInputErrors } from "@/lib/schemas/campaign-segment-schema";

type CampaignCreateFormProps = {
  step: CampaignStep;
  stepIndex: number;
  register: UseFormRegister<CampaignFormValues>;
  errors: FieldErrors<CampaignFormValues>;
  segmentInputs: CampaignSegmentInputs;
  segmentErrors: CampaignSegmentInputErrors;
  treatments: TreatmentOption[];
  onSegmentChange: (field: keyof CampaignSegmentInputs, value: string) => void;
  onImageChange: (file: File | null) => void;
  currentImageUrl: string | null;
  previewContent: string;
  previewFooterText: string;
  previewFooterWebsite: string;
  previewFooterPhone: string;
  previewImageUrl: string | null;
  recipientCount: number | null;
  recipientsLoading: boolean;
  recipientsError: boolean;
};

export default function CampaignCreateForm({
  step,
  stepIndex,
  register,
  errors,
  segmentInputs,
  segmentErrors,
  treatments,
  onSegmentChange,
  onImageChange,
  currentImageUrl,
  previewContent,
  previewFooterText,
  previewFooterWebsite,
  previewFooterPhone,
  previewImageUrl,
  recipientCount,
  recipientsLoading,
  recipientsError,
}: CampaignCreateFormProps) {
  return (
    <div className="mt-4 space-y-6">
      <CampaignStepIndicator stepIndex={stepIndex} />

      {/* Los pasos se ocultan, no se desmontan. El Dropzone guarda el archivo
          elegido en su propio estado y notifica al montarse: desmontarlo al
          cambiar de paso borraría la imagen seleccionada al volver. `hidden`
          además saca el contenido del orden de tabulación. */}
      <div className={step === "message" ? "space-y-6" : "hidden"}>
        <CampaignMessageFields register={register} errors={errors} />
      </div>

      <div className={step === "image" ? "space-y-6" : "hidden"}>
        <CampaignImageField
          onFileChange={onImageChange}
          currentImageUrl={currentImageUrl}
        />
      </div>

      <div className={step === "segment" ? "space-y-6" : "hidden"}>
        <CampaignSegmentFields
          inputs={segmentInputs}
          errors={segmentErrors}
          treatments={treatments}
          onChange={onSegmentChange}
        />
        <CampaignRecipientsPreview
          count={recipientCount}
          isLoading={recipientsLoading}
          hasError={recipientsError}
          testId="campaign-recipients-preview"
        />
      </div>

      <div className={step === "review" ? "space-y-6" : "hidden"}>
        <CampaignMessagePreview
          content={previewContent}
          footerText={previewFooterText}
          footerWebsite={previewFooterWebsite}
          footerPhone={previewFooterPhone}
          imageUrl={previewImageUrl}
        />
        <CampaignRecipientsPreview
          count={recipientCount}
          isLoading={recipientsLoading}
          hasError={recipientsError}
          testId="campaign-review-recipients"
        />
      </div>
    </div>
  );
}
