import { CalendarPlus, Images, Mail, Pencil, Phone } from "lucide-react";

import type { ProfileAction } from "@/components/ui/profile/profile-action";
import { PATIENT_DETAIL_COPY } from "@/copy/patient-detail-copy";
import type { Patient } from "@/types/database.types";

type PatientDetailActionHandlers = {
  onEdit: () => void;
  onCreateAppointment: () => void;
  onOpenGallery: () => void;
};

export function getPatientDetailActions(
  patient: Patient,
  handlers: PatientDetailActionHandlers,
): ProfileAction[] {
  const actions: ProfileAction[] = [
    {
      label: PATIENT_DETAIL_COPY.actions.edit,
      icon: Pencil,
      onClick: handlers.onEdit,
      buttonVariant: "solid",
    },
    {
      label: PATIENT_DETAIL_COPY.actions.openGallery,
      icon: Images,
      onClick: handlers.onOpenGallery,
      buttonVariant: "ghost",
    },
  ];

  if (patient.phone) {
    actions.push({
      label: PATIENT_DETAIL_COPY.actions.call,
      icon: Phone,
      href: `tel:${patient.phone}`,
      buttonVariant: "ghost",
    });
  }

  if (patient.email) {
    actions.push({
      label: PATIENT_DETAIL_COPY.actions.email,
      icon: Mail,
      href: `mailto:${patient.email}`,
      buttonVariant: "ghost",
    });
  }

  actions.push({
    label: PATIENT_DETAIL_COPY.actions.createAppointment,
    icon: CalendarPlus,
    onClick: handlers.onCreateAppointment,
    buttonVariant: "ghost",
  });

  return actions;
}
