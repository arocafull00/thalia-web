const HEX_COLOR_PATTERN = /^#(?:[0-9a-f]{3}|[0-9a-f]{6})$/i;

const SURFACE_TINT_PERCENT = 12;

export const LIGHT_EVENT_SURFACE = "var(--color-surface)";
export const DARK_EVENT_SURFACE = "#2A3238";

export function normalizeEventColor(
  color: string | null | undefined,
): string | null {
  if (!color) {
    return null;
  }

  const trimmed = color.trim();

  if (!HEX_COLOR_PATTERN.test(trimmed)) {
    return null;
  }

  return trimmed;
}

/**
 * Tinte del color del empleado sobre la superficie del tema, para dar fondo a
 * la cita sin comprometer el contraste del texto (`text-ink`).
 *
 * Devuelve `null` cuando no hay color o no es un hex válido, para que el
 * consumidor caiga en una clase del tema en lugar de un hex hardcodeado.
 */
export function buildEventSurfaceColor(
  color: string | null | undefined,
  baseSurface: string = LIGHT_EVENT_SURFACE,
): string | null {
  const normalized = normalizeEventColor(color);

  if (!normalized) {
    return null;
  }

  return `color-mix(in srgb, ${normalized} ${SURFACE_TINT_PERCENT}%, ${baseSurface})`;
}
