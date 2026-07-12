import { CheckCircle, Pencil, XCircle } from "lucide-react";

import type { ProfileAction } from "@/components/ui/profile/profile-action";
import { APPOINTMENT_DETAIL_COPY } from "@/copy/appointment-detail-copy";

type AppointmentDetailActionHandlers = {
  onEdit: () => void;
  onMarkCompleted: () => void;
  onCancel: () => void;
};

export function getAppointmentDetailMenuActions(
  canChangeStatus: boolean,
  handlers: AppointmentDetailActionHandlers,
): ProfileAction[] {
  const actions: ProfileAction[] = [
    {
      label: APPOINTMENT_DETAIL_COPY.edit,
      icon: Pencil,
      onClick: handlers.onEdit,
      buttonVariant: "solid",
    },
  ];

  if (!canChangeStatus) {
    return actions;
  }

  actions.push(
    {
      label: APPOINTMENT_DETAIL_COPY.markCompleted,
      icon: CheckCircle,
      onClick: handlers.onMarkCompleted,
      buttonVariant: "ghost",
    },
    {
      label: APPOINTMENT_DETAIL_COPY.cancel,
      icon: XCircle,
      onClick: handlers.onCancel,
      variant: "danger",
      buttonVariant: "ghost",
    },
  );

  return actions;
}
