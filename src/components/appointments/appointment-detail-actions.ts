import { BadgeCheck, CheckCircle, Pencil, Trash2, XCircle } from "lucide-react";

import type { ProfileActionSection } from "@/components/ui/profile/profile-action";
import { APPOINTMENT_DETAIL_COPY } from "@/copy/appointment-detail-copy";
import type { TopbarActionButtonConfig } from "@/lib/hooks/use-topbar-actions";
import type { AppointmentStatus } from "@/types/database.types";

type AppointmentDetailActionHandlers = {
  onEdit: () => void;
  onConfirm: () => void;
  onMarkCompleted: () => void;
  onCancel: () => void;
  onDelete: () => void;
};

type AppointmentDetailTopbarParams = {
  status: AppointmentStatus | null;
  canChangeStatus: boolean;
  updatingStatus: boolean;
  handlers: AppointmentDetailActionHandlers;
};

function resolvePrimaryLabel(
  status: AppointmentStatus | null,
  canChangeStatus: boolean,
) {
  if (canChangeStatus && status === "scheduled") {
    return APPOINTMENT_DETAIL_COPY.confirm;
  }

  if (canChangeStatus && (status === "confirmed" || status === "in_progress")) {
    return APPOINTMENT_DETAIL_COPY.markCompleted;
  }

  return APPOINTMENT_DETAIL_COPY.edit;
}

export function getAppointmentDetailPrimaryAction({
  status,
  canChangeStatus,
  updatingStatus,
  handlers,
}: AppointmentDetailTopbarParams): TopbarActionButtonConfig {
  const primaryLabel = resolvePrimaryLabel(status, canChangeStatus);

  if (primaryLabel === APPOINTMENT_DETAIL_COPY.confirm) {
    return {
      title: APPOINTMENT_DETAIL_COPY.confirm,
      icon: BadgeCheck,
      disabled: updatingStatus,
      onClick: handlers.onConfirm,
    };
  }

  if (primaryLabel === APPOINTMENT_DETAIL_COPY.markCompleted) {
    return {
      title: APPOINTMENT_DETAIL_COPY.markCompleted,
      icon: CheckCircle,
      disabled: updatingStatus,
      onClick: handlers.onMarkCompleted,
    };
  }

  return {
    title: APPOINTMENT_DETAIL_COPY.edit,
    icon: Pencil,
    testId: "appointment-edit-trigger",
    onClick: handlers.onEdit,
  };
}

export function getAppointmentDetailMenuSections({
  status,
  canChangeStatus,
  updatingStatus,
  handlers,
}: AppointmentDetailTopbarParams): ProfileActionSection[] {
  const primaryLabel = resolvePrimaryLabel(status, canChangeStatus);
  const sections: ProfileActionSection[] = [];

  const appointmentActions = [];

  if (primaryLabel !== APPOINTMENT_DETAIL_COPY.edit) {
    appointmentActions.push({
      label: APPOINTMENT_DETAIL_COPY.edit,
      icon: Pencil,
      onClick: handlers.onEdit,
      testId: "appointment-edit-trigger",
    });
  }

  if (appointmentActions.length > 0) {
    sections.push({
      label: APPOINTMENT_DETAIL_COPY.menuSections.appointment,
      actions: appointmentActions,
    });
  }

  if (canChangeStatus) {
    const statusActions = [];

    if (
      status === "scheduled" &&
      primaryLabel !== APPOINTMENT_DETAIL_COPY.confirm
    ) {
      statusActions.push({
        label: APPOINTMENT_DETAIL_COPY.confirm,
        icon: BadgeCheck,
        disabled: updatingStatus,
        onClick: handlers.onConfirm,
      });
    }

    if (primaryLabel !== APPOINTMENT_DETAIL_COPY.markCompleted) {
      statusActions.push({
        label: APPOINTMENT_DETAIL_COPY.markCompleted,
        icon: CheckCircle,
        disabled: updatingStatus,
        onClick: handlers.onMarkCompleted,
      });
    }

    statusActions.push({
      label: APPOINTMENT_DETAIL_COPY.cancel,
      icon: XCircle,
      onClick: handlers.onCancel,
      variant: "danger" as const,
    });

    sections.push({
      label: APPOINTMENT_DETAIL_COPY.menuSections.status,
      actions: statusActions,
    });
  }

  sections.push({
    label: APPOINTMENT_DETAIL_COPY.menuSections.danger,
    actions: [
      {
        label: APPOINTMENT_DETAIL_COPY.delete,
        icon: Trash2,
        onClick: handlers.onDelete,
        variant: "danger",
      },
    ],
  });

  return sections;
}
