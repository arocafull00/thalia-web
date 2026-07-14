"use client";

import { useMemo } from "react";

import { getTreatmentsColumns } from "@/components/treatments/components/treatments-columns";
import { TREATMENTS_COPY } from "@/components/treatments/treatments-copy";
import { DataTable } from "@/components/ui/data-table";
import { treatmentsMobileColumns } from "@/lib/table-mobile-columns";
import type { TreatmentWithInventory } from "@/types/database.types";

type TreatmentsTableProps = {
  treatments: TreatmentWithInventory[];
  onRowClick: (id: string) => void;
};

export default function TreatmentsTable({
  treatments,
  onRowClick,
}: TreatmentsTableProps) {
  const columns = useMemo(() => getTreatmentsColumns(), []);

  return (
    <DataTable
      columns={columns}
      data={treatments}
      enableSorting
      emptyMessage={TREATMENTS_COPY.page.empty}
      mobileColumns={treatmentsMobileColumns}
      onRowClick={(treatment) => onRowClick(treatment.id)}
    />
  );
}
