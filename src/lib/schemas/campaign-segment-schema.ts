import { z } from "zod";

import { uuidSchema } from "@/lib/schemas/schema-helpers";
import type {
  CampaignSegment,
  CampaignSegmentType,
} from "@/types/database.types";

function countField(message: string) {
  return z.coerce
    .number({ message })
    .int(message)
    .nonnegative(message)
    .max(1000, message);
}

const treatmentTypeConfigSchema = z.object({
  treatment_id: uuidSchema("El tratamiento seleccionado no es válido."),
});

const visitCountConfigSchema = z
  .object({
    min_visits: countField(
      "El número mínimo de visitas no es válido.",
    ).nullish(),
    max_visits: countField(
      "El número máximo de visitas no es válido.",
    ).nullish(),
  })
  .refine(
    (value) => value.min_visits != null || value.max_visits != null,
    "Indica al menos un número de visitas.",
  )
  .refine(
    (value) =>
      value.min_visits == null ||
      value.max_visits == null ||
      value.min_visits <= value.max_visits,
    "El mínimo de visitas no puede superar al máximo.",
  );

const lastVisitDateConfigSchema = z.object({
  months_since_last_visit: z.coerce
    .number({ message: "Los meses sin visitar no son válidos." })
    .int("Los meses sin visitar deben ser un número entero.")
    .positive("Los meses sin visitar deben ser mayores que cero.")
    .max(120, "Los meses sin visitar son demasiados."),
});

const ageRangeConfigSchema = z
  .object({
    min_age: countField("La edad mínima no es válida.").nullish(),
    max_age: countField("La edad máxima no es válida.").nullish(),
  })
  .refine(
    (value) => value.min_age != null || value.max_age != null,
    "Indica al menos una edad.",
  )
  .refine(
    (value) =>
      value.min_age == null ||
      value.max_age == null ||
      value.min_age <= value.max_age,
    "La edad mínima no puede superar a la máxima.",
  );

export type CampaignSegmentFilters = {
  treatmentId: string | null;
  minVisits: number | null;
  maxVisits: number | null;
  monthsSinceLastVisit: number | null;
  minAge: number | null;
  maxAge: number | null;
};

export const EMPTY_CAMPAIGN_SEGMENT_FILTERS: CampaignSegmentFilters = {
  treatmentId: null,
  minVisits: null,
  maxVisits: null,
  monthsSinceLastVisit: null,
  minAge: null,
  maxAge: null,
};

const SUPPORTED_SEGMENT_TYPES: CampaignSegmentType[] = [
  "treatment_type",
  "visit_count",
  "last_visit_date",
  "age_range",
];

/**
 * Traduce las filas de campaign_segments a los argumentos de la función
 * campaign_segment_patients. Los filtros se combinan con AND.
 *
 * Lanza si un segmento no se entiende en lugar de ignorarlo: un filtro que se
 * pierde en silencio amplía la audiencia, que es justo el error caro.
 */
export function buildCampaignSegmentFilters(
  segments: Pick<CampaignSegment, "segment_type" | "config">[],
): CampaignSegmentFilters {
  const filters: CampaignSegmentFilters = { ...EMPTY_CAMPAIGN_SEGMENT_FILTERS };
  const seen = new Set<CampaignSegmentType>();

  for (const segment of segments) {
    if (!SUPPORTED_SEGMENT_TYPES.includes(segment.segment_type)) {
      throw new Error(
        `Tipo de segmento no soportado: ${segment.segment_type}.`,
      );
    }

    if (seen.has(segment.segment_type)) {
      throw new Error(
        `Hay dos segmentos del tipo ${segment.segment_type} en la misma campaña.`,
      );
    }

    seen.add(segment.segment_type);

    if (segment.segment_type === "treatment_type") {
      const config = treatmentTypeConfigSchema.parse(segment.config);
      filters.treatmentId = config.treatment_id;
      continue;
    }

    if (segment.segment_type === "visit_count") {
      const config = visitCountConfigSchema.parse(segment.config);
      filters.minVisits = config.min_visits ?? null;
      filters.maxVisits = config.max_visits ?? null;
      continue;
    }

    if (segment.segment_type === "last_visit_date") {
      const config = lastVisitDateConfigSchema.parse(segment.config);
      filters.monthsSinceLastVisit = config.months_since_last_visit;
      continue;
    }

    const config = ageRangeConfigSchema.parse(segment.config);
    filters.minAge = config.min_age ?? null;
    filters.maxAge = config.max_age ?? null;
  }

  return filters;
}

