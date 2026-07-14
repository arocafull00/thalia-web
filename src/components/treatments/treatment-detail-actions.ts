import { Pencil, Trash2 } from "lucide-react";

import type { ProfileAction } from "@/components/ui/profile/profile-action";
import { TREATMENT_DETAIL_COPY } from "@/copy/treatment-detail-copy";

type TreatmentDetailActionHandlers = {
  onEdit: () => void;
  onDelete: () => void;
};

export function getTreatmentDetailActions(
  handlers: TreatmentDetailActionHandlers,
): ProfileAction[] {
  return [
    {
      label: TREATMENT_DETAIL_COPY.actions.edit,
      icon: Pencil,
      onClick: handlers.onEdit,
      buttonVariant: "solid",
    },
    {
      label: TREATMENT_DETAIL_COPY.actions.delete,
      icon: Trash2,
      onClick: handlers.onDelete,
      buttonVariant: "ghost",
      variant: "danger",
    },
  ];
}
