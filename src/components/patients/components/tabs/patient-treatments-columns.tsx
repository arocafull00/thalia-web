import type { ColumnDef } from "@tanstack/react-table";

import SortableTableHead from "@/components/ui/sortable-table-head";
import { PATIENT_DETAIL_COPY } from "@/copy/patient-detail-copy";
import type { PatientTreatmentUsage } from "@/lib/patient-detail-stats";

export function getPatientTreatmentsColumns(): ColumnDef<PatientTreatmentUsage>[] {
  return [
    {
      accessorKey: "name",
      header: ({ column }) => (
        <SortableTableHead
          column={column}
          title={PATIENT_DETAIL_COPY.treatmentsTab.treatment}
        />
      ),
      cell: ({ row }) => (
        <span className="font-medium text-ink">{row.original.name}</span>
      ),
    },
    {
      accessorKey: "count",
      header: ({ column }) => (
        <SortableTableHead
          column={column}
          title={PATIENT_DETAIL_COPY.treatmentsTab.timesUsed}
        />
      ),
      cell: ({ row }) => (
        <span className="tabular-nums text-ink-secondary">
          {row.original.count}
        </span>
      ),
    },
  ];
}
