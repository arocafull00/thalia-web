import { describe, expect, it } from "vitest";

import {
  buildGoogleEvent,
  shouldSyncStatus,
} from "@/lib/google-calendar/event";

const PAYLOAD = {
  clinic_id: "10000000-0000-4000-8000-000000000001",
  starts_at: "2026-10-01T09:00:00+02:00",
  ends_at: "2026-10-01T09:30:00+02:00",
  status: "scheduled",
};

const APPOINTMENT_ID = "70000000-0000-4000-8000-000000000030";
const CLINICA = "Clínica Norte";

describe("evento de Google Calendar", () => {
  it("lleva la franja horaria de la cita", () => {
    const event = buildGoogleEvent(APPOINTMENT_ID, PAYLOAD, CLINICA);

    expect(event.start.dateTime).toBe(PAYLOAD.starts_at);
    expect(event.end.dateTime).toBe(PAYLOAD.ends_at);
  });

  it("enlaza de vuelta a la cita en Thalia", () => {
    const event = buildGoogleEvent(APPOINTMENT_ID, PAYLOAD, CLINICA);

    expect(event.description).toContain(`/appointments/${APPOINTMENT_ID}`);
  });

  it("avisa de que editar en Google no sirve de nada", () => {
    expect(
      buildGoogleEvent(APPOINTMENT_ID, PAYLOAD, CLINICA).description,
    ).toContain("no se sincronizan");
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
    const event = buildGoogleEvent(APPOINTMENT_ID, PAYLOAD, CLINICA);
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

  /*
   * El nombre de la clínica es suyo, no del paciente: no dice quién va ni a
   * qué. Y es lo único que distingue las citas de un profesional que trabaja en
   * varios sitios, porque todas caen en el mismo calendario.
   */
  it("el título lleva la clínica, y a nadie más", () => {
    expect(buildGoogleEvent(APPOINTMENT_ID, PAYLOAD, CLINICA).summary).toBe(
      "Cita · Clínica Norte",
    );
  });

  it("sin clínica se queda en «Cita» en lugar de dejar un hueco", () => {
    expect(buildGoogleEvent(APPOINTMENT_ID, PAYLOAD, null).summary).toBe(
      "Cita",
    );
  });

  /*
   * La regla de negocio: el recordatorio al paciente y el calendario del
   * profesional dependen de que este haya aceptado la cita. Una propuesta que
   * todavía no ha respondido no le ocupa hueco en su agenda.
   */
  it("no saca a Google una cita que el profesional aún no ha aceptado", () => {
    expect(shouldSyncStatus("pending_external")).toBe(false);
    expect(shouldSyncStatus("rejected_external")).toBe(false);
  });

  it("no saca a Google una cita cancelada o con ausencia", () => {
    expect(shouldSyncStatus("cancelled")).toBe(false);
    expect(shouldSyncStatus("no_show")).toBe(false);
  });

  it("sí saca las que el profesional ha tomado", () => {
    expect(shouldSyncStatus("scheduled")).toBe(true);
    expect(shouldSyncStatus("confirmed")).toBe(true);
    expect(shouldSyncStatus("in_progress")).toBe(true);
    expect(shouldSyncStatus("completed")).toBe(true);
  });

  /*
   * Lista blanca: un estado que nadie ha contemplado no debe viajar a Google
   * por omisión. Este test rompe si alguien invierte el criterio.
   */
  it("un estado desconocido no sale del sistema", () => {
    expect(shouldSyncStatus("un_estado_que_no_existe_todavia")).toBe(false);
  });
});
