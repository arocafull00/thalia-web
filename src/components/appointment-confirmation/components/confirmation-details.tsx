import { CalendarDays, Clock, User } from "lucide-react";

import { APPOINTMENT_CONFIRMATION_COPY as COPY } from "@/copy/appointment-confirmation-copy";
import {
  formatConfirmationDate,
  formatConfirmationTime,
} from "@/lib/appointment-confirmation-format";

type Props = {
  startsAt: string;
  timezone: string;
  employeeName: string | null;
};

export default function ConfirmationDetails({
  startsAt,
  timezone,
  employeeName,
}: Props) {
  const rows = [
    {
      icon: CalendarDays,
      label: COPY.labels.date,
      value: formatConfirmationDate(startsAt, timezone),
      // Intl devuelve "martes, 15 de julio" en minúscula: sólo aquí hay que
      // capitalizar. Aplicarlo a todas las filas convertiría "con Marta" en
      // "Con Marta".
      capitalize: true,
    },
    {
      icon: Clock,
      label: COPY.labels.time,
      value: formatConfirmationTime(startsAt, timezone),
    },
    {
      icon: User,
      label: COPY.labels.professional,
      value: COPY.withProfessional(
        employeeName?.trim() || COPY.fallbackProfessional,
      ),
    },
  ];

  return (
    <dl className="flex flex-col gap-3 rounded-card bg-canvas p-4">
      {rows.map(({ icon: Icon, label, value, capitalize }) => (
        <div key={label} className="flex items-center gap-3">
          <Icon
            className="h-4 w-4 shrink-0 text-ink-muted"
            aria-hidden="true"
          />
          <dt className="sr-only">{label}</dt>
          <dd
            className={`text-sm font-medium text-ink ${
              capitalize ? "first-letter:uppercase" : ""
            }`}
          >
            {value}
          </dd>
        </div>
      ))}
    </dl>
  );
}
