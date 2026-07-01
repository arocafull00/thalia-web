import { formatCurrency } from "@/lib/format";

type AppointmentDetailTreatmentItemProps = {
  name: string;
  price: number | null;
  durationMinutes: number | null;
};

export default function AppointmentDetailTreatmentItem({
  name,
  price,
  durationMinutes,
}: AppointmentDetailTreatmentItemProps) {
  const meta = [
    durationMinutes ? `${durationMinutes} min` : null,
    price !== null ? formatCurrency(price) : null,
  ]
    .filter(Boolean)
    .join(" · ");

  return (
    <div className="flex items-center justify-between gap-4 border-b border-border-subtle py-3 last:border-b-0">
      <p className="font-medium text-ink">{name}</p>
      {meta ? <p className="text-sm text-ink-secondary">{meta}</p> : null}
    </div>
  );
}
