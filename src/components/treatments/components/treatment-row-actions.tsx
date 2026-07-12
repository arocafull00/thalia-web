import { Pencil, Trash2 } from "lucide-react";

import { TREATMENTS_COPY } from "@/components/treatments/treatments-copy";
import { Button } from "@/components/ui/button";
import type { TreatmentWithInventory } from "@/types/database.types";

type TreatmentRowActionsProps = {
  treatment: TreatmentWithInventory;
  onEdit: (treatment: TreatmentWithInventory) => void;
  onDelete: (treatment: TreatmentWithInventory) => void;
};

export default function TreatmentRowActions({
  treatment,
  onEdit,
  onDelete,
}: TreatmentRowActionsProps) {
  return (
    <div className="flex shrink-0 items-center justify-end gap-2">
      <Button
        type="button"
        variant="outline"
        onClick={(event) => {
          event.stopPropagation();
          onEdit(treatment);
        }}
        className="rounded-button px-3 py-1.5 text-sm"
      >
        <Pencil className="size-3.5" aria-hidden="true" />
        {TREATMENTS_COPY.row.edit}
      </Button>
      <Button
        type="button"
        variant="destructive"
        onClick={(event) => {
          event.stopPropagation();
          onDelete(treatment);
        }}
        className="rounded-full border border-border px-4 py-2 text-xs font-medium uppercase tracking-wide hover:bg-canvas"
      >
        <Trash2 className="size-3.5" aria-hidden="true" />
        {TREATMENTS_COPY.row.delete}
      </Button>
    </div>
  );
}
