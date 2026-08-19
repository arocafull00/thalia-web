import { describe, expect, it } from "vitest";

import { campaignDateRangeToIso } from "@/lib/campaign-pagination";

describe("campaignDateRangeToIso", () => {
  it("returns null bounds when the filter is empty", () => {
    expect(campaignDateRangeToIso("", "")).toEqual({
      createdFrom: null,
      createdTo: null,
    });
  });

  it("ignores values that are not a YYYY-MM-DD date", () => {
    expect(campaignDateRangeToIso("ayer", "2026-13-99")).toEqual({
      createdFrom: null,
      createdTo: null,
    });
  });

  it("resolves the bounds in the clinic timezone, not UTC", () => {
    // Madrid está en UTC+2 en agosto, así que la medianoche local es 22:00 del
    // día anterior en UTC. Resolverlo en UTC dejaría fuera dos horas de
    // campañas al principio del rango.
    const { createdFrom } = campaignDateRangeToIso("2026-08-12", "");

    expect(createdFrom).toBe("2026-08-11T22:00:00Z");
  });

  it("stretches `to` to the end of the day", () => {
    // Sin esto, filtrar por un solo día no devolvería nada: `created_at` es un
    // instante y ninguna campaña se crea exactamente a las 00:00:00.
    const { createdTo } = campaignDateRangeToIso("", "2026-08-12");

    expect(createdTo).toBe("2026-08-12T21:59:59.999Z");
  });

  it("applies the winter offset for a date outside daylight saving", () => {
    const { createdFrom } = campaignDateRangeToIso("2026-01-15", "");

    expect(createdFrom).toBe("2026-01-14T23:00:00Z");
  });
});
