"use client";

import { useMemo } from "react";

import { getTreatmentsColumns } from "@/components/treatments/components/treatments-columns";
import { TREATMENTS_COPY } from "@/components/treatments/treatments-copy";
import { DataTable } from "@/components/ui/data-table";
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

  return (
    <DataTable
      columns={columns}
      data={treatments}
      enableSorting
      emptyMessage={TREATMENTS_COPY.page.empty}
    />
  );
}
