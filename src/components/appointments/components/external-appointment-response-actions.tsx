"use client";

import { Check, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { EXTERNAL_APPOINTMENT_COPY } from "@/copy/external-appointment-copy";

type ExternalAppointmentResponseActionsProps = {
  disabled: boolean;
  onAccept: () => void;
  onReject: () => void;
};

export default function ExternalAppointmentResponseActions({
  disabled,
  onAccept,
  onReject,
}: ExternalAppointmentResponseActionsProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Button
        type="button"
        size="sm"
        disabled={disabled}
        aria-label={EXTERNAL_APPOINTMENT_COPY.actions.acceptAriaLabel}
        onClick={onAccept}
      >
        <Check aria-hidden="true" />
        {disabled
          ? EXTERNAL_APPOINTMENT_COPY.actions.accepting
          : EXTERNAL_APPOINTMENT_COPY.actions.accept}
      </Button>
      <Button
        type="button"
        size="sm"
        variant="outline"
        disabled={disabled}
        aria-label={EXTERNAL_APPOINTMENT_COPY.actions.rejectAriaLabel}
        onClick={onReject}
      >
        <X aria-hidden="true" />
        {EXTERNAL_APPOINTMENT_COPY.actions.reject}
      </Button>
    </div>
  );
}
