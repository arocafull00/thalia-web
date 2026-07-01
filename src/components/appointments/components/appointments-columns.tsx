"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";

import SortableTableHead from "@/components/ui/sortable-table-head";
import {
  appointmentStatusLabel,
  formatDateTime,
  formatTime,
} from "@/lib/format";
import type { AppointmentWithRelations } from "@/types/database.types";

function getTreatmentName(appointment: AppointmentWithRelations) {
  return (
    appointment.appointment_treatments[0]?.treatment_types?.name ??
    "Sin tratamiento"
  );
}

export const appointmentsColumns: ColumnDef<AppointmentWithRelations>[] = [
  {
    id: "date",
    accessorFn: (row) => row.starts_at,
    header: ({ column }) => <SortableTableHead column={column} title="Fecha" />,
    cell: ({ row }) => {
      const startsAt = new Date(row.original.starts_at);
      return (
        <span className="text-sm text-ink-secondary">
          {formatDateTime(row.original.starts_at).split(",")[0] ??
            format(startsAt, "dd/MM/yyyy")}
        </span>
      );
    },
  },
  {
    id: "time",
    accessorFn: (row) => row.starts_at,
    header: ({ column }) => <SortableTableHead column={column} title="Hora" />,
    cell: ({ row }) => (
      <span className="font-medium tabular-nums text-ink">
        {formatTime(new Date(row.original.starts_at))}
      </span>
    ),
  },
  {
    id: "patient",
    accessorFn: (row) => row.patients?.full_name ?? "Paciente",
    header: ({ column }) => (
      <SortableTableHead column={column} title="Paciente" />
    ),
    cell: ({ row }) => (
      <span className="truncate font-medium text-ink">
        {row.original.patients?.full_name ?? "Paciente"}
      </span>
    ),
  },
  {
    id: "treatment",
    accessorFn: (row) => getTreatmentName(row),
    header: ({ column }) => (
      <SortableTableHead column={column} title="Servicio" />
    ),
    cell: ({ row }) => (
      <span className="truncate text-sm text-ink-secondary">
        {getTreatmentName(row.original)}
      </span>
    ),
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <SortableTableHead column={column} title="Estado" />
    ),
    cell: ({ row }) => (
      <span className="text-xs uppercase tracking-wide text-ink-secondary">
        {appointmentStatusLabel(row.original.status)}
      </span>
    ),
    sortingFn: (left, right) => {
      const leftStatus = appointmentStatusLabel(left.original.status);
      const rightStatus = appointmentStatusLabel(right.original.status);
      return leftStatus.localeCompare(rightStatus, "es");
    },
  },
];
