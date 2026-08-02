import { describe, expect, it } from "vitest";

import {
  buildCampaignSegmentFilters,
  buildSegmentsFromFilters,
  EMPTY_CAMPAIGN_SEGMENT_FILTERS,
  EMPTY_CAMPAIGN_SEGMENT_INPUTS,
  parseCampaignSegmentInputs,
} from "@/lib/schemas/campaign-segment-schema";
import type { CampaignSegment } from "@/types/database.types";

const TREATMENT_ID = "40000000-0000-4000-8000-000000000001";

type SegmentInput = Pick<CampaignSegment, "segment_type" | "config">;

const segment = (
  segment_type: CampaignSegment["segment_type"],
  config: Record<string, unknown>,
): SegmentInput => ({ segment_type, config });

describe("buildCampaignSegmentFilters", () => {
  it("sin segmentos no aplica ningún filtro", () => {
    expect(buildCampaignSegmentFilters([])).toEqual(
      EMPTY_CAMPAIGN_SEGMENT_FILTERS,
    );
  });

  it("traduce el segmento de tratamiento", () => {
    const filters = buildCampaignSegmentFilters([
      segment("treatment_type", { treatment_id: TREATMENT_ID }),
    ]);

    expect(filters.treatmentId).toBe(TREATMENT_ID);
    expect(filters.minVisits).toBeNull();
  });

  it("traduce el rango de visitas", () => {
    const filters = buildCampaignSegmentFilters([
      segment("visit_count", { min_visits: 2, max_visits: 5 }),
    ]);

    expect(filters.minVisits).toBe(2);
    expect(filters.maxVisits).toBe(5);
  });

  it("acepta solo el mínimo de visitas", () => {
    const filters = buildCampaignSegmentFilters([
      segment("visit_count", { min_visits: 3 }),
    ]);

    expect(filters.minVisits).toBe(3);
    expect(filters.maxVisits).toBeNull();
  });

  it("traduce los meses sin visitar", () => {
    const filters = buildCampaignSegmentFilters([
      segment("last_visit_date", { months_since_last_visit: 6 }),
    ]);

    expect(filters.monthsSinceLastVisit).toBe(6);
  });

  it("traduce la franja de edad", () => {
    const filters = buildCampaignSegmentFilters([
      segment("age_range", { min_age: 30, max_age: 50 }),
    ]);

    expect(filters.minAge).toBe(30);
    expect(filters.maxAge).toBe(50);
  });

  it("combina varios segmentos con AND", () => {
    const filters = buildCampaignSegmentFilters([
      segment("treatment_type", { treatment_id: TREATMENT_ID }),
      segment("last_visit_date", { months_since_last_visit: 6 }),
      segment("visit_count", { min_visits: 1 }),
    ]);

    expect(filters).toEqual({
      treatmentId: TREATMENT_ID,
      minVisits: 1,
      maxVisits: null,
      monthsSinceLastVisit: 6,
      minAge: null,
      maxAge: null,
    });
  });

  it("rechaza un tipo de segmento no soportado en vez de ignorarlo", () => {
    expect(() =>
      buildCampaignSegmentFilters([segment("custom_filter", {})]),
    ).toThrow(/no soportado/i);
  });

  it("rechaza dos segmentos del mismo tipo", () => {
    expect(() =>
      buildCampaignSegmentFilters([
        segment("visit_count", { min_visits: 1 }),
        segment("visit_count", { min_visits: 5 }),
      ]),
    ).toThrow(/dos segmentos/i);
  });

  it("rechaza un tratamiento que no es un UUID", () => {
    expect(() =>
      buildCampaignSegmentFilters([
        segment("treatment_type", { treatment_id: "no-es-uuid" }),
      ]),
    ).toThrow();
  });

  it("rechaza un rango de visitas invertido", () => {
    expect(() =>
      buildCampaignSegmentFilters([
        segment("visit_count", { min_visits: 10, max_visits: 2 }),
      ]),
    ).toThrow();
  });

  it("rechaza un rango de visitas vacío", () => {
    expect(() =>
      buildCampaignSegmentFilters([segment("visit_count", {})]),
    ).toThrow();
  });

  it("rechaza meses sin visitar en cero o negativos", () => {
    expect(() =>
      buildCampaignSegmentFilters([
        segment("last_visit_date", { months_since_last_visit: 0 }),
      ]),
    ).toThrow();
  });

  it("rechaza una franja de edad invertida", () => {
    expect(() =>
      buildCampaignSegmentFilters([
        segment("age_range", { min_age: 60, max_age: 20 }),
      ]),
    ).toThrow();
  });
});

