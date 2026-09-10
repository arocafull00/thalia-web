"use client";

import {
  CalendarCheck,
  CalendarX,
  CircleCheckBig,
  CircleHelp,
  Clock,
  Phone,
} from "lucide-react";

import ConfirmationCard from "@/components/appointment-confirmation/components/confirmation-card";
import ConfirmationDetails from "@/components/appointment-confirmation/components/confirmation-details";
import { Button } from "@/components/ui/button";
import { Notice } from "@/components/ui/primitives/notice";
import { APPOINTMENT_CONFIRMATION_COPY as COPY } from "@/copy/appointment-confirmation-copy";
import { useAppointmentConfirmation } from "@/lib/hooks/use-appointment-confirmation";
import type {
  AppointmentConfirmationState,
  AppointmentConfirmationView,
} from "@/types/database.types";

type Props = {
  token: string;
  initialView: AppointmentConfirmationView | null;
};

const STATE_PRESENTATION: Record<
  AppointmentConfirmationState,
  { icon: typeof CalendarCheck; tone: "primary" | "success" | "muted" }
> = {
  confirmable: { icon: CalendarCheck, tone: "primary" },
  already_confirmed: { icon: CircleCheckBig, tone: "success" },
  cancelled: { icon: CalendarX, tone: "muted" },
  past: { icon: Clock, tone: "muted" },
  expired: { icon: Clock, tone: "muted" },
  closed: { icon: CalendarX, tone: "muted" },
};

export default function AppointmentConfirmationPageClient({
  token,
  initialView,
}: Props) {
  const { view, confirming, failed, justConfirmed, handleConfirm } =
    useAppointmentConfirmation({ token, initialView });

  // Un token inexistente y uno inválido se ven igual a propósito: la página no
  // revela si el enlace llegó a existir.
  if (!view) {
    return (
      <ConfirmationCard
        icon={CircleHelp}
        tone="muted"
        title={COPY.states.invalid.title}
        body={COPY.states.invalid.body}
      />
    );
  }

  const { icon, tone } = STATE_PRESENTATION[view.state];
  const message = justConfirmed
    ? COPY.states.justConfirmed
    : COPY.states[view.state];
  const canConfirm = view.state === "confirmable";
  const showPhone = !canConfirm && !justConfirmed && Boolean(view.clinic_phone);

  return (
    <ConfirmationCard
      icon={justConfirmed ? CircleCheckBig : icon}
      tone={justConfirmed ? "success" : tone}
      title={message.title}
      body={message.body}
    >
      {/*
        Sólo el nombre de la clínica. La página no muestra ningún dato del
        paciente: el enlace viaja por WhatsApp y se reenvía, y quien lo abre ya
        sabe de quién es la cita. Qué hay que hacer lo explica el cuerpo de la
        tarjeta, que cambia con el estado.
      */}
      <p className="text-sm font-medium text-ink">{view.clinic_name}</p>

      <ConfirmationDetails
        startsAt={view.starts_at}
        timezone={view.clinic_timezone}
        employeeName={view.employee_name}
      />

      {failed ? <Notice tone="danger" message={COPY.error} /> : null}

      {canConfirm ? (
        <Button
          type="button"
          disabled={confirming}
          onClick={() => void handleConfirm()}
          className="w-full"
        >
          {confirming
            ? COPY.actions.confirming
            : failed
              ? COPY.actions.retry
              : COPY.actions.confirm}
        </Button>
      ) : null}

      {showPhone && view.clinic_phone ? (
        <a
          href={`tel:${view.clinic_phone}`}
          className="flex items-center justify-center gap-2 rounded-button border border-border px-4 py-2.5 text-sm font-medium text-ink hover:bg-canvas"
        >
          <Phone className="h-4 w-4" aria-hidden="true" />
          {COPY.callClinic(view.clinic_phone)}
        </a>
      ) : null}
    </ConfirmationCard>
  );
}
