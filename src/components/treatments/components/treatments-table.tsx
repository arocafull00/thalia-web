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
  onDelete?: (id: string) => void;
  onEdit?: (id: string) => void;
  showPrices?: boolean;
  /** Paginación en servidor: `treatments` es ya la página visible. */
  pagination?: {
    pageIndex: number;
    pageSize: number;
    total: number;
    onPageChange: (pageIndex: number) => void;
  };
};

export default function TreatmentsTable({
  treatments,
  onDelete,
  onEdit,
  showPrices = true,
  pagination,
}: TreatmentsTableProps) {
  const actionHandlers = useMemo(
    () => ({ onDelete, onEdit }),
    [onDelete, onEdit],
  );
  const columns = useMemo(
    () => getTreatmentsColumns(actionHandlers, showPrices),
    [actionHandlers, showPrices],
  );

  return (
    <DataTable
      columns={columns}
      data={treatments}
      manualPagination={pagination}
      emptyMessage={TREATMENTS_COPY.page.empty}
      mobileColumns={treatmentsMobileColumns}
      renderMobileActions={(treatment) => (
        <ListRowActions
          actions={getTreatmentRowActions(treatment, actionHandlers)}
          label={TREATMENTS_COPY.row.actionsLabel}
          variant="menu"
        />
      )}
      getRowHref={(treatment) => `/treatments/${treatment.id}`}
      getRowActions={(treatment) =>
        getTreatmentRowActions(treatment, actionHandlers)
      }
    />
  );
}