describe("parseCampaignSegmentInputs", () => {
  const inputs = (
    overrides: Partial<typeof EMPTY_CAMPAIGN_SEGMENT_INPUTS>,
  ) => ({
    ...EMPTY_CAMPAIGN_SEGMENT_INPUTS,
    ...overrides,
  });

  it("sin nada escrito no aplica filtros y es válido", () => {
    const result = parseCampaignSegmentInputs(EMPTY_CAMPAIGN_SEGMENT_INPUTS);

    expect(result.isValid).toBe(true);
    expect(result.filters).toEqual(EMPTY_CAMPAIGN_SEGMENT_FILTERS);
  });

  // El bug: un 0 se colaba como filtro y la condición SQL pasaba a incluir a
  // cualquiera que hubiese venido alguna vez.
  it("rechaza 0 meses sin visitar y no lo deja pasar al filtro", () => {
    const result = parseCampaignSegmentInputs(
      inputs({ monthsSinceLastVisit: "0" }),
    );

    expect(result.isValid).toBe(false);
    expect(result.errors.monthsSinceLastVisit).toBeDefined();
    expect(result.filters.monthsSinceLastVisit).toBeNull();
  });

  it("acepta 1 mes sin visitar", () => {
    const result = parseCampaignSegmentInputs(
      inputs({ monthsSinceLastVisit: "1" }),
    );

    expect(result.isValid).toBe(true);
    expect(result.filters.monthsSinceLastVisit).toBe(1);
  });

  it("distingue vacío de cero", () => {
    const vacio = parseCampaignSegmentInputs(
      inputs({ monthsSinceLastVisit: "   " }),
    );

    expect(vacio.isValid).toBe(true);
    expect(vacio.filters.monthsSinceLastVisit).toBeNull();
  });

  it("0 visitas mínimas sí es válido: significa sin visitas", () => {
    const result = parseCampaignSegmentInputs(inputs({ minVisits: "0" }));

    expect(result.isValid).toBe(true);
    expect(result.filters.minVisits).toBe(0);
  });

  it("rechaza un rango de visitas invertido", () => {
    const result = parseCampaignSegmentInputs(
      inputs({ minVisits: "10", maxVisits: "2" }),
    );

    expect(result.isValid).toBe(false);
    expect(result.errors.maxVisits).toBeDefined();
  });

  it("rechaza una franja de edad invertida", () => {
    const result = parseCampaignSegmentInputs(
      inputs({ minAge: "60", maxAge: "20" }),
    );

    expect(result.isValid).toBe(false);
    expect(result.errors.maxAge).toBeDefined();
  });

  it("rechaza decimales y texto", () => {
    expect(
      parseCampaignSegmentInputs(inputs({ minVisits: "2.5" })).isValid,
    ).toBe(false);
    expect(parseCampaignSegmentInputs(inputs({ minAge: "abc" })).isValid).toBe(
      false,
    );
  });

  it("rechaza negativos", () => {
    const result = parseCampaignSegmentInputs(inputs({ minVisits: "-3" }));

    expect(result.isValid).toBe(false);
    expect(result.filters.minVisits).toBeNull();
  });

  it("lo que produce encaja con buildSegmentsFromFilters", () => {
    const { filters, isValid } = parseCampaignSegmentInputs(
      inputs({ monthsSinceLastVisit: "6", minVisits: "1" }),
    );

    expect(isValid).toBe(true);
    expect(buildSegmentsFromFilters(filters)).toEqual([
      { segment_type: "visit_count", config: { min_visits: 1 } },
      {
        segment_type: "last_visit_date",
        config: { months_since_last_visit: 6 },
      },
    ]);
  });
});

describe("buildSegmentsFromFilters", () => {
  it("sin filtros no genera ningún segmento", () => {
    expect(buildSegmentsFromFilters(EMPTY_CAMPAIGN_SEGMENT_FILTERS)).toEqual(
      [],
    );
  });

  it("omite los filtros vacíos en vez de guardarlos como nulos", () => {
    const segments = buildSegmentsFromFilters({
      ...EMPTY_CAMPAIGN_SEGMENT_FILTERS,
      minVisits: 2,
    });

    expect(segments).toEqual([
      { segment_type: "visit_count", config: { min_visits: 2 } },
    ]);
  });

  it("un cero es un valor válido, no un filtro ausente", () => {
    const segments = buildSegmentsFromFilters({
      ...EMPTY_CAMPAIGN_SEGMENT_FILTERS,
      minVisits: 0,
    });

    expect(segments).toEqual([
      { segment_type: "visit_count", config: { min_visits: 0 } },
    ]);
  });

  it("ida y vuelta: los filtros sobreviven al guardado y la recarga", () => {
    const original = {
      treatmentId: TREATMENT_ID,
      minVisits: 1,
      maxVisits: 4,
      monthsSinceLastVisit: 6,
      minAge: 30,
      maxAge: 65,
    };

    const restored = buildCampaignSegmentFilters(
      buildSegmentsFromFilters(original) as SegmentInput[],
    );

    expect(restored).toEqual(original);
  });
});
