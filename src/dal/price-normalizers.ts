import type {
  AppointmentWithRelations,
  Treatment,
  TreatmentWithInventory,
} from "@/types/database.types";

type PriceRelation =
  { price: number | null } | { price: number | null }[] | null | undefined;

type BookingPriceRelation =
  | { price_at_booking: number }
  | { price_at_booking: number }[]
  | null
  | undefined;

function relationValue<T>(relation: T | T[] | null | undefined) {
  return Array.isArray(relation) ? (relation[0] ?? null) : (relation ?? null);
}

export function normalizeTreatment<T extends Record<string, unknown>>(
  row: T,
): T & Treatment {
  const relation = relationValue(row.treatment_prices as PriceRelation);
  const { treatment_prices: _treatmentPrices, ...treatment } = row;

  return {
    ...treatment,
    price: relation?.price ?? null,
  } as T & Treatment;
}

export function normalizeTreatmentWithInventory(
  row: Record<string, unknown>,
): TreatmentWithInventory {
  return normalizeTreatment(row) as TreatmentWithInventory;
}

export function normalizeAppointment(
  row: Record<string, unknown>,
): AppointmentWithRelations {
  const treatments = Array.isArray(row.appointment_treatments)
    ? row.appointment_treatments
    : [];

  return {
    ...row,
    appointment_treatments: treatments.map((entry) => {
      const treatmentEntry = entry as Record<string, unknown>;
      const priceRelation = relationValue(
        treatmentEntry.appointment_treatment_prices as BookingPriceRelation,
      );
      const treatment = treatmentEntry.treatment as Record<
        string,
        unknown
      > | null;
      const {
        appointment_treatment_prices: _appointmentTreatmentPrices,
        ...appointmentTreatment
      } = treatmentEntry;

      return {
        ...appointmentTreatment,
        price_at_booking: priceRelation?.price_at_booking ?? null,
        treatment: treatment ? normalizeTreatment(treatment) : null,
      };
    }),
  } as AppointmentWithRelations;
}

export function normalizeAppointments(rows: Record<string, unknown>[]) {
  return rows.map(normalizeAppointment);
}
