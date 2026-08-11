"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Eye, Pencil, User } from "lucide-react";

import PatientMarketingBadge from "@/components/patients/components/list/patient-marketing-badge";
import ListRowActions from "@/components/ui/list-row-actions";
import type { ProfileAction } from "@/components/ui/profile/profile-action";
import SortableTableHead from "@/components/ui/sortable-table-head";
import { PATIENTS_COPY } from "@/copy/patients-copy";
import type { Patient } from "@/types/database.types";

const { columns, noEmail, noPhone } = PATIENTS_COPY.list;

export type PatientListActionHandlers = {
  onEdit: (id: string) => void;
};

export function getPatientRowActions(
  patient: Patient,
  handlers: PatientListActionHandlers,
): ProfileAction[] {
  return [
    {
      label: PATIENTS_COPY.list.actions.view,
      icon: Eye,
      href: `/patients/${patient.id}`,
    },
    {
      label: PATIENTS_COPY.list.actions.edit,
      icon: Pencil,
      onClick: () => handlers.onEdit(patient.id),
    },
  ];
}

export function buildPatientsColumns(
  handlers: PatientListActionHandlers,
): ColumnDef<Patient>[] {
  return [
    {
      accessorKey: "full_name",
      header: ({ column }) => (
        <SortableTableHead column={column} title={columns.patient} />
      ),
      cell: ({ row }) => (
        <span className="flex min-w-0 items-center gap-2.5">
          <span
            aria-hidden="true"
            className="grid size-7 shrink-0 place-items-center rounded-full bg-primary-subtle text-primary"
          >
            <User size={15} strokeWidth={1.75} />
          </span>
          <span className="truncate font-medium text-ink">
            {row.getValue("full_name")}
          </span>
        </span>
      ),
    },
    {
      accessorKey: "phone",
      header: ({ column }) => (
        <SortableTableHead column={column} title={columns.phone} />
      ),
      cell: ({ row }) => (
        <span className="truncate text-sm text-ink-secondary">
          {row.getValue("phone") ?? noPhone}
        </span>
      ),
      sortingFn: (left, right) => {
        const leftPhone = (left.original.phone ?? "").toLowerCase();
        const rightPhone = (right.original.phone ?? "").toLowerCase();
        return leftPhone.localeCompare(rightPhone, "es");
      },
    },
    {
      accessorKey: "email",
      header: ({ column }) => (
        <SortableTableHead column={column} title={columns.email} />
      ),
      cell: ({ row }) => (
        <span className="truncate text-sm text-ink-secondary">
          {row.getValue("email") ?? noEmail}
        </span>
      ),
      sortingFn: (left, right) => {
        const leftEmail = (left.original.email ?? "").toLowerCase();
        const rightEmail = (right.original.email ?? "").toLowerCase();
        return leftEmail.localeCompare(rightEmail, "es");
      },
    },
    {
      accessorKey: "marketing_opt_in",
      header: ({ column }) => (
        <SortableTableHead column={column} title={columns.marketingOptIn} />
      ),
      cell: ({ row }) => (
        <PatientMarketingBadge optedIn={row.original.marketing_opt_in} />
      ),
      // Ordena agrupando: primero los que sí han consentido.
      sortingFn: (left, right) =>
        Number(right.original.marketing_opt_in) -
        Number(left.original.marketing_opt_in),
    },
    {
      id: "actions",
      header: () => columns.actions,
      cell: ({ row }) => (
        <ListRowActions
          actions={getPatientRowActions(row.original, handlers)}
          label={PATIENTS_COPY.list.actions.label}
        />
      ),
      enableSorting: false,
    },
  ];
}
