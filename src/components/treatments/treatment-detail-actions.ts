import { Pencil, Trash2 } from "lucide-react";

import type { ProfileActionSection } from "@/components/ui/profile/profile-action";
import { TREATMENT_DETAIL_COPY } from "@/copy/treatment-detail-copy";
import type { TopbarActionButtonConfig } from "@/lib/hooks/use-topbar-actions";

type TreatmentDetailActionHandlers = {
  onEdit: () => void;
  onDelete: () => void;
};

export function getTreatmentDetailPrimaryAction(
  handlers: TreatmentDetailActionHandlers,
): TopbarActionButtonConfig {
  return {
    title: TREATMENT_DETAIL_COPY.actions.edit,
    icon: Pencil,
    onClick: handlers.onEdit,
  };
}

export function getTreatmentDetailMenuSections(
  handlers: TreatmentDetailActionHandlers,
): ProfileActionSection[] {
  return [
    {
      label: TREATMENT_DETAIL_COPY.menuSections.danger,
      actions: [
        {
          label: TREATMENT_DETAIL_COPY.actions.delete,
          icon: Trash2,
          onClick: handlers.onDelete,
          variant: "danger",
        },
      ],
    },
  ];
}
