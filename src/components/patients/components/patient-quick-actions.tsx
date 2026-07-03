"use client";

import { CalendarPlus, Mail, Pencil, Phone } from "lucide-react";

import { ActionButton } from "@/components/ui/primitives/action-button";
import { PATIENT_DETAIL_COPY } from "@/copy/patient-detail-copy";
import type { Patient } from "@/types/database.types";

type PatientQuickActionsProps = {
  patient: Patient;
  onEdit: () => void;
  onCreateAppointment: () => void;
};

export default function PatientQuickActions({
  patient,
  onEdit,
  onCreateAppointment,
}: PatientQuickActionsProps) {
  return (
    <div className="flex flex-col gap-2 px-6 py-6">
      <div className="w-full [&>button]:w-full">
        <ActionButton
          title={PATIENT_DETAIL_COPY.actions.edit}
          icon={Pencil}
          onClick={onEdit}
        />
      </div>
      {patient.phone ? (
        <div className="w-full [&>button]:w-full">
          <ActionButton
            title={PATIENT_DETAIL_COPY.actions.call}
            icon={Phone}
            variant="ghost"
            onClick={() => {
              window.location.href = `tel:${patient.phone}`;
            }}
          />
        </div>
      ) : null}
      {patient.email ? (
        <div className="w-full [&>button]:w-full">
          <ActionButton
            title={PATIENT_DETAIL_COPY.actions.email}
            icon={Mail}
            variant="ghost"
            onClick={() => {
              window.location.href = `mailto:${patient.email}`;
            }}
          />
        </div>
      ) : null}
      <div className="w-full [&>button]:w-full">
        <ActionButton
          title={PATIENT_DETAIL_COPY.actions.createAppointment}
          icon={CalendarPlus}
          variant="ghost"
          onClick={onCreateAppointment}
        />
      </div>
    </div>
  );
}