export type CampaignSegmentInputs = {
  treatmentId: string;
  monthsSinceLastVisit: string;
  minVisits: string;
  maxVisits: string;
  minAge: string;
  maxAge: string;
};

export type CampaignSegmentInputErrors = Partial<
  Record<keyof CampaignSegmentInputs, string>
>;

export const EMPTY_CAMPAIGN_SEGMENT_INPUTS: CampaignSegmentInputs = {
  treatmentId: "",
  monthsSinceLastVisit: "",
  minVisits: "",
  maxVisits: "",
  minAge: "",
  maxAge: "",
};

type NumericFieldRule = {
  min: number;
  max: number;
  belowMinMessage: string;
  invalidMessage: string;
  aboveMaxMessage: string;
};

const NUMERIC_RULES: Record<
  Exclude<keyof CampaignSegmentInputs, "treatmentId">,
  NumericFieldRule
> = {
  // Mínimo 1: con 0 la condición SQL queda "última visita anterior a ahora",
  // que incluye a cualquiera que haya venido alguna vez. El filtro dejaría de
  // filtrar sin dar ningún error.
  monthsSinceLastVisit: {
    min: 1,
    max: 120,
    belowMinMessage: "Debe ser 1 mes o más.",
    invalidMessage: "Los meses sin visitar no son válidos.",
    aboveMaxMessage: "Como máximo 120 meses.",
  },
  minVisits: {
    min: 0,
    max: 1000,
    belowMinMessage: "No puede ser negativo.",
    invalidMessage: "El número de visitas no es válido.",
    aboveMaxMessage: "Valor demasiado alto.",
  },
  maxVisits: {
    min: 0,
    max: 1000,
    belowMinMessage: "No puede ser negativo.",
    invalidMessage: "El número de visitas no es válido.",
    aboveMaxMessage: "Valor demasiado alto.",
  },
  minAge: {
    min: 0,
    max: 120,
    belowMinMessage: "No puede ser negativa.",
    invalidMessage: "La edad no es válida.",
    aboveMaxMessage: "Como máximo 120 años.",
  },
  maxAge: {
    min: 0,
    max: 120,
    belowMinMessage: "No puede ser negativa.",
    invalidMessage: "La edad no es válida.",
    aboveMaxMessage: "Como máximo 120 años.",
  },
};

type ParsedField = { value: number | null; error: string | null };

function parseNumericField(raw: string, rule: NumericFieldRule): ParsedField {
  const trimmed = raw.trim();

  if (!trimmed) {
    return { value: null, error: null };
  }

  const parsed = Number(trimmed);

  if (!Number.isFinite(parsed) || !Number.isInteger(parsed)) {
    return { value: null, error: rule.invalidMessage };
  }

  if (parsed < rule.min) {
    return { value: null, error: rule.belowMinMessage };
  }

  if (parsed > rule.max) {
    return { value: null, error: rule.aboveMaxMessage };
  }

  return { value: parsed, error: null };
}

/**
 * Valida lo que se escribe en el editor y produce los filtros de la consulta.
 *
 * Un campo inválido no aporta valor a los filtros: así un error de escritura
 * nunca llega al DAL convertido en un filtro que no filtra, que es justo lo que
 * pasaba escribiendo 0 en "no viene desde hace meses".
 */
