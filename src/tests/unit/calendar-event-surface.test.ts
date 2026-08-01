import { describe, expect, it } from "vitest";

import {
  buildEventSurfaceColor,
  DARK_EVENT_SURFACE,
  normalizeEventColor,
} from "@/lib/calendar-event-surface";

describe("normalizeEventColor", () => {
  it("accepts long and short hex notations", () => {
    expect(normalizeEventColor("#3D8FA0")).toBe("#3D8FA0");
    expect(normalizeEventColor("#abc")).toBe("#abc");
  });

  it("trims surrounding whitespace", () => {
    expect(normalizeEventColor("  #3D8FA0  ")).toBe("#3D8FA0");
  });

  it("returns null for missing or non-hex values", () => {
    expect(normalizeEventColor(null)).toBeNull();
    expect(normalizeEventColor("")).toBeNull();
    expect(normalizeEventColor("red")).toBeNull();
    expect(normalizeEventColor("#12345")).toBeNull();
  });

  it("rejects values that would inject extra CSS", () => {
    expect(normalizeEventColor("#fff); background: url(evil")).toBeNull();
  });
});

describe("buildEventSurfaceColor", () => {
  it("mixes the employee color over the theme surface token", () => {
    expect(buildEventSurfaceColor("#3D8FA0")).toBe(
      "color-mix(in srgb, #3D8FA0 12%, var(--color-surface))",
    );
  });

  it("mixes over the provided base surface", () => {
    expect(buildEventSurfaceColor("#3D8FA0", DARK_EVENT_SURFACE)).toBe(
      "color-mix(in srgb, #3D8FA0 12%, #2A3238)",
    );
  });

  it("returns null when there is no usable color so callers fall back to a token", () => {
    expect(buildEventSurfaceColor(null)).toBeNull();
    expect(buildEventSurfaceColor("not-a-color")).toBeNull();
  });
});
