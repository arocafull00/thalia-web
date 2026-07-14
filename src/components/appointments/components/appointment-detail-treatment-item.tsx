import Link from "next/link";

import { formatCurrency } from "@/lib/format";

type AppointmentDetailTreatmentItemProps = {
  treatmentId: string | null;
  name: string;
  color: string | null;
  priceAtBooking: number;
  durationMinutes: number | null;
};

export default function AppointmentDetailTreatmentItem({
  treatmentId,
  name,
  color,
  priceAtBooking,
  durationMinutes,
}: AppointmentDetailTreatmentItemProps) {
  const content = (
    <>
      <div className="flex min-w-0 items-center gap-3">
        <span
          className={`h-3 w-3 shrink-0 rounded-full ${color ? "" : "bg-border"}`}
          style={color ? { backgroundColor: color } : undefined}
          aria-hidden="true"
        />
        <p className="truncate font-medium text-ink">{name}</p>
      </div>
      <div className="flex shrink-0 items-center gap-3 text-sm text-ink-secondary">
        {durationMinutes ? <span>{durationMinutes} min</span> : null}
        <span className="font-medium text-ink">
          {formatCurrency(priceAtBooking)}
        </span>
      </div>
    </>
  );

  if (!treatmentId) {
    return (
      <div className="flex items-center justify-between gap-4 border-b border-border-subtle py-3 last:border-b-0">
        {content}
      </div>
    );
  }

  return (
    <Link
      href={`/treatments/${treatmentId}`}
      className="flex items-center justify-between gap-4 border-b border-border-subtle py-3 transition-colors last:border-b-0 hover:bg-(--hover-overlay)"
    >
      {content}
    </Link>
  );
}
