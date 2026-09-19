import { describe, expect, it } from "vitest";

import {
  buildGoogleEvent,
  isReleasedStatus,
} from "@/lib/google-calendar/event";

const PAYLOAD = {
  clinic_id: "10000000-0000-4000-8000-000000000001",
  starts_at: "2026-10-01T09:00:00+02:00",
  ends_at: "2026-10-01T09:30:00+02:00",
  status: "scheduled",
};

const APPOINTMENT_ID = "70000000-0000-4000-8000-000000000030";

describe("evento de Google Calendar", () => {
  it("lleva la franja horaria de la cita", () => {
    const event = buildGoogleEvent(APPOINTMENT_ID, PAYLOAD);

    expect(event.start.dateTime).toBe(PAYLOAD.starts_at);
    expect(event.end.dateTime).toBe(PAYLOAD.ends_at);
  });

  it("enlaza de vuelta a la cita en Thalia", () => {
    const event = buildGoogleEvent(APPOINTMENT_ID, PAYLOAD);

    expect(event.description).toContain(`/appointments/${APPOINTMENT_ID}`);
  });

  it("avisa de que editar en Google no sirve de nada", () => {
    expect(buildGoogleEvent(APPOINTMENT_ID, PAYLOAD).description).toContain(
      "no se sincronizan",
    );
  });

  /*
   * Este es el test que sostiene la integración entera.
   *
   * El nombre de un paciente en un evento de Google revela que esa persona se
   * trata en una clínica estética: dato de salud, categoría especial del RGPD,
   * cedido a un tercero sin base para hacerlo. Lo mismo el tratamiento.
   *
   * Si alguien añade cualquiera de esas cosas al evento «para que se entienda
   * mejor», esto tiene que ponerse en rojo.
   */
  it("no filtra ningún dato clínico, mire donde mire", () => {
    const event = buildGoogleEvent(APPOINTMENT_ID, PAYLOAD);
    const serializado = JSON.stringify(event).toLowerCase();

    for (const prohibido of [
      "paciente",
      "patient",
      "tratamiento",
      "treatment",
      "notas",
      "notes",
      "telefono",
      "teléfono",
      "phone",
      "email",
      "dni",
    ]) {
      expect(serializado).not.toContain(prohibido);
    }
  });

  it("el título no identifica a nadie", () => {
    expect(buildGoogleEvent(APPOINTMENT_ID, PAYLOAD).summary).toBe("Cita");
  });

  it("retira del calendario las citas que liberan el hueco", () => {
    expect(isReleasedStatus("cancelled")).toBe(true);
    expect(isReleasedStatus("no_show")).toBe(true);
    expect(isReleasedStatus("scheduled")).toBe(false);
    expect(isReleasedStatus("confirmed")).toBe(false);
    expect(isReleasedStatus("completed")).toBe(false);
  });
});
