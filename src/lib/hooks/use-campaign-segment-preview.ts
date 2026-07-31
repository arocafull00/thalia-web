import { useEffect, useState } from "react";

import { countCampaignSegmentPatients } from "@/dal/campaign-segments.dal";
import { useDebouncedValue } from "@/lib/hooks/use-debounced-value";
import { logger } from "@/lib/logger";
import type { CampaignSegmentFilters } from "@/lib/schemas/campaign-segment-schema";

const DEBOUNCE_MS = 400;

type PreviewResult = {
  filters: CampaignSegmentFilters;
  count: number;
};

/**
 * Cuenta los destinatarios del segmento mientras se editan los filtros.
 *
 * El resultado guarda los filtros con los que se calculó, así que "está
 * cargando" se deriva de compararlos con los actuales en lugar de mantener un
 * flag aparte: no hace falta escribir estado dentro del efecto y el contador
 * nunca aparece como definitivo cuando en realidad es de un filtro anterior.
 */
export function useCampaignSegmentPreview(
  clinicId: string | null,
  filters: CampaignSegmentFilters,
) {
  const debouncedFilters = useDebouncedValue(filters, DEBOUNCE_MS);
  const [result, setResult] = useState<PreviewResult | null>(null);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!clinicId) {
      return;
    }

    let cancelled = false;

    countCampaignSegmentPatients(clinicId, debouncedFilters)
      .then((count) => {
        if (cancelled) {
          return;
        }

        setResult({ filters: debouncedFilters, count });
        setError(null);
      })
      .catch((cause) => {
        if (cancelled) {
          return;
        }

        const resolved =
          cause instanceof Error ? cause : new Error(String(cause));
        logger.captureException(resolved, {
          hook: "use-campaign-segment-preview",
          clinicId,
        });
        setError(resolved);
      });

    return () => {
      cancelled = true;
    };
  }, [clinicId, debouncedFilters]);

  const isFresh = result != null && result.filters === filters;

  return {
    count: clinicId && isFresh ? result.count : null,
    isLoading: clinicId != null && !isFresh && error == null,
    error,
  };
}
