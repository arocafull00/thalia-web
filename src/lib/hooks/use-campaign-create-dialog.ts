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
  type CampaignSegmentFilters,
} from "@/lib/schemas/campaign-segment-schema";
import { formatZodError } from "@/lib/schemas/schema-helpers";
import { notifySuccess } from "@/lib/sound";

const campaignFormSchema = campaignSchema.omit({ clinic_id: true });

export type CampaignFormValues = z.input<typeof campaignFormSchema>;

export type CampaignSegmentInputs = {
  treatmentId: string;
  monthsSinceLastVisit: string;
  minVisits: string;
  maxVisits: string;
  minAge: string;
  maxAge: string;
};

const defaultValues: CampaignFormValues = {
  title: "",
  content: "",
  footer_text: "",
  footer_website: "",
  footer_phone: "",
  image_url: "",
};

const defaultSegmentInputs: CampaignSegmentInputs = {
  treatmentId: "",
  monthsSinceLastVisit: "",
  minVisits: "",
  maxVisits: "",
  minAge: "",
  maxAge: "",
};

function toNumberOrNull(value: string): number | null {
  const trimmed = value.trim();

  if (!trimmed) {
    return null;
  }

  const parsed = Number(trimmed);
  return Number.isFinite(parsed) ? parsed : null;
}

export function useCampaignCreateDialog(onSuccess: () => void) {
  const clinicId = useClinicId();
  const { mutate, isPending } = useCreateCampaign();
  const [segmentInputs, setSegmentInputs] =
    useState<CampaignSegmentInputs>(defaultSegmentInputs);
  // La imagen se guarda como File y se sube al enviar, no al elegirla: así un
  // formulario cancelado no deja objetos huérfanos en el bucket.
  const [imageFile, setImageFile] = useState<File | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    setError,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm<CampaignFormValues>({
    resolver: zodResolver(campaignFormSchema),
    defaultValues,
  });

  const filters = useMemo<CampaignSegmentFilters>(
    () => ({
      treatmentId: segmentInputs.treatmentId || null,
      minVisits: toNumberOrNull(segmentInputs.minVisits),
      maxVisits: toNumberOrNull(segmentInputs.maxVisits),
      monthsSinceLastVisit: toNumberOrNull(segmentInputs.monthsSinceLastVisit),
      minAge: toNumberOrNull(segmentInputs.minAge),
      maxAge: toNumberOrNull(segmentInputs.maxAge),
    }),
    [segmentInputs],
  );

  const preview = useCampaignSegmentPreview(clinicId, filters);

  const setSegmentInput = (
    field: keyof CampaignSegmentInputs,
    value: string,
  ) => {
    setSegmentInputs((current) => ({ ...current, [field]: value }));
  };

  const onSubmit = handleSubmit(async (data) => {
    clearErrors("root");

    if (!clinicId) {
      setError("root", {
        message: MARKETING_COPY.createDialog.validation.clinicRequired,
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
            setSegmentInputs(defaultSegmentInputs);
            setImageFile(null);
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
    setSegmentInput,
    setImage,
    preview,
    isPending: isPending || isSubmitting,
    reset: () => {
      reset(defaultValues);
      setSegmentInputs(defaultSegmentInputs);
      setImageFile(null);
    },
    handleSubmit: onSubmit,
  };
}
