import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import type { z } from "zod";

import { MARKETING_COPY } from "@/components/marketing/marketing-copy";
import {
  getCampaignSegments,
  replaceCampaignSegments,
} from "@/dal/campaign-segments.dal";
import { uploadCampaignImage } from "@/lib/campaign-image-storage";
import { useClinicId } from "@/lib/hooks/use-active-clinic";
import { useCampaignImageUrl } from "@/lib/hooks/use-campaign-image-url";
import { useCampaignSegmentPreview } from "@/lib/hooks/use-campaign-segment-preview";
import {
  useCreateCampaign,
  useUpdateCampaign,
} from "@/lib/hooks/use-campaigns";
import { logger } from "@/lib/logger";
import { campaignSchema } from "@/lib/schemas/campaign-schema";
import {
  buildCampaignSegmentFilters,
  buildSegmentsFromFilters,
  campaignSegmentInputsFromFilters,
  EMPTY_CAMPAIGN_SEGMENT_INPUTS,
  parseCampaignSegmentInputs,
  type CampaignSegmentInputs,
} from "@/lib/schemas/campaign-segment-schema";
import { formatZodError } from "@/lib/schemas/schema-helpers";
import { notifySuccess } from "@/lib/sound";
import type { Campaign } from "@/types/database.types";

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

function formValuesFromCampaign(campaign: Campaign): CampaignFormValues {
  return {
    title: campaign.title,
    content: campaign.content,
    footer_text: campaign.footer_text ?? "",
    footer_website: campaign.footer_website ?? "",
    footer_phone: campaign.footer_phone ?? "",
    image_url: campaign.image_url ?? "",
  };
}

/**
 * Asistente de campaña, en creación o en edición de un borrador.
 *
 * Con `campaign` precarga sus valores y sus segmentos, y al guardar actualiza
 * en lugar de insertar. Sólo se abre para borradores: una campaña enviada no
 * se toca, porque el mensaje ya salió.
 */
export function useCampaignCreateDialog(
  onSuccess: () => void,
  campaign?: Campaign | null,
) {
  const clinicId = useClinicId();
  const { mutate, isPending } = useCreateCampaign();
  const { mutate: mutateUpdate, isPending: isUpdating } = useUpdateCampaign();
  const editingId = campaign?.id ?? null;
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
    // Precarga en edición. Se usa `values` y no un reset en efecto: react-hook-form
    // sincroniza el formulario cuando cambia, sin setState síncrono en un efecto.
    ...(campaign ? { values: formValuesFromCampaign(campaign) } : {}),
    // Sin esto, al pulsar "Siguiente" el paso 1 se valida pero los errores no
    // se repintan hasta el submit final.
    mode: "onTouched",
  });

  // Los segmentos viven en filas aparte, así que hay que traerlos. Depende del
  // id y no del objeto para no repisar lo que el usuario esté escribiendo cada
  // vez que se refresque la campaña en la caché.
  useEffect(() => {
    if (!editingId) {
      return;
    }

    let cancelled = false;

    getCampaignSegments(editingId)
      .then((segments) => {
        if (cancelled) {
          return;
        }

        setSegmentInputs(
          campaignSegmentInputsFromFilters(
            buildCampaignSegmentFilters(segments),
          ),
        );
      })
      .catch((cause) => {
        logger.captureException(cause, {
          hook: "use-campaign-create-dialog",
          action: "getCampaignSegments",
          campaignId: editingId,
        });
        setError("root", { message: MARKETING_COPY.editDialog.segmentsError });
      });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editingId]);

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
    // borrador apuntando a una imagen que no existe. Editando sin elegir
    // archivo nuevo se conserva la que ya tenía.
    let imageKey: string | null = campaign?.image_url ?? null;

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

    // Los segmentos se guardan aparte de la campaña. Si esto falla, la campaña
    // ya está guardada como borrador, así que se avisa sin perder el texto en
    // lugar de fingir que todo fue bien.
    const saveSegments = (campaignId: string) =>
      replaceCampaignSegments(campaignId, buildSegmentsFromFilters(filters))
        .then(() => {
          notifySuccess(
            editingId
              ? MARKETING_COPY.editDialog.success
              : MARKETING_COPY.createDialog.success,
          );

          // Editando se conservan los valores: la campaña sigue existiendo y
          // el diálogo puede reabrirse sobre ella.
          if (!editingId) {
            reset(defaultValues);
            setSegmentInputs(EMPTY_CAMPAIGN_SEGMENT_INPUTS);
          }

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
          setError("root", { message: MARKETING_COPY.createDialog.error });
        });

    if (editingId) {
      mutateUpdate(editingId, parsed.data, {
        onSuccess: () => void saveSegments(editingId),
        onError: (cause) => {
          setError("root", {
            message: cause.message || MARKETING_COPY.editDialog.error,
          });
        },
      });
      return;
    }

    mutate(parsed.data, {
      onSuccess: (campaignId) => {
        void saveSegments(campaignId);
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

  // URL efímera para que la revisión enseñe la imagen elegida. Se crea aquí,
  // donde vive el File, para que la vista previa siga recibiendo sólo props.
  // Es un valor derivado, así que va en useMemo y no en estado; el efecto sólo
  // se ocupa de liberar la URL anterior.
  const objectUrl = useMemo(
    () => (imageFile ? URL.createObjectURL(imageFile) : null),
    [imageFile],
  );

  // Imagen ya guardada en el borrador. El bucket es privado, así que hay que
  // pedir una URL firmada; no basta con la clave.
  const { url: storedImageUrl } = useCampaignImageUrl(
    campaign?.image_url ?? null,
  );

  // El archivo recién elegido manda sobre el guardado: es lo que se subirá.
  const imagePreviewUrl = objectUrl ?? storedImageUrl;

  useEffect(() => {
    if (!objectUrl) {
      return;
    }

    return () => URL.revokeObjectURL(objectUrl);
  }, [objectUrl]);

  return {
    register,
    errors,
    watch,
    segmentInputs,
    segmentErrors,
    isSegmentValid,
    setSegmentInput,
    setImage,
    imagePreviewUrl,
    storedImageUrl,
    preview,
    step,
    stepIndex,
    stepCount: CAMPAIGN_STEPS.length,
    isFirstStep: stepIndex === 0,
    isLastStep: stepIndex === CAMPAIGN_STEPS.length - 1,
    goNext,
    goBack,
    isEditing: editingId != null,
    isPending: isPending || isUpdating || isSubmitting,
    reset: () => {
      reset(defaultValues);
      setSegmentInputs(EMPTY_CAMPAIGN_SEGMENT_INPUTS);
      setImageFile(null);
      setStepIndex(0);
    },
    handleSubmit: onSubmit,
  };
}
