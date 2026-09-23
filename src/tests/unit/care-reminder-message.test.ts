import { describe, expect, it } from "vitest";

import {
  buildCareReminderMessage,
  buildCareReminderTemplateVariables,
  formatAppointmentWhen,
} from "../../../supabase/functions/_shared/care-reminder-message";

const timezone = "Europe/Madrid";

function at(iso: string): Date {
  return new Date(iso);
}

describe("formatAppointmentWhen", () => {
  it("usa hoy, mañana y pasado mañana en la zona de la clínica", () => {
    const sentAt = at("2026-09-23T10:00:00+02:00");

    expect(
      formatAppointmentWhen(at("2026-09-23T17:00:00+02:00"), sentAt, timezone),
    ).toBe("hoy");
    expect(
      formatAppointmentWhen(at("2026-09-24T17:00:00+02:00"), sentAt, timezone),
    ).toBe("mañana");
    expect(
      formatAppointmentWhen(at("2026-09-25T17:00:00+02:00"), sentAt, timezone),
    ).toBe("pasado mañana");
  });

  it("usa fecha larga cuando faltan más de dos días", () => {
    const sentAt = at("2026-09-23T10:00:00+02:00");

    expect(
      formatAppointmentWhen(at("2026-09-30T17:00:00+02:00"), sentAt, timezone),
    ).toBe("el 30 de septiembre");
  });
});

describe("buildCareReminderMessage", () => {
  const baseInput = {
    clinicName: "Clínica X",
    appointmentStartsAt: at("2026-09-24T17:00:00+02:00"),
    sentAt: at("2026-09-23T10:00:00+02:00"),
    timezone,
    confirmationUrl: null as string | null,
  };

  it("coincide con el ejemplo minimizado del issue", () => {
    const message = buildCareReminderMessage(baseInput);

    expect(message).toBe(
      "Tienes una cita mañana a las 17:00 en Clínica X.",
    );
    expect(message).not.toContain("profesional");
    expect(message).not.toContain("tratamiento");
  });

  it("añade la frase de confirmación solo con URL", () => {
    const withLink = buildCareReminderMessage({
      ...baseInput,
      confirmationUrl: "https://app.thalia.es/cita/abc123",
    });
    const withoutLink = buildCareReminderMessage(baseInput);

    expect(withLink).toContain("Confírmala aquí: https://app.thalia.es/cita/abc123");
    expect(withoutLink).not.toContain("Confírmala aquí");
  });

  it("expone variables de plantilla Meta en el orden acordado", () => {
    const vars = buildCareReminderTemplateVariables({
      ...baseInput,
      confirmationUrl: "https://app.thalia.es/cita/token-xyz",
    });

    expect(vars).toEqual({
      "1": "mañana",
      "2": "17:00",
      "3": "Clínica X",
      "4": "token-xyz",
    });
  });
});
