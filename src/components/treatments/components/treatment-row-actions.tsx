import { Pencil, Trash2 } from "lucide-react";

import { TREATMENTS_COPY } from "@/components/treatments/treatments-copy";
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
      <button
        type="button"
        onClick={(event) => {
          event.stopPropagation();
          onEdit(treatment);
        }}
        className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-xs font-medium uppercase tracking-wide text-ink-secondary hover:bg-canvas"
      >
        <Pencil className="size-3.5" aria-hidden="true" />
        {TREATMENTS_COPY.row.edit}
      </button>
      <button
        type="button"
        onClick={(event) => {
          event.stopPropagation();
          onDelete(treatment);
        }}
        className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-xs font-medium uppercase tracking-wide text-danger hover:bg-canvas"
      >
        <Trash2 className="size-3.5" aria-hidden="true" />
        {TREATMENTS_COPY.row.delete}
      </button>
    </div>
  );
}
