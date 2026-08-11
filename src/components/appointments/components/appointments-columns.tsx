"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Eye, Pencil, Trash2 } from "lucide-react";

import AppointmentStatusSelect from "@/components/appointments/components/appointment-status-select";
import AppointmentStockButton from "@/components/appointments/components/appointment-stock-button";
import ListRowActions from "@/components/ui/list-row-actions";
import type { ProfileAction } from "@/components/ui/profile/profile-action";
import SortableTableHead from "@/components/ui/sortable-table-head";
import { APPOINTMENT_STATUS_COPY } from "@/copy/appointment-status-copy";
import { APPOINTMENTS_COPY } from "@/copy/appointments-copy";
import { getAppointmentStockIssue } from "@/lib/appointment-stock";
import {
  appointmentStatusLabel,
  formatDateTime,
  formatTime,
  getTreatmentName,
} from "@/lib/format";
import type {
  AppointmentStatus,
  AppointmentWithRelations,
} from "@/types/database.types";

export function buildAppointmentsColumns(
  onStatusChange: (id: string, status: AppointmentStatus) => void,
  timezone: string,
  actionHandlers: AppointmentListActionHandlers,
): ColumnDef<AppointmentWithRelations>[] {
  return [
    {
      id: "date",
      accessorFn: (row) => row.starts_at,
      header: ({ column }) => (
        <SortableTableHead column={column} title="Fecha" />
      ),
      cell: ({ row }) => {
        return (
          <span className="flex items-center gap-3 text-sm text-ink-secondary">
            <i className="status-orb" aria-hidden="true" />
            {formatDateTime(row.original.starts_at, timezone).split(",")[0]}
          </span>
        );
      },
      sortingFn: (left, right) =>
        new Date(left.original.starts_at).getTime() -
        new Date(right.original.starts_at).getTime(),
    },
    {
      id: "time",
      accessorFn: (row) => row.starts_at,
      header: ({ column }) => (
        <SortableTableHead column={column} title="Hora" />
      ),
      cell: ({ row }) => (
        <span className="font-numeric font-medium tabular-nums text-ink">
          {formatTime(row.original.starts_at, timezone)}
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
        <div onClick={(e) => e.stopPropagation()}>
          <AppointmentStatusSelect
            status={row.original.status}
            onChange={(status) => onStatusChange(row.original.id, status)}
          />
        </div>
      ),
      sortingFn: (left, right) => {
        const leftStatus = appointmentStatusLabel(left.original.status);
        const rightStatus = appointmentStatusLabel(right.original.status);
        return leftStatus.localeCompare(rightStatus, "es");
      },
    },
    {
      id: "stock",
      header: () => APPOINTMENT_STATUS_COPY.stockColumn,
      cell: ({ row }) => (
        <AppointmentStockButton
          issue={getAppointmentStockIssue(row.original)}
        />
      ),
      enableSorting: false,
    },
    {
      id: "actions",
      header: () => APPOINTMENTS_COPY.list.columns.actions,
      cell: ({ row }) => (
        <ListRowActions
          actions={getAppointmentRowActions(row.original, actionHandlers)}
          label={APPOINTMENTS_COPY.list.actions.label}
        />
      ),
      enableSorting: false,
    },
  ];
}

export type AppointmentListActionHandlers = {
  onDelete?: (appointment: AppointmentWithRelations) => void;
  onEdit?: (id: string) => void;
};

export function getAppointmentRowActions(
  appointment: AppointmentWithRelations,
  handlers: AppointmentListActionHandlers,
): ProfileAction[] {
  const actions: ProfileAction[] = [
    {
      label: APPOINTMENTS_COPY.list.actions.view,
      icon: Eye,
      href: `/appointments/${appointment.id}`,
    },
  ];

  if (handlers.onEdit) {
    actions.push({
      label: APPOINTMENTS_COPY.list.actions.edit,
      icon: Pencil,
      onClick: () => handlers.onEdit?.(appointment.id),
    });
  }

  if (handlers.onDelete) {
    actions.push({
      label: APPOINTMENTS_COPY.list.actions.delete,
      icon: Trash2,
      onClick: () => handlers.onDelete?.(appointment),
      variant: "danger",
    });
  }

  return actions;
}
