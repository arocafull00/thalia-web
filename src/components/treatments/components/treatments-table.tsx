"use client";

import { Pencil, Trash2 } from "lucide-react";
import { useMemo } from "react";

import { getTreatmentsColumns } from "@/components/treatments/components/treatments-columns";
import { TREATMENTS_COPY } from "@/components/treatments/treatments-copy";
import { DataTable } from "@/components/ui/data-table";
import type { MobileCardAction } from "@/components/ui/mobile-card-view";
import { treatmentsMobileColumns } from "@/lib/table-mobile-columns";
import type { TreatmentWithInventory } from "@/types/database.types";

type TreatmentsTableProps = {
  treatments: TreatmentWithInventory[];
  onEdit: (treatment: TreatmentWithInventory) => void;
  onDelete: (treatment: TreatmentWithInventory) => void;
};

export default function TreatmentsTable({
  treatments,
  onEdit,
  onDelete,
}: TreatmentsTableProps) {
  const columns = useMemo(
    () => getTreatmentsColumns({ onEdit, onDelete }),
    [onEdit, onDelete],
  );

  const mobileActions = useMemo<MobileCardAction<TreatmentWithInventory>[]>(
    () => [
      {
        icon: <Pencil className="size-4" aria-hidden="true" />,
        label: TREATMENTS_COPY.row.edit,
        onClick: onEdit,
      },
      {
        icon: <Trash2 className="size-4" aria-hidden="true" />,
        label: TREATMENTS_COPY.row.delete,
        onClick: onDelete,
      },
    ],
    [onEdit, onDelete],
  );

  return (
    <DataTable
      columns={columns}
      data={treatments}
      enableSorting
      emptyMessage={TREATMENTS_COPY.page.empty}
      mobileColumns={treatmentsMobileColumns}
      mobileActions={mobileActions}
    />
  );
}
