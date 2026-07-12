import { Pencil, Trash2, TrendingUp } from "lucide-react";
import { toast } from "react-toastify";

import type { ProfileAction } from "@/components/ui/profile/profile-action";
import { INVENTORY_ITEM_DETAIL_COPY } from "@/copy/inventory-item-detail-copy";

type InventoryDetailActionHandlers = {
  onAdjustStock: () => void;
};

function showComingSoon() {
  toast.info(INVENTORY_ITEM_DETAIL_COPY.actions.comingSoon);
}

export function getInventoryDetailActions(
  handlers: InventoryDetailActionHandlers,
): ProfileAction[] {
  return [
    {
      label: INVENTORY_ITEM_DETAIL_COPY.actions.adjustStock,
      icon: TrendingUp,
      onClick: handlers.onAdjustStock,
      buttonVariant: "solid",
    },
    {
      label: INVENTORY_ITEM_DETAIL_COPY.actions.edit,
      icon: Pencil,
      onClick: showComingSoon,
      buttonVariant: "ghost",
    },
    {
      label: INVENTORY_ITEM_DETAIL_COPY.actions.delete,
      icon: Trash2,
      onClick: showComingSoon,
      variant: "danger",
      buttonVariant: "ghost",
    },
  ];
}
