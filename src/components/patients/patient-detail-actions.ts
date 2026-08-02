import { CalendarPlus, Mail, Pencil, Phone } from "lucide-react";

import type { ProfileActionSection } from "@/components/ui/profile/profile-action";
import { PATIENT_DETAIL_COPY } from "@/copy/patient-detail-copy";
import type { TopbarActionButtonConfig } from "@/lib/hooks/use-topbar-actions";
import type { Patient } from "@/types/database.types";

type PatientDetailActionHandlers = {
  onEdit: () => void;
  onCreateAppointment: () => void;
};

export function getPatientDetailPrimaryAction(
  handlers: PatientDetailActionHandlers,
): TopbarActionButtonConfig {
  return {
    title: PATIENT_DETAIL_COPY.actions.createAppointment,
    icon: CalendarPlus,
    onClick: handlers.onCreateAppointment,
  };
}

export function getPatientDetailMenuSections(
  patient: Patient,
  handlers: PatientDetailActionHandlers,
): ProfileActionSection[] {
  const sections: ProfileActionSection[] = [
    {
      label: PATIENT_DETAIL_COPY.menuSections.patient,
      actions: [
        {
          label: PATIENT_DETAIL_COPY.actions.edit,
          icon: Pencil,
          onClick: handlers.onEdit,
          testId: "patient-edit-trigger",
        },
      ],
    },
  ];

  const contactActions = [];

  if (patient.phone) {
    contactActions.push({
      label: PATIENT_DETAIL_COPY.actions.call,
      icon: Phone,
      href: `tel:${patient.phone}`,
    });
  }

  if (patient.email) {
    contactActions.push({
      label: PATIENT_DETAIL_COPY.actions.email,
      icon: Mail,
      href: `mailto:${patient.email}`,
    });
  }

  if (contactActions.length > 0) {
    sections.push({
      label: PATIENT_DETAIL_COPY.menuSections.contact,
      actions: contactActions,
    });
  }

  return sections;
}
