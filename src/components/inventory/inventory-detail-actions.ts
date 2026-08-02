import { Pencil, Trash2, TrendingUp } from "lucide-react";
import { toast } from "react-toastify";

import type { ProfileActionSection } from "@/components/ui/profile/profile-action";
import { INVENTORY_ITEM_DETAIL_COPY } from "@/copy/inventory-item-detail-copy";
import type { TopbarActionButtonConfig } from "@/lib/hooks/use-topbar-actions";

type InventoryDetailActionHandlers = {
  onAdjustStock: () => void;
  onEdit: () => void;
};

function showComingSoon() {
  toast.info(INVENTORY_ITEM_DETAIL_COPY.actions.comingSoon);
}

export function getInventoryDetailPrimaryAction(
  handlers: InventoryDetailActionHandlers,
): TopbarActionButtonConfig {
  return {
    title: INVENTORY_ITEM_DETAIL_COPY.actions.adjustStock,
    icon: TrendingUp,
    testId: "inventory-movement-create-trigger",
    onClick: handlers.onAdjustStock,
  };
}

export function getInventoryDetailMenuSections(
  handlers: InventoryDetailActionHandlers,
): ProfileActionSection[] {
  return [
    {
      label: INVENTORY_ITEM_DETAIL_COPY.menuSections.management,
      actions: [
        {
          label: INVENTORY_ITEM_DETAIL_COPY.actions.edit,
          icon: Pencil,
          onClick: handlers.onEdit,
        },
      ],
    },
    {
      label: INVENTORY_ITEM_DETAIL_COPY.menuSections.danger,
      actions: [
        {
          label: INVENTORY_ITEM_DETAIL_COPY.actions.delete,
          icon: Trash2,
          onClick: showComingSoon,
          variant: "danger",
        },
      ],
    },
  ];
}
