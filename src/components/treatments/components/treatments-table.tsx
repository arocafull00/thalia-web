"use client";

import { useMemo } from "react";

import {
  getTreatmentRowActions,
  getTreatmentsColumns,
} from "@/components/treatments/components/treatments-columns";
import { TREATMENTS_COPY } from "@/components/treatments/treatments-copy";
import { DataTable } from "@/components/ui/data-table";
import ListRowActions from "@/components/ui/list-row-actions";
import { treatmentsMobileColumns } from "@/lib/table-mobile-columns";
import type { TreatmentWithInventory } from "@/types/database.types";

type TreatmentsTableProps = {
  treatments: TreatmentWithInventory[];
  onRowClick: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string) => void;
};

export default function TreatmentsTable({
  treatments,
  onRowClick,
  onDelete,
  onEdit,
}: TreatmentsTableProps) {
  const actionHandlers = useMemo(
    () => ({ onDelete, onEdit }),
    [onDelete, onEdit],
  );
  const columns = useMemo(
    () => getTreatmentsColumns(actionHandlers),
    [actionHandlers],
  );

  return (
    <DataTable
      columns={columns}
      data={treatments}
      enableSorting
      emptyMessage={TREATMENTS_COPY.page.empty}
      mobileColumns={treatmentsMobileColumns}
      renderMobileActions={(treatment) => (
        <ListRowActions
          actions={getTreatmentRowActions(treatment, actionHandlers)}
          label={TREATMENTS_COPY.row.actionsLabel}
          variant="menu"
        />
      )}
      onRowClick={(treatment) => onRowClick(treatment.id)}
    />
  );
}
