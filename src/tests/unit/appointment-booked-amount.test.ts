import { describe, expect, it } from "vitest";

import { appointmentBookedAmount } from "@/lib/calendar-agenda";
import type { AppointmentWithRelations } from "@/types/database.types";

function cita(precios: (number | null)[]): AppointmentWithRelations {
  return {
    id: "cita",
    appointment_treatments: precios.map((price_at_booking, index) => ({
      id: `t-${index}`,
      price_at_booking,
      treatment: { id: `tr-${index}`, name: "Tratamiento" },
    })),
  } as unknown as AppointmentWithRelations;
}

describe("importe reservado de una cita", () => {
  /*
   * Tiene que coincidir con lo que calcula la base al completar la cita
   * (`SUM(price_at_booking)` en `handle_appointment_completed`). Si divergen,
   * Inicio y Finanzas dirían cifras distintas del mismo día.
   */
  it("suma los precios reservados de todos los tratamientos", () => {
    expect(appointmentBookedAmount(cita([45, 30.5]))).toBe(75.5);
  });

  /*
   * `null` y cero no son lo mismo: sin precio no se pinta nada, mientras que
   * «0,00 €» afirmaría que la cita es gratuita.
   */
  it("devuelve null cuando ningún tratamiento tiene precio", () => {
    expect(appointmentBookedAmount(cita([null, null]))).toBeNull();
    expect(appointmentBookedAmount(cita([]))).toBeNull();
  });

  it("ignora los tratamientos sin precio y suma el resto", () => {
    expect(appointmentBookedAmount(cita([60, null]))).toBe(60);
  });

  it("distingue una cita gratuita de una sin precio", () => {
    expect(appointmentBookedAmount(cita([0]))).toBe(0);
  });
});
