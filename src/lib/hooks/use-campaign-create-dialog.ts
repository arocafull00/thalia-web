import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import type { z } from "zod";

import { MARKETING_COPY } from "@/components/marketing/marketing-copy";
import { replaceCampaignSegments } from "@/dal/campaign-segments.dal";
import { uploadCampaignImage } from "@/lib/campaign-image-storage";
import { useClinicId } from "@/lib/hooks/use-active-clinic";
import { useCampaignSegmentPreview } from "@/lib/hooks/use-campaign-segment-preview";
import { useCreateCampaign } from "@/lib/hooks/use-campaigns";
import { logger } from "@/lib/logger";
import { campaignSchema } from "@/lib/schemas/campaign-schema";
import {
  buildSegmentsFromFilters,
  EMPTY_CAMPAIGN_SEGMENT_INPUTS,
  parseCampaignSegmentInputs,
  type CampaignSegmentInputs,
} from "@/lib/schemas/campaign-segment-schema";
import { formatZodError } from "@/lib/schemas/schema-helpers";
import { notifySuccess } from "@/lib/sound";

const campaignFormSchema = campaignSchema.omit({ clinic_id: true });

export type CampaignFormValues = z.input<typeof campaignFormSchema>;

export type { CampaignSegmentInputs };

export const CAMPAIGN_STEPS = [
  "message",
  "image",
  "segment",
  "review",
] as const;

export type CampaignStep = (typeof CAMPAIGN_STEPS)[number];

const defaultValues: CampaignFormValues = {
  title: "",
  content: "",
  footer_text: "",
  footer_website: "",
  footer_phone: "",
  image_url: "",
};

export function useCampaignCreateDialog(onSuccess: () => void) {
  const clinicId = useClinicId();
  const { mutate, isPending } = useCreateCampaign();
  const [segmentInputs, setSegmentInputs] = useState<CampaignSegmentInputs>(
    EMPTY_CAMPAIGN_SEGMENT_INPUTS,
  );
  // La imagen se guarda como File y se sube al enviar, no al elegirla: así un
  // formulario cancelado no deja objetos huérfanos en el bucket.
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [stepIndex, setStepIndex] = useState(0);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    trigger,
    setError,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm<CampaignFormValues>({
    resolver: zodResolver(campaignFormSchema),
    defaultValues,
    // Sin esto, al pulsar "Siguiente" el paso 1 se valida pero los errores no
    // se repintan hasta el submit final.
    mode: "onTouched",
  });

  const {
    filters,
    errors: segmentErrors,
    isValid: isSegmentValid,
  } = useMemo(() => parseCampaignSegmentInputs(segmentInputs), [segmentInputs]);

  // Con filtros inválidos no se consulta: mostrar un contador calculado con un
  // filtro que se ha descartado sería peor que no mostrar ninguno.
  const preview = useCampaignSegmentPreview(
    isSegmentValid ? clinicId : null,
    filters,
  );

  const setSegmentInput = (
    field: keyof CampaignSegmentInputs,
    value: string,
  ) => {
    setSegmentInputs((current) => ({ ...current, [field]: value }));
  };

  const step = CAMPAIGN_STEPS[stepIndex];

  // Cada paso valida lo suyo antes de dejar avanzar: así el usuario corrige el
  // error donde está el campo, no al final con la pantalla de revisión delante.
  const goNext = async () => {
    if (step === "message") {
      const valid = await trigger(["title", "content"]);

      if (!valid) {
        return;
      }
    }

    if (step === "segment" && !isSegmentValid) {
      return;
    }

    setStepIndex((current) => Math.min(current + 1, CAMPAIGN_STEPS.length - 1));
  };

  const goBack = () => setStepIndex((current) => Math.max(current - 1, 0));

  const onSubmit = handleSubmit(async (data) => {
    clearErrors("root");

    if (!clinicId) {
      setError("root", {
        message: MARKETING_COPY.createDialog.validation.clinicRequired,
      });
      return;
    }

    // Se corta antes de subir la imagen: si la segmentación no vale, no tiene
    // sentido dejar un objeto en el bucket para una campaña que no se guarda.
    if (!isSegmentValid) {
      setError("root", {
        message: MARKETING_COPY.createDialog.validation.segmentInvalid,
      });
      return;
    }

    // La imagen se sube antes de crear la campaña: si falla, no queda un
    // borrador apuntando a una imagen que no existe.
    let imageKey: string | null = null;

    if (imageFile) {
      try {
        imageKey = await uploadCampaignImage(clinicId, imageFile);
      } catch (cause) {
        logger.captureException(cause, {
          hook: "use-campaign-create-dialog",
          action: "uploadCampaignImage",
        });
        setError("root", { message: MARKETING_COPY.image.uploadError });
        return;
      }
    }

    const parsed = campaignSchema.safeParse({
      clinic_id: clinicId,
      ...data,
      image_url: imageKey,
    });

    if (!parsed.success) {
      setError("root", { message: formatZodError(parsed.error) });
      return;
    }

    mutate(parsed.data, {
      onSuccess: (campaignId) => {
        // Los segmentos se guardan aparte de la campaña. Si esto falla, la
        // campaña ya existe como borrador, así que se avisa sin perder el texto
        // en lugar de fingir que todo fue bien.
        replaceCampaignSegments(campaignId, buildSegmentsFromFilters(filters))
          .then(() => {
            notifySuccess(MARKETING_COPY.createDialog.success);
            reset(defaultValues);
            setSegmentInputs(EMPTY_CAMPAIGN_SEGMENT_INPUTS);
            setImageFile(null);
            setStepIndex(0);
            onSuccess();
          })
          .catch((cause) => {
            logger.captureException(cause, {
              hook: "use-campaign-create-dialog",
              action: "replaceCampaignSegments",
              campaignId,
            });
            setError("root", {
              message: MARKETING_COPY.createDialog.error,
            });
          });
      },
      onError: (cause) => {
        setError("root", {
          message: cause.message || MARKETING_COPY.createDialog.error,
        });
      },
    });
  });

  // Estable para que el efecto del Dropzone no se dispare en cada render.
  const setImage = useCallback((file: File | null) => setImageFile(file), []);

  return {
    register,
    errors,
    watch,
    segmentInputs,
    segmentErrors,
    isSegmentValid,
    setSegmentInput,
    setImage,
    preview,
    step,
    stepIndex,
    stepCount: CAMPAIGN_STEPS.length,
    isFirstStep: stepIndex === 0,
    isLastStep: stepIndex === CAMPAIGN_STEPS.length - 1,
    goNext,
    goBack,
    isPending: isPending || isSubmitting,
    reset: () => {
      reset(defaultValues);
      setSegmentInputs(EMPTY_CAMPAIGN_SEGMENT_INPUTS);
      setImageFile(null);
      setStepIndex(0);
    },
    handleSubmit: onSubmit,
  };
}
