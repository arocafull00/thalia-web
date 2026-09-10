import { describe, expect, it } from "vitest";

import {
  formatConfirmationDate,
  formatConfirmationTime,
} from "@/lib/appointment-confirmation-format";

/*
 * La cita se muestra en la zona horaria de la clínica, no en la del móvil del
 * paciente. Es el fallo silencioso más probable de esta pantalla: alguien de
 * viaje vería una hora que no es la suya y llegaría tarde.
 */
describe("formato de la cita en el enlace de confirmación", () => {
  // 11:00 en Madrid durante el horario de verano (UTC+2).
  const startsAt = "2026-07-15T09:00:00.000Z";

  it("usa la zona horaria de la clínica y no la del navegador", () => {
    expect(formatConfirmationTime(startsAt, "Europe/Madrid")).toBe("11:00");
    expect(formatConfirmationTime(startsAt, "Atlantic/Canary")).toBe("10:00");
    expect(formatConfirmationTime(startsAt, "UTC")).toBe("09:00");
  });

  it("cambia también el día cuando la zona lo cruza", () => {
    // 23:30 en Madrid es todavía el día 15; en Auckland ya es el 16.
    const lateNight = "2026-07-15T21:30:00.000Z";

    expect(formatConfirmationDate(lateNight, "Europe/Madrid")).toContain("15");
    expect(formatConfirmationDate(lateNight, "Pacific/Auckland")).toContain(
      "16",
    );
  });

  it("respeta el cambio de hora estacional", () => {
    // En enero Madrid es UTC+1, no UTC+2.
    expect(
      formatConfirmationTime("2026-01-15T09:00:00.000Z", "Europe/Madrid"),
    ).toBe("10:00");
  });
});
