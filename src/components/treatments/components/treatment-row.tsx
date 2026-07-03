import { Pencil, Trash2 } from "lucide-react";

import { TREATMENTS_COPY } from "@/components/treatments/treatments-copy";
import { formatCurrency } from "@/lib/format";
import type { Treatment } from "@/types/database.types";

type TreatmentRowProps = {
  treatment: Treatment;
  materialCount: number;
  onEdit: () => void;
  onDelete: () => void;
};

export default function TreatmentRow({
  treatment,
  materialCount,
  onEdit,
  onDelete,
}: TreatmentRowProps) {
  return (
    <div className="flex items-center justify-between gap-4 py-4">
      <div className="flex min-w-0 flex-1 items-start gap-3">
        <span
          className={`mt-1.5 inline-block size-3.5 shrink-0 rounded-full border border-border ${treatment.color ? "" : "bg-border"}`}
          style={
            treatment.color ? { backgroundColor: treatment.color } : undefined
          }
          aria-hidden="true"
        />
        <div className="min-w-0 flex-1">
          <p className="font-medium text-ink">{treatment.name}</p>
          <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-ink-secondary">
            {treatment.category ? <span>{treatment.category}</span> : null}
            <span>
              {treatment.duration_minutes ?? 30} {TREATMENTS_COPY.row.duration}
            </span>
            {treatment.price != null ? (
              <span>{formatCurrency(treatment.price)}</span>
            ) : null}
            <span>
              {materialCount > 0
                ? `${materialCount} ${TREATMENTS_COPY.row.materials}`
                : TREATMENTS_COPY.row.noMaterials}
            </span>
          </div>
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-2">
        <button
          type="button"
          onClick={onEdit}
          className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-xs font-medium uppercase tracking-wide text-ink-secondary hover:bg-canvas"
        >
          <Pencil className="size-3.5" aria-hidden="true" />
          {TREATMENTS_COPY.row.edit}
        </button>
        <button
          type="button"
          onClick={onDelete}
          className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-xs font-medium uppercase tracking-wide text-danger hover:bg-canvas"
        >
          <Trash2 className="size-3.5" aria-hidden="true" />
          {TREATMENTS_COPY.row.delete}
        </button>
      </div>
    </div>
  );
}