export function parseCampaignSegmentInputs(inputs: CampaignSegmentInputs): {
  filters: CampaignSegmentFilters;
  errors: CampaignSegmentInputErrors;
  isValid: boolean;
} {
  const errors: CampaignSegmentInputErrors = {};
  const parsed = {} as Record<
    Exclude<keyof CampaignSegmentInputs, "treatmentId">,
    number | null
  >;

  for (const [field, rule] of Object.entries(NUMERIC_RULES)) {
    const key = field as keyof typeof NUMERIC_RULES;
    const result = parseNumericField(inputs[key], rule);
    parsed[key] = result.value;

    if (result.error) {
      errors[key] = result.error;
    }
  }

  if (
    parsed.minVisits != null &&
    parsed.maxVisits != null &&
    parsed.minVisits > parsed.maxVisits
  ) {
    errors.maxVisits = "El máximo no puede ser menor que el mínimo.";
  }

  if (
    parsed.minAge != null &&
    parsed.maxAge != null &&
    parsed.minAge > parsed.maxAge
  ) {
    errors.maxAge = "La edad máxima no puede ser menor que la mínima.";
  }

  const isValid = Object.keys(errors).length === 0;

  return {
    filters: {
      treatmentId: inputs.treatmentId || null,
      minVisits: parsed.minVisits,
      maxVisits: parsed.maxVisits,
      monthsSinceLastVisit: parsed.monthsSinceLastVisit,
      minAge: parsed.minAge,
      maxAge: parsed.maxAge,
    },
    errors,
    isValid,
  };
}

/**
 * Inversa de buildCampaignSegmentFilters: convierte los filtros del editor en
 * las filas que se guardan en campaign_segments. Los filtros sin valor no
 * generan fila, de modo que una campaña sin segmentación no guarda ninguna.
 */
export function buildSegmentsFromFilters(
  filters: CampaignSegmentFilters,
): Pick<CampaignSegment, "segment_type" | "config">[] {
  const segments: Pick<CampaignSegment, "segment_type" | "config">[] = [];

  if (filters.treatmentId) {
    segments.push({
      segment_type: "treatment_type",
      config: { treatment_id: filters.treatmentId },
    });
  }

  if (filters.minVisits != null || filters.maxVisits != null) {
    segments.push({
      segment_type: "visit_count",
      config: {
        ...(filters.minVisits != null ? { min_visits: filters.minVisits } : {}),
        ...(filters.maxVisits != null ? { max_visits: filters.maxVisits } : {}),
      },
    });
  }

  if (filters.monthsSinceLastVisit != null) {
    segments.push({
      segment_type: "last_visit_date",
      config: { months_since_last_visit: filters.monthsSinceLastVisit },
    });
  }

  if (filters.minAge != null || filters.maxAge != null) {
    segments.push({
      segment_type: "age_range",
      config: {
        ...(filters.minAge != null ? { min_age: filters.minAge } : {}),
        ...(filters.maxAge != null ? { max_age: filters.maxAge } : {}),
      },
    });
  }

  return segments;
}

/**
 * Camino inverso de `parseCampaignSegmentInputs`: pasa los filtros de una
 * campaña guardada a las cadenas que espera el formulario.
 *
 * Hace falta para editar un borrador, porque los segmentos viven en filas
 * aparte y hay que devolverlos a los inputs tal y como se escribieron.
 */
export function campaignSegmentInputsFromFilters(
  filters: CampaignSegmentFilters,
): CampaignSegmentInputs {
  const toInput = (value: number | null) =>
    value == null ? "" : String(value);

  return {
    treatmentId: filters.treatmentId ?? "",
    monthsSinceLastVisit: toInput(filters.monthsSinceLastVisit),
    minVisits: toInput(filters.minVisits),
    maxVisits: toInput(filters.maxVisits),
    minAge: toInput(filters.minAge),
    maxAge: toInput(filters.maxAge),
  };
}
