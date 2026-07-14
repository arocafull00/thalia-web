import { Pill } from "lucide-react";

import AppointmentDetailCard from "@/components/appointments/components/appointment-detail-card";
import AppointmentDetailTreatmentItem from "@/components/appointments/components/appointment-detail-treatment-item";
import { APPOINTMENT_DETAIL_COPY } from "@/copy/appointment-detail-copy";
import { formatCurrency } from "@/lib/format";
import type { AppointmentWithRelations } from "@/types/database.types";

type AppointmentTreatmentsSectionProps = {
  treatments: AppointmentWithRelations["appointment_treatments"];
  totalDurationMinutes: number;
};

export default function AppointmentTreatmentsSection({
  treatments,
  totalDurationMinutes,
}: AppointmentTreatmentsSectionProps) {
  const totalPrice = treatments.reduce(
    (sum, entry) => sum + entry.price_at_booking,
    0,
  );

  return (
    <AppointmentDetailCard
      icon={Pill}
      title={APPOINTMENT_DETAIL_COPY.treatments}
    >
      {treatments.length === 0 ? (
        <p className="text-sm text-ink-secondary">
          {APPOINTMENT_DETAIL_COPY.noTreatments}
        </p>
      ) : (
        <>
          <div>
            {treatments.map((entry) => (
              <AppointmentDetailTreatmentItem
                key={entry.id}
                treatmentId={entry.treatment_id}
                name={entry.treatment?.name ?? "Tratamiento"}
                color={entry.treatment?.color ?? null}
                priceAtBooking={entry.price_at_booking}
                durationMinutes={entry.treatment?.duration_minutes ?? null}
              />
            ))}
          </div>
          <div className="mt-4 flex items-center justify-between gap-4 border-t border-border-subtle pt-4 text-sm">
            <span className="text-ink-secondary">
              {APPOINTMENT_DETAIL_COPY.totalDuration}: {totalDurationMinutes}{" "}
              min
            </span>
            <span className="font-medium text-success">
              {APPOINTMENT_DETAIL_COPY.total}: {formatCurrency(totalPrice)}
            </span>
          </div>
        </>
      )}
    </AppointmentDetailCard>
  );
}
